import os
import re
import pickle
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from huggingface_hub import InferenceClient, login
from joblib import load  # Use joblib for memory mapping
from dotenv import load_dotenv
import psutil  # For memory usage checks

# Load environment variables from .env file
load_dotenv()

API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    raise Exception("Hugging Face API Key not found. Please set the API_KEY environment variable in your .env file.")

# Log in using the API key
login(token=API_KEY)

model_name = "HuggingFaceH4/zephyr-7b-beta"
client = InferenceClient(model_name, token=API_KEY)

def askAI(prompt, temperature=0.9, max_new_tokens=500, top_p=0.95, repetition_penalty=1.0):
    """
    Sends a text-generation prompt to the Hugging Face Inference API and returns the generated text.
    """
    temperature = max(float(temperature), 1e-2)
    top_p = float(top_p)

    generate_kwargs = dict(
        temperature=temperature,
        max_new_tokens=max_new_tokens,
        top_p=top_p,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )

    try:
        stream = client.text_generation(
            prompt,
            **generate_kwargs,
            stream=True,
            details=True,
            return_full_text=False
        )
    except Exception as e:
        return f"Error calling Hugging Face API: {str(e)}"

    output = ""
    for response in stream:
        output += response.token.text
    return output.strip()

# Load dataset
recipes = pd.read_csv('recipe_final (1).csv')

# Load pre-trained models using joblib with memory mapping
RecipePredictor = load('modelRecipe.pkl', mmap_mode='r')
scalerElement = load('scalerElement.pkl', mmap_mode='r')
vectorizerElement = load('vectorizerElement.pkl', mmap_mode='r')
IngredientPredictor = load('modelIngredients.pkl', mmap_mode='r')

def change_date_format(dt):
    return re.sub(r'(\d{4})-(\d{1,2})-(\d{1,2})', r'\3/\2/\1', dt)

# Configure Flask application
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.after_request
def after_request(response):
    # Set no-cache headers
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    
    # Check and print current memory usage in MB to the console
    process = psutil.Process(os.getpid())
    mem_usage_mb = process.memory_info().rss / (1024 * 1024)
    print("Current memory usage: {:.2f} MB".format(mem_usage_mb))
    
    return response

def predict(input_data):
    """
    Given an input array (numerical nutritional values and ingredients string), scales
    and vectorizes the features, then returns recommended recipes.
    """
    try:
        # Prepare numerical features
        feature_names = ['calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']
        numeric_features = pd.DataFrame([input_data[:7]], columns=feature_names)
        scaled_input = scalerElement.transform(numeric_features)
        
        # Process ingredient features using TF-IDF and scale with a weight
        ingredient_weight = 1000.0
        input_ing_trans = vectorizerElement.transform([input_data[7]]) * ingredient_weight
        
        # Combine features and retrieve recommendations
        combined_inputs = np.hstack([scaled_input, input_ing_trans.toarray()])
        distance, indexes = RecipePredictor.kneighbors(combined_inputs)
        recoms = recipes.iloc[indexes[0]]
        
        return recoms[['recipe_name', 'ingredients_list', 'image_url', 'aver_rate', 'review_nums', 
                       'calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']].to_dict(orient='records')
    except Exception as e:
        return {"error": str(e)}

@app.route("/ai-model", methods=["POST"])
def ai_model():
    """
    Expects a JSON payload with nutritional values and a list of ingredients.
    Returns a recommended recipe with generated instructions.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Convert nutritional fields to float
        try:
            calories = float(data.get("calories", 0))
            fat = float(data.get("fat", 0))
            carbohydrates = float(data.get("carbohydrates", 0))
            protein = float(data.get("protein", 0))
            cholesterol = float(data.get("cholesterol", 0))
            sodium = float(data.get("sodium", 0))
            fiber = float(data.get("fiber", 0))
        except Exception as e:
            return jsonify({"error": f"Invalid nutritional value: {e}"}), 400

        # Process ingredients (expected as a list)
        ingredients_list = data.get("ingredients", [])
        if not isinstance(ingredients_list, list):
            return jsonify({"error": "Ingredients must be a list"}), 400

        ingredients_str = ", ".join(ing.strip() for ing in ingredients_list if ing.strip() != "")

        # Build input for the predictor
        input_data = [calories, fat, carbohydrates, protein, cholesterol, sodium, fiber, ingredients_str]
        result = predict(input_data)
        if isinstance(result, dict) and result.get("error"):
            return jsonify({"error": result["error"]}), 500

        # Select the first recommended recipe
        selected_recipe = result[0]
        recipe_name = selected_recipe['recipe_name']
        ingr_str = selected_recipe['ingredients_list']

        # Build a prompt to generate recipe instructions
        prompt = (
            f"You are a professional chef and recipe generator. Create a detailed recipe for one serving using the information below.\n\n"
            f"Recipe Name: {recipe_name}\n"
            f"Ingredients: {ingr_str}\n\n"
            "Instructions: Provide step-by-step instructions to prepare the recipe. Each instruction must be numbered (e.g. '1. ...', '2. ...') with no extra text before or after the numbered list. Ensure that the instructions reference the given ingredients appropriately."
        )

        instructions = askAI(prompt)
        numbered_steps = "\n".join(re.findall(r'\d+\.\s*.*', instructions))
        if numbered_steps:
            instructions = numbered_steps

        selected_recipe['instructions'] = instructions

        return jsonify({"result": selected_recipe})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ai-model-ingredients", methods=["POST"])
def ai_model_ingredients():
    """
    Expects a JSON payload with a "recipeName" key.
    Uses the IngredientPredictor to predict ingredients from the recipe name.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        recipe_name = data.get("recipeName")
        if not recipe_name:
            return jsonify({"error": "No recipe name provided"}), 400

        # Use the IngredientPredictor model (assumed to have a .predict() method) for testing
        prediction = IngredientPredictor.predict([recipe_name])
        return jsonify({"result": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)