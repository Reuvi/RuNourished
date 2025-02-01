// src/Home.js
import React, { useState } from "react";
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
  Percent
} from "lucide-react";

function Home() {
  // Two-step form:
  // Step 1: Nutritional Preferences
  // Step 2: Ingredients (with option to add as many as desired)
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    calories: "",
    fat: "",
    carbohydrates: "",
    protein: "",
    cholesterol: "",
    sodium: "",
    fiber: "",
    ingredients: [""]
  });

  // Handler for nutritional fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update a single ingredient
  const handleIngredientChange = (index, e) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = e.target.value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  // Add a new ingredient field
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
    try {
      const response = await api.post("/ai-model", formData);
      console.log("Response from AI model:", response.data);
      // Optionally reset the form or step here
      setStep(1);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="h-full relative overflow-hidden bg-custom">
      {/* Floating decorative orbs */}
      <div className="orb-large"></div>
      <div className="orb-small"></div>

      <div className="relative flex items-center justify-center h-full px-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl my-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Customize Your Recipe Preferences
          </h2>
          <p className="text-center mb-4 text-gray-800">Step {step} of 2</p>
          <form
            onSubmit={step === 2 ? handleSubmit : handleNext}
            className="grid grid-cols-1 gap-6"
          >
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calories Field */}
                <div className="flex flex-col">
                  <label htmlFor="calories" className="mb-1 text-gray-800">
                    <Flame className="inline mr-2" size={20} /> Calories
                  </label>
                  <div className="relative">
                    <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="calories"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                {/* Fat Field */}
                <div className="flex flex-col">
                  <label htmlFor="fat" className="mb-1 text-gray-800">
                    <Droplet className="inline mr-2" size={20} /> Fat (g)
                  </label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="fat"
                      name="fat"
                      value={formData.fat}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                {/* Carbohydrates Field */}
                <div className="flex flex-col">
                  <label htmlFor="carbohydrates" className="mb-1 text-gray-800">
                    <Layers className="inline mr-2" size={20} /> Carbohydrates (g)
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="carbohydrates"
                      name="carbohydrates"
                      value={formData.carbohydrates}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                {/* Protein Field */}
                <div className="flex flex-col">
                  <label htmlFor="protein" className="mb-1 text-gray-800">
                    <Zap className="inline mr-2" size={20} /> Protein (g)
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="protein"
                      name="protein"
                      value={formData.protein}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                {/* Cholesterol Field */}
                <div className="flex flex-col">
                  <label htmlFor="cholesterol" className="mb-1 text-gray-800">
                    <Heart className="inline mr-2" size={20} /> Cholesterol (mg)
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="cholesterol"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                {/* Sodium Field */}
                <div className="flex flex-col">
                  <label htmlFor="sodium" className="mb-1 text-gray-800">
                    <Percent className="inline mr-2" size={20} /> Sodium (mg)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="sodium"
                      name="sodium"
                      value={formData.sodium}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
                {/* Fiber Field */}
                <div className="flex flex-col">
                  <label htmlFor="fiber" className="mb-1 text-gray-800">
                    <Leaf className="inline mr-2" size={20} /> Fiber (g)
                  </label>
                  <div className="relative">
                    <Leaf className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                    <input
                      type="number"
                      id="fiber"
                      name="fiber"
                      value={formData.fiber}
                      onChange={handleChange}
                      className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex flex-col">
                    <label htmlFor={`ingredient-${index}`} className="mb-1 text-gray-800">
                      <Tag className="inline mr-2" size={20} /> Ingredient {index + 1}:
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800" size={20} />
                      <input
                        type="text"
                        id={`ingredient-${index}`}
                        name={`ingredient-${index}`}
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e)}
                        className="p-3 pl-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 transition duration-200"
                        required
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddIngredient}
                  className="flex items-center text-gray-800 hover:text-gray-600 transition"
                >
                  <PlusCircle size={24} className="mr-2" /> Add Ingredient
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
                >
                  Previous
                </button>
              )}
              <div className="ml-auto">
                {step < 2 && (
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
                  >
                    Next
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
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

export default Home;