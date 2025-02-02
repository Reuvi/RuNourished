const mongoose = require("mongoose");

/*
{
    name: bob
    email: testuser@gmail.com
    password: bob123
    age: 18
    isAdmin: false
    createdAt: date()
}
*/
const recipeSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  recipe: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model("Recipe", recipeSchema, "recipes");

module.exports = Recipe;
