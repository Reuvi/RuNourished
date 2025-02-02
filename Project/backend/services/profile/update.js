require("dotenv").config();
const validator = require('validator'); 
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');

const get_recipe = async (username, email, jwt) => {
    response = {
        message: "",
        status: false,
        token: "",
        values: "",
    }

    if(!(username && email)) {
        response.message = "One of the input fields are missing."
        return response;
    }

    try {
        const old_userData = jwt.decode(jwt);

        const user = await User.findOne({ email: old_userData.email });

        if (!user) {
            response.message = "Invalid credentials";
            return response;
        }

        user.name = username
        user.email = email

        await user.save();

        const token = jwt.sign({ userId: user._id, userName: user.name, userEmail: user.email}, process.env.JWT_SECRET, { expiresIn: "24h" });
        const values = jwt.decode(token);

        response.message = "Profile updated";
        response.success = true;
        response.token = token;
        response.values = values;

        return response;


    }catch(err) {
        response.message = "Internal Error";
        return response;
    }




    
}

module.exports = { get_recipe }