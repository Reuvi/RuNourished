const { update }  = require("../../services/profile/update");

module.exports = async (req, res) => {

    const {username, email, jwt} = req.body;

    const response = await update(username, email, jwt);

    if(response.success){
        res.status(201).json({message: response.message, jwt: response.token, values: response.values})
    }else {
        res.status(400).json({message: response.message})
    } 
}