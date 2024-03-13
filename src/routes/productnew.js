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
            Quantity,
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
            Quantity,
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




    app.put('/delete/:id',async(request,response)=>{
        let id = request.params.id
        await ProductModel.findByIdAndUpdate(id,{$set:{Status:"Inactive"}})
        response.send("Record Deleted")
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
    app.put('/editproduct/:id', upload.single('Photo'), async (request, response) => {
        try {
          const id = request.params.id;
          const { Productname, Productprice, Quantity, Cid, Status, Description } = request.body;
          let result = null;
      
          // Check if Cid is a valid ObjectId
          if (!mongoose.Types.ObjectId.isValid(Cid)) {
            return response.status(400).json({ message: 'Invalid Cid provided' });
          }
      
          if (request.file) {
            const updatedData = {
              Productname, 
              Productprice,
              Quantity,
              Cid: mongoose.Types.ObjectId(Cid), // Convert Cid to ObjectId
              Status,
              Description,
              Photo: {
                data: request.file.buffer,
                contentType: request.file.mimetype,
              }
            };
            result = await ProductModel.findByIdAndUpdate(id, updatedData);
          } else {
            const updatedData = {
              Productname, 
              Productprice,
              Quantity,
              Cid: mongoose.Types.ObjectId(Cid), // Convert Cid to ObjectId
              Status,
              Description
            };
            result = await ProductModel.findByIdAndUpdate(id, updatedData);
          }
      
          if (!result) {
            return response.status(404).json({ message: 'Item not found' });
          }
      
          response.status(200).json({ message: 'Item updated successfully', data: result });
        } catch (error) {
          console.error(error);
          response.status(500).json({ error: 'Internal Server Error' });
        }
      });
      
    app.get('/adminproductview', async (request, response) => {
        try {
            const result = await ProductModel.aggregate([
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
    
            // Log the result to the console
        ;
    
            response.send(result);
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    });


    app.get('/userallproduct',async(request,response)=>{
        const result = await ProductModel.aggregate([
            {
              $lookup: {
                from: 'categories', // Name of the other collection
                localField: 'Cid', // field of item
                foreignField: '_id', //field of category
                as: 'prod',
              },
            },
          ]);
        
          response.send(result)
        })
    
    
module.exports = app;