const express = require("express");
const router = express.Router();
const CategoryModel = require("../model/category");

router.post("/", (req, res) => {
  const { name } = req.body;

  const newCategory = new CategoryModel({ name });

  newCategory
    .save()
    .then((result) => {
      res.status(201).json({ message: "Category added successfully", category: result });
    })
    .catch((error) => {
      console.error("Error adding category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;
