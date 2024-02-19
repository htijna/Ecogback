// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/Connection/Database');
const sellerAuthRoutes = require('./src/routes/sellerAuth');
const categoryRouter = require('./src/routes/addcategory');
const productRouter = require('./src/routes/productnew');
const authRoutes = require('./src/routes/auth');
const adminAuthRoutes = require('./src/routes/adminAuth'); // Import Admin authentication routes
const ordersRouter = require('./src/routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome');
});

app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/auth', authRoutes);
app.use('/sellerAuth', sellerAuthRoutes);
app.use('/adminAuth', adminAuthRoutes); // Use Admin authentication routes
app.use('/orders', ordersRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
