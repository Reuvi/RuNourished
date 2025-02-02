require("dotenv").config();
const Recipe = require("../../models/Recipe");
const jwtt = require('jsonwebtoken');



const recipe_cookbook = async (jwt) => {
    const response = {
        message: "",
        success: false,
        data: ""
    };

    try {
        user_data = jwtt.decode(JSON.parse(jwt));

        const rec = Recipe.find({user_id: user_data.userId});
        
        response.data = rec;

        console.log(console.data);
        
        response.message = "Succesfully saved";
        response.success = true;

        return response;

    }catch(err) {
        console.log(err);
        response.message = "Internal Error";
        return response;
    }
}

module.exports = { recipe_cookbook };