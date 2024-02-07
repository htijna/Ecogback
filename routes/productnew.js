const app = require('express').Router();
const ProductModel = require("../model/product");
const multer = require('multer');


const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage });


app.post('/productnew', upload.single('Photo'), async (request, response) => {
    try {
        // console.log(request.body)
                const {
                    Productname, 
                    Productprice,
                    Quantity,
                    Expiredate,
                    Cid,
                    Status
                   
                }= request.body
                
                const newdata = new ProductModel({
                    Productname, Productprice,
                    Quantity,
                    Expiredate,
                    Cid,
                    Status,        
                    Photo: {
                        data: request.file.buffer,
                        contentType: request.file.mimetype,
                    }
                })
                
                await newdata.save();
                response.status(200).json({ message: 'Photo added successfully' });
        }
    catch (error) 
    {
                response.status(500).json({ error: 'Internal Server Error' });
    }
}
)






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

    

    app.put('/editproduct/:id',async(request,response)=>{
        let id = request.params.id
        await ProductModel.findByIdAndUpdate(id,request.body)
        response.send("Record updated")
    })
    
    app.get('/productview',async(request,response)=>{
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