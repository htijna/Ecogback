const app = require('express').Router();

const CategoryModel = require("../model/category");

app.post('/categorynew', (request, response) => {
 console.log(request.body)
      new CategoryModel(request.body).save();
      response.send("record saved")
  });


  app.get('/categoryview',async(request,response)=>{
    var data = await CategoryModel.find();
    response.send(data)
});


app.put('/inactive/:id',async(request,response)=>{
  let id = request.params.id
  await CategoryModel.findByIdAndUpdate(id,{$set:{Status:"Inactive"}})
  response.send("Record Deleted")
})

app.put('/active/:id',async(request,response)=>{
  let id = request.params.id
  await CategoryModel.findByIdAndUpdate(id,{$set:{Status:"Active"}})
  response.send("Record Active")
})



module.exports = app;


