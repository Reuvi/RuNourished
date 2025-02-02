import os
import re
import pickle
from flask import Flask, request, jsonify, Response
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from huggingface_hub import InferenceClient, login, notebook_login
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline, AutoConfig
import requests
import json
import os
import gradio as gr
 

API_KEY = os.environ.get("API_KEY")
notebook_login()
model_name = "HuggingFaceH4/zephyr-7b-beta"
client = InferenceClient(model_name, token=API_KEY)

# Load and run the model:
def askAI(prompt,  temperature=0.9, max_new_tokens=500, top_p=0.95, repetition_penalty=1.0,):
    temperature = float(temperature)
    if temperature < 1e-2:
        temperature = 1e-2
    top_p = float(top_p)

    generate_kwargs = dict(
        temperature=temperature,
        max_new_tokens=max_new_tokens,
        top_p=top_p,
        repetition_penalty=repetition_penalty,
        do_sample=True,
        seed=42,
    )

    stream = client.text_generation(prompt, **generate_kwargs, stream=True, details=True, return_full_text=False)
    output = ""

    for response in stream:
        output += response.token.text
        yield output
    return output


# Load dataset
recipes = pd.read_csv('recipe_final (1).csv')

# Load pre-trained models
with open('modelRecipe.pkl', 'rb') as f:
    RecipePredictor = pickle.load(f)

with open('scalerElement.pkl', 'rb') as f:
    scalerElement = pickle.load(f)

with open('vectorizerElement.pkl', 'rb') as f:
    vectorizerElement = pickle.load(f)

# Function to change date format
def change_date_format(dt):
    return re.sub(r'(\d{4})-(\d{1,2})-(\d{1,2})', r'\3/\2/\1', dt)

# Configure Flask application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Recipe recommendation function
def predict(input):
    try:
        numeric_features = np.array(input[:7]).reshape(1, -1)
        scaled_input = scalerElement.transform(numeric_features)
        input_ing_trans = vectorizerElement.transform([input[7]])
        combined_inputs = np.hstack([scaled_input, input_ing_trans.toarray()])
        
        # Get recommendations
        distance, indexes = RecipePredictor.kneighbors(combined_inputs)
        recoms = recipes.iloc[indexes[0]]
        return recoms[['recipe_name', 'ingredients_list', 'image_url']].to_dict(orient='records')

    except Exception as e:
        return {"error": str(e)}

# Route to handle both GET and POST requests
@app.route("/", methods=["GET", "POST"])
def index():
    try:
        if request.method == "GET":
            """data = request.get_json()
            if not data or "data" not in data:
                return jsonify({"error": "Invalid JSON data"}), 400"""
            
            sample_input = [28, 39, 1, 42, 24, 89, 2, 'beef, green peppers']
            result = predict(sample_input)
            # Fetch the recipe for the predicted recipe name
            recipe_des = "".join(askAI(f"What is the recipe for {result[0]['recipe_name']}, {result[1]['recipe_name']} or {result[2]['recipe_name']} tell me the prep for one serving and select the one which kosher"))

            
            # Add the recipe to the result
            """data = recipe_des.json()
            json_str = json.dumps(data)
            Recipe_str = json.loads(json_str)
            print(Recipe_str['choices'][0]['message']['content'])
            result[0]['recipe_des'] = Recipe_str['choices'][0]['message']['content']"""

            print(f"The result is {recipe_des}")
            return jsonify({"result": result[0]})

        else:
            sample_input = [28, 39, 1, 42, 24, 89, 2, 'green pepper']
            result = predict(sample_input)
            return f"<p>Prediction Result: {result}</p>"

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(port=5004, debug=True)
