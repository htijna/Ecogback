const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Import User model
const jwtConfig = require('../Connection/jwt.js'); // Import JWT configuration
const { authenticateUserToken } = require("../middleware/userAuthMiddleware.js");
const { generateUserToken } = require("../userUtils.js");

// Signup endpoint
router.post('/usersignup', async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const newUser = new User({ name, email, phone, address, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login endpoint
router.post('/userlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = generateUserToken(user);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Token verification endpoint
router.post('/VerifyToken', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtConfig.user.secretKey);
    
    // Token is valid
    // You can perform additional checks here if needed, like checking if the user exists
    res.status(200).json({ success: true, message: 'Token is valid' });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Protected route for testing authentication
router.get('/protected', authenticateUserToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});



router.get('/userlog', async (req, res) => {
  try {
    const data = await User.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
