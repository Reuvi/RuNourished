import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api/api";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center space-x-1">
      {Array(fullStars)
        .fill(null)
        .map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-500">
            ★
          </span>
        ))}
      {Array(emptyStars)
        .fill(null)
        .map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
    </div>
  );
}

const RecipeDetails = () => {
  const location = useLocation();
  const initialRecipe = location.state?.recipe;
  const [currentRecipe, setCurrentRecipe] = useState(initialRecipe);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // If no recipe is available, show an error view.
  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-xl mb-4">No recipe data available.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  // Helper function to retrieve a cookie value.
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Function to regenerate the recipe.
  const handleRegenerate = async () => {
    setLoading(true);
    try {
      // We'll attempt to get a new recipe until it's different from the current one.
      const maxAttempts = 10;
      let attempts = 0;
      let newRecipe = currentRecipe;
      while (attempts < maxAttempts) {
        // Build the randomized nutritional data using the current recipe's values.
        const randomizedData = {
          calories: Math.floor(
            Math.random() * parseFloat(currentRecipe.calories)
          ),
          fat: Math.floor(Math.random() * parseFloat(currentRecipe.fat)),
          carbohydrates: Math.floor(
            Math.random() * parseFloat(currentRecipe.carbohydrates)
          ),
          protein: currentRecipe.protein, // no randomization for protein
          cholesterol: Math.floor(
            Math.random() * parseFloat(currentRecipe.cholesterol)
          ),
          sodium: Math.floor(Math.random() * parseFloat(currentRecipe.sodium)),
          fiber: Math.floor(Math.random() * parseFloat(currentRecipe.fiber)),
        };

        // Extract ingredients from the current recipe.
        let rawIngredients = [];
        try {
          rawIngredients = JSON.parse(currentRecipe.ingredients_list);
          if (!Array.isArray(rawIngredients)) {
            rawIngredients = currentRecipe.ingredients_list
              .split(",")
              .map((item) => item.trim());
          }
        } catch (err) {
          rawIngredients = currentRecipe.ingredients_list
            .split(",")
            .map((item) => item.trim());
        }
        randomizedData.ingredients = rawIngredients;

        // Make the API call to get a new recipe.
        const response = await api.post("/v1/ai/get_recipe", {
          ...randomizedData,
          values: getCookie("values"),
          jwt: getCookie("jwt"),
        });
        newRecipe = response.data.recipe.result;

        // If the new recipe's name differs from the current one, exit the loop.
        if (newRecipe.recipe_name !== currentRecipe.recipe_name) {
          break;
        }
        attempts++;
      }
      setCurrentRecipe(newRecipe);
    } catch (error) {
      console.error("Error regenerating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to save the current recipe.
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post("/v1/profile/recipes/save", {
        recipe: currentRecipe,
        jwt: getCookie("jwt"),
      });
      console.log("Recipe saved successfully:", response.data);
      // Optionally display a success message or toast notification here.
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  // Process the ingredients so they display nicely.
  let rawIngredients = [];
  try {
    rawIngredients = JSON.parse(currentRecipe.ingredients_list);
    if (!Array.isArray(rawIngredients)) {
      rawIngredients = currentRecipe.ingredients_list
        .split(",")
        .map((item) => item.trim());
    }
  } catch (err) {
    rawIngredients = currentRecipe.ingredients_list
      .split(",")
      .map((item) => item.trim());
  }
  const ingredients = rawIngredients.map((item) =>
    item
      .replace(/[\[\]]+/g, "")
      .replace(/^['"]+|['"]+$/g, "")
      .trim()
  );

  // Process the instructions by stripping any existing numbering.
  const rawInstructions = currentRecipe.instructions
    .split("\n")
    .filter((line) => line.trim() !== "");
  const instructions = rawInstructions.map((line) =>
    line.replace(/^\s*\d+\.\s*/, "")
  );

  // Show a loading skeleton when regenerating.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-custom">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-2xl text-darkerPurple">
          Regenerating your recipe...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {currentRecipe.recipe_name}
        </h1>

        {/* Image */}
        {currentRecipe.image_url && (
          <img
            src={currentRecipe.image_url}
            alt={currentRecipe.recipe_name}
            className="w-full h-auto mb-6 rounded-lg object-cover"
          />
        )}

        {/* Ratings & Reviews */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <StarRating rating={parseFloat(currentRecipe.aver_rate)} />
            <span className="text-sm text-gray-600">
              {currentRecipe.review_nums} reviews
            </span>
          </div>
        </div>

        {/* Nutritional Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Nutrition Facts
          </h2>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <strong>Calories:</strong> {currentRecipe.calories}
            </div>
            <div>
              <strong>Fat:</strong> {currentRecipe.fat} g
            </div>
            <div>
              <strong>Carbs:</strong> {currentRecipe.carbohydrates} g
            </div>
            <div>
              <strong>Protein:</strong> {currentRecipe.protein} g
            </div>
            <div>
              <strong>Cholesterol:</strong> {currentRecipe.cholesterol} mg
            </div>
            <div>
              <strong>Sodium:</strong> {currentRecipe.sodium} mg
            </div>
            <div>
              <strong>Fiber:</strong> {currentRecipe.fiber} g
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Ingredients
          </h2>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {instructions.map((step, index) => (
              <li key={index} className="text-lg">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </Link>
          <button
            onClick={handleRegenerate}
            className="inline-block bg-darkerPurple text-white py-2 px-4 rounded hover:bg-darkerPurple/90 transition"
          >
            Regenerate Recipe
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            {saving ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;