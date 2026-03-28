const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002; // Products service runs on port 3002

app.use(cors());
app.use(express.json());

// In-Memory Database for Products
let products = [
    { id: 101, name: "Wireless Headphones", price: 99.99, stock: 50 },
    { id: 102, name: "Mechanical Keyboard", price: 149.99, stock: 20 },
    { id: 103, name: "Gaming Mouse", price: 59.99, stock: 100 }
];

// 1. Get all products
app.get('/', (req, res) => {
    res.json(products);
});

// 2. Get a single product by ID
app.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
});

// 3. Create a new product
app.post('/', (req, res) => {
    const { name, price, stock } = req.body;
    
    // Simple validation
    if (!name || isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ error: "Name, numeric price, and numeric stock are required" });
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 101,
        name,
        price: parseFloat(price),
        stock: parseInt(stock)
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Update product stock (e.g. when an order is placed)
app.patch('/:id/stock', (req, res) => {
    const productId = parseInt(req.params.id);
    const { quantityToReduce } = req.body;
    
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    // Check if we have enough stock
    if (product.stock < quantityToReduce) {
        return res.status(400).json({ error: "Insufficient stock available" });
    }

    // Reduce the stock and save
    product.stock -= quantityToReduce;
    res.json({ message: "Stock updated successfully", product });
});

app.listen(PORT, () => {
    console.log(`[Products Service] Listening on port ${PORT}`);
});
