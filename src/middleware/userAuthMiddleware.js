// src/middleware/userAuthMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../Connection/jwt');
const secretKey = config.user.secretKey;

const authenticateUserToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

module.exports = {
  authenticateUserToken,
};
