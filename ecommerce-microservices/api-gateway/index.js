const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Important Middlewares
app.use(cors());          // Allow cross-origin requests
app.use(express.json());  // Parse incoming JSON payloads

// Configuration: Hardcoded URLs for the other microservices
// In a real production app, these would be Environment Variables or a Service Discovery tool
const SERVICES = {
    users: 'http://localhost:3001',
    products: 'http://localhost:3002',
    orders: 'http://localhost:3003'
};

// ==========================================
// Proxy Routes
// The API Gateway's job is to take a request from the client and forward it
// to the correct microservice, then return the response back to the client.
// ==========================================

// 1. Route for Users Service
// Matches any route starting with /api/users
app.use('/api/users', async (req, res) => {
    try {
        // We use Axios to forward the request to the Users Service (Port 3001)
        // req.method gives us 'GET', 'POST', etc.
        // req.url gives us the remainder of the path (e.g., if req was '/api/users/1', req.url is '/1')
        const response = await axios({
            method: req.method,
            url: `${SERVICES.users}${req.url}`,
            data: req.body // Forward the request body if it's a POST/PUT request
        });
        
        // Send back the data received from the Users service
        res.status(response.status).json(response.data);
    } catch (error) {
        // If the microservice errors or is down, handle it gracefully
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Users Service is currently unavailable.' });
        }
    }
});

// 2. Route for Products Service
// Matches any route starting with /api/products
app.use('/api/products', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICES.products}${req.url}`,
            data: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Products Service is currently unavailable.' });
        }
    }
});

// 3. Route for Orders Service
// Matches any route starting with /api/orders
app.use('/api/orders', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${SERVICES.orders}${req.url}`,
            data: req.body
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Orders Service is currently unavailable.' });
        }
    }
});

// Health check endpoint for the Gateway itself
app.get('/health', (req, res) => {
    res.json({ message: 'API Gateway is running smoothly.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`[Gateway] API Gateway listening on port ${PORT}`);
});
