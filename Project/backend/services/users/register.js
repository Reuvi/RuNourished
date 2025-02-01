const validator = require('validator'); 
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const mongoose = require("mongoose"); 

const register = async (username, password, email, age) => {

    response = {
        success: false,
        message: "Unregistered"
    };

    if (!username || !email || !password || !age) {
        response.message = "All fields are required.";
        return respose;
      }
    
    if (!validator.isLength(username, { min: 3, max: 50 })) {
        response.message = 'Username must be between 3 and 50 characters.';
        return response;
    }

    if (!validator.isEmail(email)) {
        response.message = 'Invalid email format.';
        return response;
    }

    if (!validator.isStrongPassword(password, { minLength: 8 })) {
        response.message = "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.";
        return response;
    }

    try {
        // Sanitize the inputs (to prevent SQL injection and XSS attacks)
        const sanitizedUsername = validator.escape(username);
        const sanitizedEmail = validator.normalizeEmail(email);
    
        const exists = await User.findOne({ email: sanitizedEmail });

        if (exists) {
            response.message = "User already exists";
            return response;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = new User({ name: sanitizedUsername, email: sanitizedEmail, password: hashedPassword, age: age });
        await user.save();
        response.message = "User succesfully created"
        response.success = true;
        return response;
    }
    catch (err) {
        console.log(err)
        response.message = "Internal error"
        return response;
    }
};

module.exports = { register };