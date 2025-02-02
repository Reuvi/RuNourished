import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Cookbook = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  // Helper function to retrieve a cookie value.
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  // Fetch cookbook data from the API endpoint on mount.
  useEffect(() => {
    const fetchCookbook = async () => {
      try {
        const response = await api.post("/v1/profile/recipes/cookbook", {
          jwt: getCookie("jwt")
        });
        if (response.status === 201 && response.data.data) {
          const fetchedData = response.data.data;
          // Ensure we have an array.
          const fetchedRecipes = Array.isArray(fetchedData)
            ? fetchedData
            : [fetchedData];
          // Map the fetched recipes while preserving all original data.
          // Add fallback values for ingredients_list and instructions.
          const mappedRecipes = fetchedRecipes.map((r, idx) => ({
            id: idx,
            ...r, // Preserves keys like recipe_name, image_url, ingredients_list, instructions, etc.
            ingredients_list: r.ingredients_list || "",
            instructions: r.instructions || "",
            description: r.instructions 
              ? (r.instructions.length > 100 
                  ? r.instructions.substring(0, 100) + "..." 
                  : r.instructions)
              : ""
          }));
          setRecipes(mappedRecipes);
        }
      } catch (error) {
        console.error("Error fetching cookbook:", error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchCookbook();
  }, []);

  // Filter recipes based on the search query.
  const filteredRecipes = recipes.filter(recipe =>
    recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // RecipeCard component displays the recipe image, title, and description.
  // When "View Recipe" is clicked, it navigates to /recipe with the full recipe data in state.
  const RecipeCard = ({ recipe }) => (
    <div className="group relative bg-white bg-opacity-20 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative overflow-hidden">
        <img
          src={recipe.image_url}
          alt={recipe.recipe_name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to="/recipe" state={{ recipe: recipe, fromCookbook: true }}>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              View Recipe
            </button>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold" style={{ color: '#4B0082' }}>
          {recipe.recipe_name}
        </h3>
        <p className="text-sm mb-3" style={{ color: '#4B0082' }}>
          {recipe.description}
        </p>
      </div>
    </div>
  );

  if (loadingRecipes) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-custom">
        <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-2xl" style={{ color: '#4B0082' }}>
          Loading Cookbook...
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-full relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 70% 20%, #9370DB 0%, transparent 25%),
                     radial-gradient(circle at 30% 80%, #9370DB 0%, transparent 25%),
                     linear-gradient(45deg, #A7E8D0, #ADD8E6, #B8B5E1, #F5E6CA)`
      }}
    >
      {/* Floating orb decorative elements */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, #F5E6CA, #ADD8E6)',
          top: '20%',
          left: '60%',
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
      <div
        className="absolute w-32 h-32 rounded-full blur-2xl opacity-50"
        style={{
          background: 'radial-gradient(circle, #B8B5E1, #A7E8D0)',
          top: '60%',
          left: '30%',
          transform: 'translate(-50%, -50%)'
        }}
      ></div>

      <div className="relative container mx-auto px-4 py-8 h-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#4B0082' }}>
            My Cookbook
          </h1>
          <p style={{ color: '#4B0082' }}>All your favorite recipes in one place</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <Search
            className="absolute left-3 top-3"
            style={{ color: '#4B0082' }}
            size={20}
          />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-70 border border-gray-200 rounded-lg focus:outline-none focus:ring-1"
            style={{ color: '#4B0082', borderColor: '#4B0082' }}
          />
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: '#4B0082' }}>
              {searchQuery
                ? "No recipes found matching your search"
                : "No saved recipes yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cookbook;