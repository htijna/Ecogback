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
router.get('/sellerprofile/:id', authenticateSellerToken, async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Seller.findById(id);

    if (!profile) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.json(profile);
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


