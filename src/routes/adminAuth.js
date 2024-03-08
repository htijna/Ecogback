///src//routes/adminAuth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin'); // Adjust the path based on your file structure
// const jwtConfig = require('../Connection/jwt');
// const { authenticateAdminToken } = require('../middleware/adminAuthMiddleware'); // Import the authentication middleware

// Admin Login endpoint
router.post('/admin', async (request, response) => {
    const { email, password } = request.body;
      console.log(request.body)
      try {
        const user = await Admin.findOne({ email, password });
      
        if (user) {
          response.json({ success: true, message: 'Login successful' });
        }
         else {
          response.json({ success: false, message: 'Invalid Password and email' });
        }
      } catch (error) {
        response.status(500).json({ success: false, message: 'Error during login' });
      }
    });
   

// Protected route for testing authentication
// router.get('/protected', authenticateAdminToken, (req, res) => {
//   res.json({ message: 'Protected route accessed successfully.' });
// });

module.exports = router;