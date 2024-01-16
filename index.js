const express = require("express");
const cors = require("cors");
const db=require('./Connection/Database')

const categoryrouter=require('./routes/addcategory')
const productrouter = require('./routes/productnew')

const app = new express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/' ,(request, response) => {
    response.send("Welcome ")

})


//category new

app.use("/category",categoryrouter)

app.use("/product",productrouter)


app.listen(5000,(request ,response) =>{
    console.log("port is running in 5000")
})

