# API Gateway Microservice

## Purpose
The API Gateway serves as the single entry point for UI clients. Instead of the frontend communicating with Users (Port 3001), Products (Port 3002), and Orders (Port 3003) separately, the frontend makes all requests to the Gateway (Port 3000).

The Gateway then acts as a "Reverse Proxy" and manually forwards the request to the correct downstream service.

## How It Works
It uses Express middlewares (`app.use('/api/...', ...)`) to catch requests that match specific URL prefixes and uses `axios` to make an onward HTTP request.

## Endpoints Redirected
- `/api/users/*` -> Forwards to `http://localhost:3001/*`
- `/api/products/*` -> Forwards to `http://localhost:3002/*`
- `/api/orders/*` -> Forwards to `http://localhost:3003/*`
