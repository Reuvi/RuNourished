import React, { useState } from "react";
import api from "../api/api"; // Ensure your API instance is correctly configured

function Home() {
  const [formData, setFormData] = useState({
    recipe_id: "",
    recipe_name: "",
    aver_rate: "",
    review_nums: "",
    calories: "",
    fat: "",
    carbohydrates: "",
    protein: "",
    cholesterol: "",
    sodium: "",
    fiber: "",
    ingredients_list: ""
  });

  // Update state when input values change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission and post data to the AI model endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/ai-model", formData);
      console.log("Response from AI model:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-deeperPurple">
        Submit Recipe Data
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="recipe_id" className="mb-1">
            Recipe ID
          </label>
          <input
            type="text"
            id="recipe_id"
            name="recipe_id"
            value={formData.recipe_id}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="recipe_name" className="mb-1">
            Recipe Name
          </label>
          <input
            type="text"
            id="recipe_name"
            name="recipe_name"
            value={formData.recipe_name}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="aver_rate" className="mb-1">
            Average Rating
          </label>
          <input
            type="number"
            id="aver_rate"
            name="aver_rate"
            value={formData.aver_rate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="review_nums" className="mb-1">
            Review Numbers
          </label>
          <input
            type="number"
            id="review_nums"
            name="review_nums"
            value={formData.review_nums}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="calories" className="mb-1">
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fat" className="mb-1">
            Fat
          </label>
          <input
            type="number"
            id="fat"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="carbohydrates" className="mb-1">
            Carbohydrates
          </label>
          <input
            type="number"
            id="carbohydrates"
            name="carbohydrates"
            value={formData.carbohydrates}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="protein" className="mb-1">
            Protein
          </label>
          <input
            type="number"
            id="protein"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="cholesterol" className="mb-1">
            Cholesterol
          </label>
          <input
            type="number"
            id="cholesterol"
            name="cholesterol"
            value={formData.cholesterol}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="sodium" className="mb-1">
            Sodium
          </label>
          <input
            type="number"
            id="sodium"
            name="sodium"
            value={formData.sodium}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fiber" className="mb-1">
            Fiber
          </label>
          <input
            type="number"
            id="fiber"
            name="fiber"
            value={formData.fiber}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="ingredients_list" className="mb-1">
            Ingredients List
          </label>
          <textarea
            id="ingredients_list"
            name="ingredients_list"
            value={formData.ingredients_list}
            onChange={handleChange}
            className="p-2 border rounded"
            rows="4"
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-deeperPurple text-white p-2 rounded hover:bg-purple-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Home;
