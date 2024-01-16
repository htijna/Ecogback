const app = require('express').Router();
const ProductModel = require("../model/product");
const multer = require('multer');


const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage });


app.post('/productimg', upload.single('Photo'), async (request, response) => {
    try {
                
                const newdata = new ProductModel({
                  
                    Photo: {
                        data: request.file.buffer,
                        contentType: request.file.mimetype,
                    }
                })
                await newdata.save();
                res.status(200).json({ message: 'Photo added successfully' });
        }
    catch (error) 
    {
                response.status(500).json({ error: 'Internal Server Error' });
    }
}
)





app.post('/productnew', (request, response) => {
    console.log(request.body)
         new ProductModel(request.body).save();
         response.send("record saved")
     });
  
     app.get('/productview',async(request,response)=>{
        var data = await ProductModel.find();
        response.send(data)
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

    

    app.put('/editproduct/:id',async(request,response)=>{
        let id = request.params.id
        await ProductModel.findByIdAndUpdate(id,request.body)
        response.send("Record updated")
    })
    

module.exports = app;


