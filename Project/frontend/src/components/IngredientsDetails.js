import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const IngredientDetails = () => {
  const location = useLocation();
  // Expect the ingredient data to be passed in location.state.ingredient
  const initialData = location.state?.ingredient;
  const [ingredientData] = useState(initialData);

  if (!ingredientData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-xl mb-4">No ingredient data available.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  // If ingredientData is an array, we take the first element
  const details = Array.isArray(ingredientData) ? ingredientData[0] : ingredientData;

  // Process the ingredients list; try JSON parsing first, then fallback to comma-splitting.
  let rawIngredients = [];
  if (details.ingredients_list) {
    try {
      rawIngredients = JSON.parse(details.ingredients_list);
      if (!Array.isArray(rawIngredients)) {
        rawIngredients = details.ingredients_list.split(",").map((item) => item.trim());
      }
    } catch (err) {
      rawIngredients = details.ingredients_list.split(",").map((item) => item.trim());
    }
  }
  const ingredients = rawIngredients.filter((item) => item !== "");

  return (
    <div className="min-h-screen bg-custom flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">
          {details.recipe_name}
        </h1>
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
        <div className="flex justify-center">
          <Link
            to="/ingredient/generate"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Back to Ingredient Generator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;