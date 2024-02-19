// src/utils/userUtils.js
const generateUserToken = (user) => `${user.name}:${user.email}`;

module.exports = {
  generateUserToken,
};
