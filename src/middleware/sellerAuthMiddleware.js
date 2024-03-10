const jwt = require('jsonwebtoken');
const config = require('../Connection/jwt');
const secretKey = config.seller.secretKey; // Use the correct secret key for token verification

const authenticateSellerToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decodedSeller) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.seller = decodedSeller;
    next();
  });
};

module.exports = {
  authenticateSellerToken
};
