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
router.post('/sellerlogin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the seller in the database
    const seller = await Seller.findOne({ email });

    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ _id: seller._id, email, role: 'seller' }, jwtConfig.seller.secretKey, { expiresIn: jwtConfig.seller.expiresIn });

    res.json({ _id: seller._id, token });
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


// Seller profile view endpoint
router.get('/profileview/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



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
