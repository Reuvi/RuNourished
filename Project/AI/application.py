import os
import re
import base64
import cv2
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from huggingface_hub import InferenceClient, login
from joblib import load  # For memory mapping
from dotenv import load_dotenv
import psutil  # For memory usage logging
from ultralytics import YOLO  # For YOLOv8 object detection
import gc  # For explicit garbage collection

# Limit thread usage to reduce memory overhead.
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

# Load environment variables from .env file
load_dotenv()

API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    raise Exception("Hugging Face API Key not found. Please set the API_KEY environment variable in your .env file.")

# Log in using the API key
login(token=API_KEY)

# Initialize Hugging Face Inference Client
model_name = "HuggingFaceH4/zephyr-7b-beta"
client = InferenceClient(model_name, token=API_KEY)

def askAI(prompt, temperature=0.9, max_new_tokens=300, top_p=0.95, repetition_penalty=1.0):
    """
    Sends a text-generation prompt to the Hugging Face Inference API and returns the generated text.
    Lowering max_new_tokens reduces peak memory usage.
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

# Specify dtypes to reduce memory usage when loading the recipes dataset.
dtype_spec = {
    'calories': 'float16',
    'fat': 'float16',
    'carbohydrates': 'float16',
    'protein': 'float16',
    'cholesterol': 'float16',
    'sodium': 'float16',
    'fiber': 'float16'
    # Add any additional numeric columns as needed.
}
recipes = pd.read_csv('recipe_final (1).csv', low_memory=True, dtype=dtype_spec)

def predict(input_data, RecipePredictor, scalerElement, vectorizerElement):
    """
    Given an input array (numerical nutritional values and ingredients string), scales
    and vectorizes the features, then returns recommended recipes.
    """
    try:
        feature_names = ['calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']
        numeric_features = pd.DataFrame([input_data[:7]], columns=feature_names)
        # Use float16 for lower memory usage.
        scaled_input = scalerElement.transform(numeric_features).astype(np.float16)
        
        ingredient_weight = 1000.0
        input_ing_trans = vectorizerElement.transform([input_data[7]]) * ingredient_weight
        input_ing_dense = input_ing_trans.toarray().astype(np.float16)
        
        combined_inputs = np.hstack([scaled_input, input_ing_dense])
        distance, indexes = RecipePredictor.kneighbors(combined_inputs)
        recoms = recipes.iloc[indexes[0]]
        
        # Delete temporary arrays and force garbage collection.
        del numeric_features, scaled_input, input_ing_trans, input_ing_dense, combined_inputs
        gc.collect()
        
        return recoms[['recipe_name', 'ingredients_list', 'image_url', 'aver_rate', 'review_nums', 
                       'calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']].to_dict(orient='records')
    except Exception as e:
        return {"error": str(e)}

# Configure Flask application
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True  # Disable in production if desired

@app.after_request
def after_request(response):
    # Set no-cache headers.
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    
    # Log current memory usage.
    process = psutil.Process(os.getpid())
    mem_usage_mb = process.memory_info().rss / (1024 * 1024)
    print("Current memory usage: {:.2f} MB".format(mem_usage_mb))
    
    gc.collect()
    return response

@app.route("/ai-model", methods=["POST"])
def ai_model():
    """
    Expects a JSON payload with nutritional values and a list of ingredients.
    Returns a recommended recipe with generated instructions.
    Loads heavy models on demand and clears them after use.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

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

        ingredients_list = data.get("ingredients", [])
        if not isinstance(ingredients_list, list):
            return jsonify({"error": "Ingredients must be a list"}), 400
        ingredients_str = ", ".join(ing.strip() for ing in ingredients_list if ing.strip())

        input_data = [calories, fat, carbohydrates, protein, cholesterol, sodium, fiber, ingredients_str]

        # Load models on demand.
        RecipePredictor = load('modelRecipe.pkl', mmap_mode='r')
        scalerElement = load('scalerElement.pkl', mmap_mode='r')
        vectorizerElement = load('vectorizerElement.pkl', mmap_mode='r')

        result = predict(input_data, RecipePredictor, scalerElement, vectorizerElement)

        # Clear models from memory.
        del RecipePredictor, scalerElement, vectorizerElement
        gc.collect()

        if isinstance(result, dict) and result.get("error"):
            return jsonify({"error": result["error"]}), 500

        selected_recipe = result[0]
        recipe_name = selected_recipe['recipe_name']
        ingr_str = selected_recipe['ingredients_list']

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
    Uses the IngredientPredictor (a NearestNeighbors model) to return recommendations.
    Loads required models on demand and clears them after use.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        recipe_name = data.get("recipeName")
        if not recipe_name:
            return jsonify({"error": "No recipe name provided"}), 400

        # Load ingredient prediction models on demand.
        vectorizerIngredient = load('vectorizerIngredient.pkl', mmap_mode='r')
        IngredientPredictor = load('modelIngredients.pkl', mmap_mode='r')

        query_vec = vectorizerIngredient.transform([recipe_name])
        distances, indexes = IngredientPredictor.kneighbors(query_vec)
        
        recommended = recipes.iloc[indexes[0]][['recipe_name', 'ingredients_list']].to_dict(orient='records')

        # Clear the models from memory.
        del vectorizerIngredient, IngredientPredictor
        gc.collect()

        return jsonify({"result": recommended})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/detect-ingredients", methods=["POST"])
def detect_ingredients():
    """
    Expects a JSON payload with a Base64-encoded image under the key "image".
    Runs YOLO inference to detect objects and returns a list of unique object names.
    Loads the YOLO model on demand and clears it after use.
    """
    try:
        data = request.get_json()
        if not data or "image" not in data:
            return jsonify({"error": "No image provided in JSON with key 'image'"}), 400

        image_b64 = data["image"]
        image_bytes = base64.b64decode(image_b64)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"error": "Failed to decode image"}), 400

        # Lower resolution input to reduce memory usage.
        max_dimension = 600  # Reduced from 800.
        height, width = img.shape[:2]
        if max(height, width) > max_dimension:
            scaling_factor = max_dimension / float(max(height, width))
            new_size = (int(width * scaling_factor), int(height * scaling_factor))
            img = cv2.resize(img, new_size, interpolation=cv2.INTER_AREA)
        
        # Load YOLO model on demand.
        yolo_model = YOLO('yolov8s.pt')
        results = yolo_model(source=img, conf=0.4, show=False)
        boxes_data = results[0].boxes.data.cpu().numpy().tolist()
        detected_objects = [yolo_model.names[int(box[-1])] for box in boxes_data]
        unique_objects = list(set(detected_objects))
        
        # Clear image and YOLO model from memory.
        del yolo_model, img, nparr, image_bytes
        gc.collect()
        
        return jsonify({"ingredients": unique_objects})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)