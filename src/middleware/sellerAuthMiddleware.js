const jwt = require('jsonwebtoken');
const config = require('../Connection/jwt');
const secretKey = config.seller.secretKey;

const authenticateSellerToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, seller) => {
    if (err) return res.sendStatus(403);

    req.seller = seller;
    next();
  });
};

module.exports = {
  authenticateSellerToken,
};
