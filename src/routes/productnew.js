const app = require('express').Router();
const { request, response } = require('express');
const ProductModel = require("../model/product");
const multer = require('multer');
const mongoose = require('mongoose');


const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage });


app.post('/productnew', upload.single('Photo'), async (req, res) => {
    try {
        const {
            sellerId,
            Productname,
            Productprice,
            Cid,
            Status,
            Description
        } = req.body;

        console.log('data',req.body);

      
        
        // Check if SellerId is provided
        if (!sellerId) {
            return res.status(400).json({ error: 'SellerId is required' });
        }

        console.log("sellerId:", sellerId); // Print the seller's ID in the console

        const newProduct = new ProductModel({
            sellerId, // Assigning the seller ID to the product
            Productname,
            Productprice,
            Cid,
            Status,
            Description,
            Photo: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
        });

        await newProduct.save();
        res.status(200).json({ message: 'Product added successfully' });
        console.log(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




    app.put('/inactive/:id',async(request,response)=>{
        let id = request.params.id
        await ProductModel.findByIdAndUpdate(id,{$set:{Status:"Inactive"}})
        response.send("Record Inactive")
    })

    app.put('/active/:id',async(request,response)=>{
        let id = request.params.id
        await ProductModel.findByIdAndUpdate(id,{$set:{Status:"Active"}})
        response.send("Record Active")
    })

    
    app.get('/productview', async (req, res) => {
        try {
            const sellerId = req.query.sellerId;
            if (!sellerId) {
                return res.status(400).json({ message: 'Seller ID is required' });
            }
    
            const products = await ProductModel.find({ sellerId: sellerId }).populate('Cid').populate('Photo');
            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found for this seller' });
            }
    
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    
    

    
    // app.put('/editproduct/:id',async(request,response)=>{
    //     let id = request.params.id
    //     await ProductModel.findByIdAndUpdate(id,request.body)
    //     response.send("Record updated")
    // })
   // PUT /product/editproduct/:id - Edit a product
 // productnew.js
app.put('/editproduct/:id', upload.single('Photo'), async (request, response) => {
  try {
    const id = request.params.id;
    const { Productname, Productprice, Quantity, Cid, Status, Description } = request.body;

    // Check if Cid is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(Cid)) {
      return response.status(400).json({ message: 'Invalid Cid provided' });
    }

    // Prepare updated data for the product
    const updatedData = {
      Productname,
      Productprice,
      Cid: new mongoose.Types.ObjectId(Cid), // Convert Cid to ObjectId
      Status,
      Description
    };

    // Add Photo data if provided
    if (request.file) {
      updatedData.Photo = {
        data: request.file.buffer,
        contentType: request.file.mimetype,
      };
    }

    // Find and update the product document
    const result = await ProductModel.findByIdAndUpdate(id, updatedData);

    // Handle result and send response
    if (!result) {
      return response.status(404).json({ message: 'Item not found' });
    }
    response.status(200).json({ message: 'Item updated successfully', data: result });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});



app.put('/editphoto/:id', upload.single('Photo'), async (request, response) => {
  try {
    const id = request.params.id;

    // Check if a file is uploaded
    if (!request.file) {
      return response.status(400).json({ message: 'No photo provided' });
    }

    // Prepare updated photo data for the product
    const updatedPhotoData = {
      Photo: {
        data: request.file.buffer,
        contentType: request.file.mimetype,
      }
    };

    // Find and update the product document
    const result = await ProductModel.findByIdAndUpdate(id, updatedPhotoData);

    // Handle result and send response
    if (!result) {
      return response.status(404).json({ message: 'Item not found' });
    }
    response.status(200).json({ message: 'Product photo updated successfully', data: result });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/adminproductview', async (request, response) => {
  try {
    const searchTerm = request.query.search;
    let result;
    if (searchTerm) {
      // If search term exists, filter products based on the search term
      result = await ProductModel.aggregate([
        {
          $match: {
            Productname: { $regex: new RegExp(searchTerm, 'i') } // Case-insensitive search
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'Cid',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'sellers',
            localField: 'seller',
            foreignField: '_id',
            as: 'seller',
          },
        },
      ]);
    } else {
      // If no search term, fetch all products
      result = await ProductModel.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'Cid',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'sellers',
            localField: 'seller',
            foreignField: '_id',
            as: 'seller',
          },
        },
      ]);
    }

    response.send(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/search', async (req, res) => {
  try {
      const searchQuery = req.query.query; // Retrieve the search query from request query parameters
      if (!searchQuery) {
          return res.status(400).json({ message: 'Search query is required' });
      }

      // Perform case-insensitive search for products with Productname containing the search query
      const products = await ProductModel.find({ Productname: { $regex: new RegExp(searchQuery, 'i') } });

      if (products.length === 0) {
          return res.status(404).json({ message: 'No products found matching the search query' });
      }

      res.status(200).json(products);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/premove/:id', async (request, response) => {
  const {id }= request.params;
  try {
   
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    console.log('Deleted product:', deletedProduct);
    if (!deletedProduct) {
      return response.status(404).json({ error: 'Product not found' });
    }
    response.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error removing product:', error); // Log the specific error
    response.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/userallproduct', async (request, response) => {
  try {
      const result = await ProductModel.aggregate([
          {
              $lookup: {
                  from: 'categories', // Name of the other collection
                  localField: 'Cid', // field of item
                  foreignField: '_id', //field of category
                  as: 'prod',
              },
          },
          {
              $match: {
                  Status: "Active" // Filter only active products
              }
          }
      ]);
      
      response.send(result);
  } catch (error) {
      response.status(500).json({ message: error.message });
  }
});

    
        app.get('/search', async (request, response) => {
          try {
              const searchQuery = request.query.query; // Retrieve the search query from request query parameters
              if (!searchQuery) {
                  return response.status(400).json({ message: 'Search query is required' });
              }
      
              // Perform case-insensitive search for products with Productname containing the search query
              const products = await ProductModel.find({ Productname: { $regex: new RegExp(searchQuery, 'i') } });
      
              if (products.length === 0) {
                  return response.status(404).json({ message: 'No products found matching the search query' });
              }
      
              response.status(200).json(products);
          } catch (error) {
              console.error(error);
              response.status(500).json({ error: 'Internal Server Error' });
          }
      });
      

module.exports = app;