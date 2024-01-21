const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  Photo: {
    data: {
      type: Buffer,
      default: Buffer.from([]), // Default empty Buffer
    },
    contentType: {
      type: String,
      default: 'image/jpeg', // Set your default content type
    },
  },
  Productname: String,
  Productprice: Number,
  Quantity: String,
  Expiredate: Date,
  Cid:{type:mongoose.Schema.Types.ObjectId,ref:'categories'},
  Status: {
    type: String,
    default: 'Active', // Set your default status
  },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
