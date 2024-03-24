const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Import User model
const { authenticateUserToken } = require('../middleware/userAuthMiddleware'); // Import user authentication middleware

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
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please check your email or sign up.' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    // Send response with user details and token
    res.status(200).json({ userId: user._id, name: user.name, token }); // Include user's name in response
  } catch (error) {
    console.error('User login failed:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
});

router.get('/userprofile', async (req, res) => {
  try {
    // Assuming you have some way to extract userId from the request
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userProfile = await User.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/edituser/:id', async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from request params
    const { name, email, phone, address } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's profile fields
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;

    // Save the updated user
    const updatedUser = await user.save();

    res.json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Get all users (Just for testing, consider removing it or protecting it in production)
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