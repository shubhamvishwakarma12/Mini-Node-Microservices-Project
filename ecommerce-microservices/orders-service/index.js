const express = require('express');
const cors = require('cors');
const axios = require('axios'); // We use axios to make HTTP calls to other services

const app = express();
const PORT = 3003; // Orders service runs on port 3003

app.use(cors());
app.use(express.json());

// Hardcoded Internal URLs map
// In production, you'd never hardcode these. You'd use a service mesh or docker networking names.
const SERVICES = {
    users: 'http://localhost:3001',
    products: 'http://localhost:3002'
};

// In-Memory Database for Orders
let orders = [];

// 1. Get all orders
app.get('/', (req, res) => {
    res.json(orders);
});

// 2. Create a new order (INTER-SERVICE COMMUNICATION)
app.post('/', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    // Step 1: Basic validation
    if (!userId || !productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "userId, productId, and a positive quantity are required" });
    }

    try {
        // Step 2: VERIFY USER EXISTS - Inter-Service Request!
        // We are "synchronously" waiting for the user service to respond
        console.log(`[Order Processing] Verifying user ${userId}...`);
        await axios.get(`${SERVICES.users}/${userId}`); 
        // If it 404s, axios throws an error and falls into our catch block!

        // Step 3: VERIFY PRODUCT EXISTS AND HAS STOCK - Inter-Service Request!
        console.log(`[Order Processing] Verifying product ${productId}...`);
        const productResponse = await axios.get(`${SERVICES.products}/${productId}`);
        const product = productResponse.data;

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Insufficient stock available for this product" });
        }

        // Step 4: DEDUCT STOCK
        console.log(`[Order Processing] Deducting stock...`);
        await axios.patch(`${SERVICES.products}/${productId}/stock`, {
            quantityToReduce: quantity
        });

        // Step 5: If we reach here, user exists, product exists, and stock is deducted. CREATE THE ORDER.
        const newOrder = {
            id: orders.length + 1,
            userId,
            productId,
            quantity,
            totalPrice: product.price * quantity,
            status: "Completed",
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);

        console.log(`[Order Processing] Order ${newOrder.id} successfully created!`);
        res.status(201).json(newOrder);

    } catch (error) {
        console.error(`[Order Processing] Failed!`);
        // If the error came from our axios requests to other services
        if (error.response) {
            // Forward the specific HTTP status and error message to the client
            return res.status(error.response.status).json({
                error: `Service Communication Error: ${error.response.data.error || 'Unknown Error'}`
            });
        }
        
        // Otherwise it was an internal server error or networking failure
        return res.status(500).json({ error: "An internal server error occurred while communicating with other services." });
    }
});

app.listen(PORT, () => {
    console.log(`[Orders Service] Listening on port ${PORT}`);
});
