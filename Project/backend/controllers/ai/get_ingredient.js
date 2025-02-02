const { get_ingredient } = require("../../services/ai/get_ingredient");

// get recipe controller
module.exports = async (req, res) => {
  const { recipeName, jwt } = req.body;
  const response = await get_ingredient(recipeName, jwt);

  if (response.success) {
    // Wrap the data so that the front end can access response.data.ingredient.result
    res.status(201).json({ message: response.message, data: { ingredient: response.data } });
  } else {
    res.status(403).json({ error: response.message });
  }
};