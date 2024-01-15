const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema({
  Categoryname: String,  // Adjust this based on your actual category schema
});

const CategoryModel = mongoose.model("Category", categorySchema);  // Fix the model registration
module.exports = CategoryModel;
