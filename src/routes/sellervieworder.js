const express = require('express');
const router = express.Router();
const SellerorderModel = require('../model/sellerorder');
const User = require('../model/User');


router.post('/orderseller', async (req, res) => {
    try {
      const { productId,userId,sellerId, productName, productPrice, productDescription, productQuantity, status,orderDate } = req.body;
      
      // Check if productId is provided
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      // Create a new order
      const newItem = new SellerorderModel({
         productId,
        userId,
        sellerId,
         productName,
          productPrice,
           productDescription,
         productQuantity,
          status , 
           orderDate,
           });

           await newItem.save();

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
    const sellerId = req.query.sellerId;
    console.log('Received sellerId:', sellerId); // Log received sellerId
    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    const orders = await SellerorderModel.find({ sellerId: sellerId }).populate('userId');
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this seller' });
    }

    const ordersWithUserDetails = await Promise.all(orders.map(async order => {
      const user = await User.findById(order.userId);
      return {
        ...order.toJSON(),
        user: user // Assuming the userId field is a reference to the User model
      };
    }));

    res.status(200).json(ordersWithUserDetails);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


  router.get('/myorder', async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
          return res.status(400).json({ message: 'UserID is required' });
      }

      const orders = await SellerorderModel.find({ userId: userId });
      if (orders.length === 0) {
          return res.status(404).json({ message: 'No orders found ' });
      }

      res.status(200).json(orders);
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

  router.get('/markascompleted/:orderId', async (req, res) => {
    try {
      const orderId = req.params.orderId;
      await SellerorderModel.findByIdAndUpdate(orderId, { status: 'Completed' });
      res.json({ message: 'Order marked as complete successfully' });
    } catch (error) {
      console.error('Error marking order as completed:', error);
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