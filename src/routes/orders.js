const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const OrderModel = require("../model/order");
const jwtConfig = require('../Connection/jwt'); // Import JWT configuration

router.post('/placeOrder', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.body;
    // Assuming you have a User ID or some identifier for the customer
    const customerId = req.user.id; // Example: You need to replace this with your actual logic to get the customer ID

    // Create a new order
    const newOrder = new OrderModel({
      productId,
      customerId,
      status: 'Pending' // Set the initial status of the order
    });

    await newOrder.save();
    res.status(200).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to authenticate user using JWT
function authenticateUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, jwtConfig.user.secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = router;
