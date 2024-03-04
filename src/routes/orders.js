// routes/orders.js
const express = require('express');
const router = express.Router();
const OrderModel = require('../model/order');

// Create a new order
router.post('/neworder', async (req, res) => {
  try {
    const { productId, productName, productPrice, productDescription, productQuantity } = req.body;
    const newItem = new OrderModel({ productId, productName, productPrice, productDescription, productQuantity });
    await newItem.save();
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all orders
router.get('/vieworder', async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
