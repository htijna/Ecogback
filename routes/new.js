const express = require("express");
const router = express.Router();
const ProductModel = require("../model/product");

router.post("/", (req, res) => {
  const {
    Productname,
    Productprice,
    Quantity,
    Expiredate,
    Category,
  } = req.body;

  const newProduct = new ProductModel({
    Productname,
    Productprice,
    Quantity,
    Expiredate,
    Category,
  });

  newProduct
    .save()
    .then((result) => {
      res.status(201).json({ message: "Product added successfully", product: result });
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
