require("dotenv").config();
const jwtt = require('jsonwebtoken');

const customMiddleware = (req, res, next) => {
    console.log('Custom middleware for /anyRoute route');
    next();
  };

const authorization = (req, res, next) => {
  const {jwt, values} = req.body;
  try {
    jwtt.verify(JSON.parse(jwt), process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.log(err);
    response = {
      message: "Unauthorized Access",
    }
    res.status(403).json({ error: response.message });
  }
}

module.exports = {customMiddleware, authorization};