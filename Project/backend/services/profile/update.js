require("dotenv").config();
const User = require("../../models/User");
const jwtt = require('jsonwebtoken');

const update = async (username, email, jwt) => {
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
        const old_userData = jwtt.decode(JSON.parse(jwt));
        const user = await User.findOne({ email: old_userData.userEmail });

        if (!user) {
            response.message = "Invalid credentials";
            return response;
        }

        user.name = username
        user.email = email

        await user.save();

        const token = jwtt.sign({ userId: user._id, userName: user.name, userEmail: user.email}, process.env.JWT_SECRET, { expiresIn: "24h" });
        const values = jwtt.decode(token);

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

module.exports = { update }