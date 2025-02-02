import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Tag, Image } from "lucide-react";

function IngredientGeneration() {
  const [activeTab, setActiveTab] = useState("text"); // "text" or "image"
  const [recipeName, setRecipeName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Handler for text input
  const handleTextChange = (e) => {
    setRecipeName(e.target.value);
  };

  // Handler for image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Convert file to Base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data prefix, leaving only the Base64 string
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit handler for both modes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "text") {
        // Post using recipe name text
        const response = await api.post("/v1/ai/get_ingredient", {
          recipeName,
          values: getCookie("values"),
          jwt: getCookie("jwt"),
        });
        console.log("Response from AI model (text):", response.data);
        // Assuming backend returns: { message: "AI Success", data: { ingredient: { result: [ ... ] } } }
        const firstResult = response.data.data.ingredient.result[0];
        navigate("/ingredient", { state: { ingredient: firstResult } });
      } else if (activeTab === "image") {
        // Convert selected image to Base64
        const base64Image = await fileToBase64(selectedImage);
        // Post using image upload
        const response = await api.post("/v1/ai/get_ingredient_image", {
          image: base64Image,
          values: getCookie("values"),
          jwt: getCookie("jwt"),
        });
        console.log("Response from AI model (image):", response.data);
        const firstResult = response.data.data.ingredient.result[0];
        navigate("/ingredient", { state: { ingredient: firstResult } });
      }
    } catch (error) {
      console.error("Error posting data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-custom">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-2xl text-darkerPurple">
          Generating your ingredient...
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
        {/* Transparent form container with strong blur */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-md my-10">
          <h2 className="text-3xl font-bold mb-6 text-darkerPurple text-center">
            Generate Ingredients
          </h2>
          {/* Circular Tab Navigation */}
          <div className="flex justify-center mb-4 space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`w-20 h-10 flex items-center justify-center rounded-full transition ${
                activeTab === "text"
                  ? "bg-darkerPurple text-white"
                  : "bg-gray-200 text-darkerPurple"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`w-20 h-10 flex items-center justify-center rounded-full transition ${
                activeTab === "image"
                  ? "bg-darkerPurple text-white"
                  : "bg-gray-200 text-darkerPurple"
              }`}
            >
              Image
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {activeTab === "text" && (
              <div className="flex flex-col">
                <label htmlFor="recipeName" className="mb-1 text-darkerPurple">
                  <Tag className="inline mr-2 text-darkerPurple" size={20} />
                  Recipe Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="recipeName"
                    name="recipeName"
                    value={recipeName}
                    onChange={handleTextChange}
                    className="w-full p-3 bg-white bg-opacity-70 border border-gray-200 rounded-md focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition duration-200"
                    required
                  />
                </div>
              </div>
            )}
            {activeTab === "image" && (
              <div className="flex flex-col">
                <label htmlFor="imageUpload" className="mb-1 text-darkerPurple">
                  <Image className="inline mr-2 text-darkerPurple" size={20} />
                  Upload Image
                </label>
                <div className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md bg-white bg-opacity-70 cursor-pointer">
                  {selectedImage ? (
                    <div className="mb-2">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="max-h-48 object-contain"
                      />
                    </div>
                  ) : (
                    <p className="mb-2 text-gray-500 text-center">
                      Drag and drop an image or click to select
                    </p>
                  )}
                  <input
                    type="file"
                    id="imageUpload"
                    name="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                    required
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-darkerPurple text-white py-2 px-4 rounded hover:bg-darkerPurple/90 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default IngredientGeneration;