const mongoose = require("mongoose");

/*
{
    name: bob
    email: testuser@gmail.com
    password: bob123
    age: 18
    isAdmin: false
    createdAt: date()
}
*/
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: 0},
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
