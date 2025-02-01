require("dotenv").config();
const { login } = require("../services/users/login")

const test1 = async () => {
    const response = await login("officialtest@gmail.com", "Ikey123.");
    console.log(response);
}

module.exports = { test1 };