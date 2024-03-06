const express = require('express');
const router = express.Router();
const SellerorderModel = require('../model/sellerorder');



router.post('/orderseller', async (req, res) => {
    try {
      const { productId, productName, productPrice, productDescription, productQuantity, status } = req.body;
      
      // Check if productId is provided
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      // Create a new order
      const newItem = new SellerorderModel({ productId, productName, productPrice, productDescription, productQuantity, status });
      console.log('saved', newItem);
      await newItem.save();
      res.status(201).json({ message: 'Order added successfully' });
    } catch (error) {
      console.error('Error adding order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

  
  router.get('/sellervieworder', async (req, res) => {
    try {
      
      const orders = await SellerorderModel.find();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.put('/acceptorder/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      // Find the order by ID and update its status to "Accepted"
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Accepted' });
      res.json({ message: 'Order accepted successfully' });
    } catch (error) {
      console.error('Error accepting order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/markasshipped/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Shipped' });
      res.json({ message: 'Order marked as shipped successfully' });
    } catch (error) {
      console.error('Error marking order as shipped:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route to mark an order as delivered
router.put('/markasdelivered/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Delivered' });
      res.json({ message: 'Order marked as delivered successfully' });
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });





  router.get('/acceptorder/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      // Find the order by ID and update its status to "Accepted"
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Accepted' });
      res.json({ message: 'Order accepted successfully' });
    } catch (error) {
      console.error('Error accepting order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  





// Route to mark an order as delivered
router.get('/markasdelivered/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Delivered' });
      res.json({ message: 'Order marked as delivered successfully' });
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/markasshipped/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Shipped' });
      res.json({ message: 'Order marked as shipped successfully' });
    } catch (error) {
      console.error('Error marking order as shipped:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.post('/updatequantity', async (req, res) => {
    try {
      const { productId, productQuantity } = req.body; // Destructuring productId and productQuantity from request body
      // Find the order by productId and update its productQuantity
      await SellerorderModel.findOneAndUpdate({ productId: productId }, { productQuantity: productQuantity });
      res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
      console.error('Error updating quantity in the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  



  module.exports = router;