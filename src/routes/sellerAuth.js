const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Seller = require('../model/Seller'); // Import Seller model
const jwtConfig = require('../Connection/jwt'); // Import JWT configuration
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

// Seller login endpoint
// Seller login endpoint
router.post('/sellerlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ _id: seller._id, role: 'seller' }, jwtConfig.seller.secretKey, { expiresIn: jwtConfig.seller.expiresIn });

    res.json({ token, _id: seller._id }); // Sending seller _id along with token
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Token verification endpoint
router.post('/verifyToken', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token
    jwt.verify(token, jwtConfig.seller.secretKey, (err, decoded) => {
      if (err) {
        // Token is invalid or expired
        return res.status(401).json({ success: false, message: 'Invalid token' });
      } else {
        // Token is valid
        // You can perform additional checks here if needed, like checking if the seller exists
        res.status(200).json({ success: true, message: 'Token is valid' });
      }
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected route for testing authentication
router.get('/protected', authenticateSellerToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Assuming you have something like this in your route handler
router.get('/profileview/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id); // Use req.params.id instead of ':id'
    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
