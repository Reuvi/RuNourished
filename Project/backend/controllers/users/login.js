const { login } = require("../../services/users/login");

//login controller
module.exports = async (req, res) => {
    
    const {email, password} = req.body
    
    const response = await login(email, password)

    if(response.success) {
        res.status(201).json({ message: response.message, jwt: response.token, values: response.values });
    }
    else {
        res.status(403).json({ error: response.message });
    }
};
  