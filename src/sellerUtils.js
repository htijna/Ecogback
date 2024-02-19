// src/utils/sellerUtils.js
const generateSellerToken = (seller) => `${seller.name}:${seller.email}`;

module.exports = {
  generateSellerToken,
};
