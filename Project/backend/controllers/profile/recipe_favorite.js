const { recipe_favorite } = require("../../services/profile/recipe_favorite");

module.exports = async (req, res) => {
    response = await recipe_favorite();

    if (response.success) {
        //do something
    }else {
        //do something
    }
}