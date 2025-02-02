import os
import re
import pickle
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from huggingface_hub import InferenceClient, login
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline, AutoConfig
import requests
import json
import gradio as gr
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

API_KEY = os.environ.get("API_KEY")
if not API_KEY:
    raise Exception("Hugging Face API Key not found. Please set the API_KEY environment variable in your .env file.")

# Log in using the API key (suitable for non-notebook environments)
login(token=API_KEY)

model_name = "HuggingFaceH4/zephyr-7b-beta"
client = InferenceClient(model_name, token=API_KEY)

def askAI(prompt, temperature=0.9, max_new_tokens=500, top_p=0.95, repetition_penalty=1.0):
    """
    Sends a text-generation prompt to the Hugging Face Inference API and returns the generated text.
    """
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

# Load pre-trained models
with open('modelRecipe.pkl', 'rb') as f:
    RecipePredictor = pickle.load(f)

with open('scalerElement.pkl', 'rb') as f:
    scalerElement = pickle.load(f)

with open('vectorizerElement.pkl', 'rb') as f:
    vectorizerElement = pickle.load(f)

def change_date_format(dt):
    return re.sub(r'(\d{4})-(\d{1,2})-(\d{1,2})', r'\3/\2/\1', dt)

# Configure Flask application
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

def predict(input_data):
    try:
        numeric_features = np.array(input_data[:7]).reshape(1, -1)
        scaled_input = scalerElement.transform(numeric_features)
        input_ing_trans = vectorizerElement.transform([input_data[7]])
        combined_inputs = np.hstack([scaled_input, input_ing_trans.toarray()])
        
        # Get recommendations using the pre-trained predictor
        distance, indexes = RecipePredictor.kneighbors(combined_inputs)
        recoms = recipes.iloc[indexes[0]]
        return recoms[['recipe_name', 'ingredients_list', 'image_url']].to_dict(orient='records')
    except Exception as e:
        return {"error": str(e)}

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        # Use a sample input for demonstration
        sample_input = [28, 39, 1, 42, 24, 89, 2, 'beef, green peppers']
        result = predict(sample_input)
        
        # Check for errors in prediction
        if isinstance(result, dict) and result.get("error"):
            return jsonify({"error": result["error"]}), 500

        # Select the first recommended recipe details
        selected_recipe = result[0]
        recipe_name = selected_recipe['recipe_name']
        ingredients_list = selected_recipe['ingredients_list']
        
        # Build a prompt to generate numbered recipe instructions that incorporate the provided ingredients
        prompt = (
            f"You are a professional chef and recipe generator. Create a detailed recipe for one serving using the information below.\n\n"
            f"Recipe Name: {recipe_name}\n"
            f"Ingredients: {ingredients_list}\n\n"
            "Instructions: Provide step-by-step instructions to prepare the recipe. Each instruction must be numbered (e.g. '1. ...', '2. ...') with no extra text before or after the numbered list. Ensure that the instructions reference the given ingredients appropriately."
        )
        
        # Generate instructions using askAI
        instructions = askAI(prompt)
        
        # Use regex to extract only numbered steps if extra text is returned
        numbered_steps = "\n".join(re.findall(r'\d+\.\s*.*', instructions))
        if numbered_steps:
            instructions = numbered_steps
        
        # Add generated instructions to the selected recipe
        selected_recipe['instructions'] = instructions
        
        # Return everything as JSON (no console prints)
        return jsonify({"result": selected_recipe})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5004, debug=True)