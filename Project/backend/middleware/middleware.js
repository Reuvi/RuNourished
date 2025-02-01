const customMiddleware = (req, res, next) => {
    console.log('Custom middleware for /anyRoute route');
    next();
  };

const authorization = (req, res, next) => {
  console.log("authorization to be added");
}

module.exports = customMiddleware;