const express = require('express');
const router = express.Router();
const WishlistModel = require('../model/wishlist');

// Add a new item to the wishlist
router.post('/addwish', async (request, response) => {
  try {
    const { productId, userId, sellerId, productName, productPrice, productDescription, productQuantity, status, Photo } = request.body;

    // Perform validation if needed
    if (!productId || !userId || !productName || !productPrice || !productDescription) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    const newItem = new WishlistModel({ 
        productId, 
        userId, 
        sellerId, 
        productName, 
        productPrice, 
        productDescription, 
        productQuantity, 
        status,
        Photo,
    });
    await newItem.save();

    console.log('Item added to wishlist:', newItem);
    response.status(201).json({ message: 'Item added to wishlist' });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/viewfavor', async (request, response) => {
    try {
        const userId = request.query.userId;
        if (!userId) {
            return response.status(400).json({ message: 'User ID is required' });
        }

        const products = await WishlistModel.find({ userId: userId }).populate('Photo');
        if (products.length === 0) {
            return response.status(404).json({ message: 'No products found for this user' });
        }

        // Convert image data to base64 if necessary
        const productsWithBase64Images = products.map(product => {
            if (product.Photo && product.Photo.data) {
                product.Photo.data = Buffer.from(product.Photo.data).toString('base64');
            }
            return product;
        });

        response.status(200).json(productsWithBase64Images);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});


// Remove an item from the wishlist
router.delete('/removewish/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const deletedItem = await WishlistModel.findByIdAndDelete(id);
    if (!deletedItem) {
      return response.status(404).json({ error: 'Item not found in wishlist' });
    }
    return response.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;