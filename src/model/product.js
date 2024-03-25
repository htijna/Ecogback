const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller" ,// Assuming "Seller" is the name of your seller model
    required: true
  },
  Photo: {
    data: Buffer,
    contentType: String
  },
  Productname: String,
  Productprice: Number,
  Description: String,
  Cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  Status: {
    type: String,
    default: "Active" // Set your default status
  },
});

// Ensure that the 'sellerId' field is populated with the corresponding seller document
productSchema.pre('findOne', function (next) {
  this.populate('sellerId');
  next();
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
