const { recipe_save } = require("../../services/profile/recipe_save");


module.exports = async (req, res) => {
    
    const  {recipe, jwt} = req.body;
    
    response = await recipe_save(recipe, jwt);

    if (response.success) {
        res.status(201).json({message: response.message})
    }else {
        res.status(401).json({message: response.message})
    }
}

