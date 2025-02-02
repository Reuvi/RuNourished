const { get_ingredient_image } = require("../../services/ai/get_ingredient_image");

// get recipe controller
module.exports = async (req, res) => {
  const { image, jwt } = req.body;
  
  const response = await get_ingredient_image(image, jwt);

  if (response.success) {
    // Wrap the data so that the front end can access response.data.ingredient.result
    res.status(201).json({ message: response.message, data: { ingredient: response.data } });
  } else {
    res.status(403).json({ error: response.message });
  }
};