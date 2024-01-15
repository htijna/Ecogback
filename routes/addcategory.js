const app = require('express').Router();

const CategoryModel = require("../model/category");

app.post('/categorynew', (request, response) => {
 console.log(request.body)
      new CategoryModel(request.body).save();
      response.send("record saved")
  });


// app.get('/catergoryview',async(request,response) =>{

//   const result =await Categorymodel.aggregate([
//     {
//     $lookup: {
//       from: 'category',
//       localField:'sid',
//       foreignField:'_id',
//       as:'category'

//     }
//   },
//   ]);
// })

module.exports = app;


