import React from "react";
import { useLocation, Link } from "react-router-dom";

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
  const { recipe } = location.state || {};

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-xl mb-4">No recipe data available.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  // Parse ingredients if they come as a stringified array.
  let ingredients = [];
  try {
    ingredients = JSON.parse(recipe.ingredients_list);
    if (!Array.isArray(ingredients)) {
      ingredients = recipe.ingredients_list.split(",").map(item => item.trim());
    }
  } catch (error) {
    ingredients = recipe.ingredients_list.split(",").map(item => item.trim());
  }

  // Split instructions into steps based on newline (filtering out empty lines)
  const instructions = recipe.instructions
    .split("\n")
    .filter((line) => line.trim() !== "");

  return (
    <div className="min-h-screen bg-custom flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {recipe.recipe_name}
        </h1>
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.recipe_name}
            className="w-full h-auto mb-6 rounded-lg object-cover"
          />
        )}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <StarRating rating={parseFloat(recipe.aver_rate)} />
            <span className="text-sm text-gray-600">
              {recipe.review_nums} reviews
            </span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 border-b pb-1">
            Ingredients
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {ingredients.map((item, index) => (
              <li key={index} className="text-lg">
                {item}
              </li>
            ))}
          </ul>
        </div>
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
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;