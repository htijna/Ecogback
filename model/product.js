const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://anjithkj:anjithkj@cluster0.8uatvth.mongodb.net/organic?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.error("DB connection error:", err));

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
