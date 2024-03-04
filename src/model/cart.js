const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productName: String,
  productPrice: Number,
  productDescription: String,
  productQuantity: Number
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;
