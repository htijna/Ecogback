const jwt = require('jsonwebtoken');
const config = require('../Connection/jwt');
const secretKey = config.user.secretKey;

const authenticateUserToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) return res.sendStatus(403);

    req.userId = decodedToken.userId; // Include userId in the request object
    next();
  });
};

module.exports = {
  authenticateUserToken,
};