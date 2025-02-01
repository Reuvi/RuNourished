const { login } = require("../../services/users/login");

//Template login controller
module.exports = async (req, res) => {
    const message = await login()
    res.json({ message: message });
};
  