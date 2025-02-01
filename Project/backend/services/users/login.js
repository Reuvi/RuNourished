require("dotenv").config();
const validator = require('validator'); 
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');


const login = async (email, password) => {
    response = {
        success: false,
        message: "Failed to login",
        token: "",
        values: ""
    }

    try {
    if (!email || !password) {
        response.message = "Email and/or password value empty";
        return response;
    }

    const sanitizedEmail = validator.normalizeEmail(email);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findOne({ email: email });
    
    if (!user) {
        response.message = "Invalid credentials";
        return response;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        response.message = "Invalid credentials"
        return response;
    }

    const token = jwt.sign({ userId: user._id, userName: user.name, userEmail: user.email}, process.env.JWT_SECRET, { expiresIn: "24h" });
    const values = jwt.decode(token);
    response.message = "Login successful";
    response.success = true;
    response.token = token;
    response.values = values
    return response;
}
catch (err) {
    console.log(err);
    response.message = "Internal Error";
}

};

module.exports = { login };