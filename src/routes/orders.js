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


// Increment quantity of an order
router.put('/increment/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // Find the order by its ID and increment its quantity
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, { $inc: { productQuantity: 1 } }, { new: true });
      res.json(updatedOrder);
  } catch (error) {
      console.error('Error incrementing order quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Decrement quantity of an order
router.put('/decrement/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // Find the order by its ID and decrement its quantity, ensuring it doesn't go below 1
      const updatedOrder = await OrderModel.findByIdAndUpdate(id, { $inc: { productQuantity: -1 } }, { new: true });
      // Ensure the quantity doesn't go below 1
      if (updatedOrder.productQuantity < 1) {
          updatedOrder.productQuantity = 1;
          await updatedOrder.save();
      }
      res.json(updatedOrder);
  } catch (error) {
      console.error('Error decrementing order quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
