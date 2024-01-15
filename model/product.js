const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  // Photo: String, // Assuming File is a string representing the file path or URL
  Productname: String,
  Productprice: Number,
  Quantity: String,
  Expiredate: Date,
  Category: String,
  Status:String,
});

var ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
