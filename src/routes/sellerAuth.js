const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Seller = require('../model/Seller');
 
const { authenticateSellerToken } = require("../middleware/sellerAuthMiddleware");

// Seller signup endpoint
router.post('/sellersignup', async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // Check if the seller already exists
    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the seller to the database
    const newSeller = new Seller({ name, email, phone, address, password: hashedPassword });
    await newSeller.save();

    res.status(201).json({ message: 'Seller registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/sellerlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found. Please check your email or sign up.' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    // Generate JWT token
    const token = jwt.sign({ sellerId: seller._id }, 'your_secret_key', { expiresIn: '1h' });

    // Send response with user details and token
    res.status(200).json({ sellerId: seller._id, name: seller.name, token }); // Include user's name in response
  } catch (error) {
    console.error('Seller login failed:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
});



// Seller profile endpoint
router.get('/sellerprofile', async (req, res) => {
  try {
    // Assuming you have some way to extract userId from the request
    const sellerId = req.query.sellerId;

    if (!sellerId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const sellerProfile = await Seller.findById(sellerId);

    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.json(sellerProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//sellerprofileedit
router.put('/editseller/:id', async (req, res) => {
  try {
    const sellerId = req.params.id; // Get the seller ID from request params
    const { name, email, phone, address } = req.body;

    // Check if the seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Update the seller's profile fields
    seller.name = name;
    seller.email = email;
    seller.phone = phone;
    seller.address = address;

    // Save the updated user
    const updatedSeller = await seller.save();

    res.json({ message: 'User profile updated successfully', seller: updatedSeller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all sellers
router.get('/sellerlog', async (req, res) => {
  try {
    const data = await Seller.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


