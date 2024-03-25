const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sellerId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  Photo: {
    data: Buffer,
    contentType: String
  },
  productName: String,
  productPrice: Number,
  productDescription: String,
  productQuantity: Number,
  status: {
    type: String,
    enum: ['Order', 'Delivered', 'Ordered', 'Shipping', 'Cancelled', 'Pending'],
    default: 'Order' // Set your default status
  }
});

const WishlistModel = mongoose.model('Wishlist', wishlistSchema);
module.exports = WishlistModel;
