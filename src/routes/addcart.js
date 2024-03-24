const express = require('express');
const router = express.Router();
const CartModel = require("../model/cart");

// Add a new item to the cart
router.post('/cartnew', async (request, response) => {
    try {
      const { productId,userId,sellerId, productName, productPrice,productDescription, productQuantity ,status} = request.body;
      const newItem = new CartModel({ productId,userId, sellerId, productName, productPrice, productDescription, productQuantity,status });
      await newItem.save();
      console.log(newItem)
      response.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });

// Get all cart items
router.get('/viewcart', async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming you want to fetch cart items for a specific seller
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const cartItems = await CartModel.find({ userId: userId}); // Fetch cart items for the specified seller
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No cart items found for this user' });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Remove an item from the cart
router.delete('/remove/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const deletedItem = await CartModel.findByIdAndDelete(id);
    if (!deletedItem) {
      return response.status(404).json({ error: 'Item not found' });
    }
    return response.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
});



// Clear the cart
router.delete('/clear', async (req, res) => {
  try {
    // Find all items in the cart and remove them
    await CartModel.deleteMany({});
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// Increment quantity of a cart item
router.put('/increment/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // Find the cart item by its ID and increment its quantity
      const updatedCartItem = await CartModel.findByIdAndUpdate(id, { $inc: { productQuantity: 1 } }, { new: true });
      res.json(updatedCartItem);
  } catch (error) {
      console.error('Error incrementing item quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Decrement quantity of a cart item
router.put('/decrement/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // Find the cart item by its ID and decrement its quantity, ensuring it doesn't go below 1
      const updatedCartItem = await CartModel.findByIdAndUpdate(id, { $inc: { productQuantity: -1 } }, { new: true });
      // Ensure the quantity doesn't go below 1
      if (updatedCartItem.productQuantity < 1) {
          updatedCartItem.productQuantity = 1;
          await updatedCartItem.save();
      }
      res.json(updatedCartItem);
  } catch (error) {
      console.error('Error decrementing item quantity:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
