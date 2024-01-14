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

const categorySchema = new Schema({
  name: String,  // Adjust this based on your actual category schema
});

const CategoryModel = mongoose.model("Category", categorySchema);  // Fix the model registration
module.exports = CategoryModel;
