const customMiddleware = (req, res, next) => {
    console.log('Custom middleware for /anyRoute route');
    next();
  };

module.exports = customMiddleware;