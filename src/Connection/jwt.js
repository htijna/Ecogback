///src//connection/jwt.js
module.exports = {
  user: {
    secretKey: 'fnsiol4va0a32', // Replace with a strong, secret key
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
  },
  seller: {
    secretKey: 'fnsiol4va0a45', // Replace with the same secret key as in the server-side code
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
  },
  admin: {
    secretKey: 'nsiol4va0a76', // Replace with the same secret key as in the server-side code
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
  }
}

