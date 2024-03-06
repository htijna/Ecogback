const mongoose = require("mongoose");

const { Schema } = mongoose;

const emailSchema = new Schema({
  Email: String
});

const EmailModel = mongoose.model("Email", emailSchema); // Corrected model registration
module.exports = EmailModel;
