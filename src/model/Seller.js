const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //  Order: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Orders"
  // },
 
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
