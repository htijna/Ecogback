const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  Photo: {
    data: Buffer,
    contentType: String
  },
  Productname: String,
  Productprice: Number,
  Quantity: String,
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

// Ensure that the 'seller' field is populated with the corresponding seller document
productSchema.pre('findOne', function (next) {
  this.populate('seller');
  next();
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
