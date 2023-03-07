const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const jwtAuth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
    // if (req.cookies) {
    //   const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

      req.decoded = decoded;
      next();
    } else {
      next(createError(400, "token not found"));
    }
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      next(createError(400, "token is invalid"));
    } else if (error.name === "TokenExpiredError") {
      next(createError(400, "token is expired"));
    } else {
      next(createError(400, "error occured"));
    }
  }
};

module.exports = {
  jwtAuth,
};
