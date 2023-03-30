const jwt = require("jsonwebtoken");
const User = require("./models/User");

function errorHandler(err, req, res, next) {
  // log the error
  console.error(err);

  // set the status code
  const statusCode = err.statusCode || 500;

  // send the error response
  res.status(statusCode).json({
    error: {
      message: err.message,
      statusCode: statusCode,
    },
  });
}

const getUserData = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Token invalid" });
    }

    req.user = decodedToken.user;
    next();
  });
};

module.exports = {
  errorHandler: errorHandler,
  getUserData: getUserData,
};
