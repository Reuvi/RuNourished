const { regsiter } = require("../../services/users/register");

//Template login controller
module.exports = async (req, res) => {
    const {username, password, email, age} = req.body;
    const registered = await register(username, password, email, age);
    if (registered.success) {
        res.status(201).json({ message: registered.message });
    }
    else {
        res.status(400).json({ error: registered.message });
    }
};