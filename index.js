const express = require("express");
const cors = require("cors");

const app = express();

const productmodel = require("./model/product");
const categorymodel = require("./model/category");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/product/view', async (request, response) => {
    try {
        const data = await productmodel.find();
        response.status(200).json(data);
    } catch (error) {
        console.error("Error fetching product data:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/remove/:id', async (request, response) => {
    try {
        let id = request.params.id;
        const deletedProduct = await productmodel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return response.status(404).json({ error: "Product not found" });
        }

        response.status(200).json({ message: "Record deleted", deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.put('/edit/:id', async (request, response) => {
    try {
        let id = request.params.id;
        await productmodel.findByIdAndUpdate(id, request.body);
        response.status(200).json({ message: "Data updated" });
    } catch (error) {
        console.error("Error updating product:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/new', (request, response) => {
    try {
        console.log(request.body);
        new productmodel(request.body).save();
        response.status(201).json({ message: "Recorded Successfully" });
    } catch (error) {
        console.error("Error saving new product:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/category', (request, response) => {
    try {
        console.log(request.body);
        new categorymodel(request.body).save();
        response.status(201).json({ message: 'Category added' });
    } catch (error) {
        console.error("Error saving new category:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3005, () => {
    console.log("port is running on 3005");
});
