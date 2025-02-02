const { recipe_cookbook } = require("../../services/profile/recipe_cookbook");

module.exports = async (req, res) => {

    const { jwt } = req.body;

    response = await recipe_cookbook( jwt );

    if (response.success) {
        res.status(201).json({message: response.message, data: JSON.parse(response.data)});
    }else {
        res.status(401).json({message: response.message});
    }
}