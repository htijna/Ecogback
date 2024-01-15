const app = require('express').Router;
const ProductModel = require("../model/product");


// app.post('/new', (request, response) => {
//   try {
//      console.log(request.body);
//      new productModelmodel(request.body).save();
//      response.status(201).json({ message: 'product added' });
//  } 
//  catch (error) {
//      console.error("Error saving new category:", error);
//      response.status(500).json({ error: "Internal Server Error" });
//  }
// });

module.exports = app;


