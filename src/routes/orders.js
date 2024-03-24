const express = require('express');
const router = express.Router();
const OrderModel = require('../model/order');


// Create a new order
router.post('/neworder', async (req, res) => {
  try {
    const { productId, sellerId, userId, productName, productPrice, productDescription, productQuantity, status,orderDate } = req.body;
   
    const newItem = new OrderModel({ 
      productId, 
      sellerId, 
      userId, 
      productName, 
      productPrice, 
      productDescription, 
      productQuantity, 
      status,
      orderDate, // Add current date to order details
    });
    await newItem.save();
    res.status(201).json({ message: 'Order added successfully' });
  } catch (error) {
    console.error('Error adding order:', error);
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
