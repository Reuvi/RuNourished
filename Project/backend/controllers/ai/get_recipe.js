const { get_recipe } = require("../../services/ai/get_recipe");

//get recipe controller
module.exports = async (req, res) => {
    
    const {calories, fat, carbohydrates, protein, cholesterol, sodium, fiber, ingredients} = req.body
    
    const response = await get_recipe(calories, fat, carbohydrates, protein, cholesterol, sodium, fiber, ingredients);

    if(response.success) {
        res.status(201).json({ message: response.message, recipe: response.recipe });
    }
    else {
        res.status(403).json({ error: response.message });
    }
};
  