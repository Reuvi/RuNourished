const { recipe_save } = require("../../services/profile/recipe_save");


module.exports = async (req, res) => {
    response = await recipe_save();

    if (response.success) {
        //do something
    }else {
        //do something
    }
}

