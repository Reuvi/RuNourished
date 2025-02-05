import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Flame,
  Droplet,
  Layers,
  Zap,
  Heart,
  Leaf,
  Tag,
  PlusCircle,
  Percent,
} from "lucide-react";

function RecipeGeneration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    calories: "",
    fat: "",
    carbohydrates: "",
    protein: "",
    cholesterol: "",
    sodium: "",
    fiber: "",
    ingredients: [""],
  });

  // Check if the user is a guest
  const isGuest = document.cookie.includes("guest=true");

  // If guest, display a message and disable the generation feature.
  if (isGuest) {
    return (
      <div className="h-full relative overflow-hidden bg-custom flex items-center justify-center">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-darkerPurple">
            AI Generation Unavailable
          </h2>
          <p className="text-darkerPurple mb-4">
            Guest accounts cannot access the AI generation feature. Please sign up for full access.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-darkerPurple text-white py-2 px-4 rounded hover:bg-darkerPurple/90 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = e.target.value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Randomize numeric fields (except protein)
      const randomizedData = {
        calories: Math.floor(Math.random() * parseFloat(formData.calories)),
        fat: Math.floor(Math.random() * parseFloat(formData.fat)),
        carbohydrates: Math.floor(Math.random() * parseFloat(formData.carbohydrates)),
        protein: formData.protein,
        cholesterol: Math.floor(Math.random() * parseFloat(formData.cholesterol)),
        sodium: Math.floor(Math.random() * parseFloat(formData.sodium)),
        fiber: Math.floor(Math.random() * parseFloat(formData.fiber)),
        ingredients: formData.ingredients,
      };

      const response = await api.post("/v1/ai/get_recipe", {
        ...randomizedData,
        values: getCookie("values"),
        jwt: getCookie("jwt"),
      });
      console.log("Response from AI model:", response.data);

      // Navigate to the recipe details page and pass the recipe data via state
      navigate("/recipe", { state: { recipe: response.data.recipe.result } });
      setStep(1);
    } catch (error) {
      console.error("Error posting data:", error);
      setLoading(false);
    }
  };

  const handleFillEmptyFields = (e) => {
    e.preventDefault();
    const newFormData = { ...formData };
    if (!newFormData.calories) newFormData.calories = "1000";
    if (!newFormData.fat) newFormData.fat = "50";
    if (!newFormData.carbohydrates) newFormData.carbohydrates = "150";
    if (!newFormData.protein) newFormData.protein = "100";
    if (!newFormData.cholesterol) newFormData.cholesterol = "300";
    if (!newFormData.sodium) newFormData.sodium = "1500";
    if (!newFormData.fiber) newFormData.fiber = "20";
    setFormData(newFormData);
  };

  const nextIndex = formData.ingredients.length;
  const leftIndices = formData.ingredients
    .map((_, i) => i)
    .filter((i) => i % 2 === 0);
  const rightIndices = formData.ingredients
    .map((_, i) => i)
    .filter((i) => i % 2 === 1);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-custom">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-2xl text-darkerPurple">
          Generating your recipe...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden bg-custom">
      {/* Floating decorative orbs */}
      <div className="orb-large"></div>
      <div className="orb-small"></div>

      <div className="relative flex items-center justify-center h-full px-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-4xl my-10">
          <h2 className="text-3xl font-bold mb-6 text-darkerPurple text-center">
            Generate Your Recipe
          </h2>
          <p className="text-center mb-4 text-darkerPurple">
            Step {step} of 2
          </p>
          <form
            onSubmit={step === 2 ? handleSubmit : handleNext}
            className="grid grid-cols-1 gap-6"
          >
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                <div className="flex flex-col">
                  <label htmlFor="calories" className="mb-1 text-darkerPurple">
                    <Flame className="inline mr-2 text-darkerPurple" size={20} />
                    Calories
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="calories"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="fat" className="mb-1 text-darkerPurple">
                    <Droplet className="inline mr-2 text-darkerPurple" size={20} />
                    Fat (g)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="fat"
                      name="fat"
                      value={formData.fat}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="carbohydrates" className="mb-1 text-darkerPurple">
                    <Layers className="inline mr-2 text-darkerPurple" size={20} />
                    Carbohydrates (g)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="carbohydrates"
                      name="carbohydrates"
                      value={formData.carbohydrates}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="protein" className="mb-1 text-darkerPurple">
                    <Zap className="inline mr-2 text-darkerPurple" size={20} />
                    Protein (g)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="protein"
                      name="protein"
                      value={formData.protein}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="cholesterol" className="mb-1 text-darkerPurple">
                    <Heart className="inline mr-2 text-darkerPurple" size={20} />
                    Cholesterol (mg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="cholesterol"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sodium" className="mb-1 text-darkerPurple">
                    <Percent className="inline mr-2 text-darkerPurple" size={20} />
                    Sodium (mg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="sodium"
                      name="sodium"
                      value={formData.sodium}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="fiber" className="mb-1 text-darkerPurple">
                    <Leaf className="inline mr-2 text-darkerPurple" size={20} />
                    Fiber (g)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="fiber"
                      name="fiber"
                      value={formData.fiber}
                      onChange={handleChange}
                      className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                <div className="flex flex-col gap-4">
                  {leftIndices.map((i) => (
                    <div key={i} className="flex flex-col">
                      <label htmlFor={`ingredient-${i}`} className="mb-1 text-darkerPurple">
                        <Tag className="inline mr-2 text-darkerPurple" size={20} /> 
                        Ingredient {i + 1}:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id={`ingredient-${i}`}
                          name={`ingredient-${i}`}
                          value={formData.ingredients[i]}
                          onChange={(e) => handleIngredientChange(i, e)}
                          className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  {nextIndex % 2 === 0 && (
                    <button
                      onClick={handleAddIngredient}
                      className="flex items-center text-darkerPurple hover:text-darkerPurple/80 transition"
                    >
                      <PlusCircle size={24} className="mr-2" /> Add Ingredient
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  {rightIndices.map((i) => (
                    <div key={i} className="flex flex-col">
                      <label htmlFor={`ingredient-${i}`} className="mb-1 text-darkerPurple">
                        <Tag className="inline mr-2 text-darkerPurple" size={20} /> 
                        Ingredient {i + 1}:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id={`ingredient-${i}`}
                          name={`ingredient-${i}`}
                          value={formData.ingredients[i]}
                          onChange={(e) => handleIngredientChange(i, e)}
                          className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  {nextIndex % 2 === 1 && (
                    <button
                      onClick={handleAddIngredient}
                      className="flex items-center text-darkerPurple hover:text-darkerPurple/80 transition"
                    >
                      <PlusCircle size={24} className="mr-2" /> Add Ingredient
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between mt-6">
              {step === 1 ? (
                <button
                  onClick={handleFillEmptyFields}
                  type="button"
                  className="bg-gray-300 text-darkerPurple py-2 px-4 rounded hover:bg-gray-400 transition"
                >
                  Fill Empty Fields With Default
                </button>
              ) : (
                <button
                  onClick={handlePrev}
                  className="bg-darkerPurple/50 text-white py-2 px-4 rounded hover:bg-darkerPurple/40 transition"
                >
                  Previous
                </button>
              )}
              <div className="ml-auto">
                {step < 2 && (
                  <button
                    type="submit"
                    className="bg-darkerPurple text-white py-2 px-4 rounded hover:bg-darkerPurple/90 transition"
                  >
                    Next
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    className="bg-darkerPurple text-white py-2 px-4 rounded hover:bg-darkerPurple/90 transition"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeGeneration;