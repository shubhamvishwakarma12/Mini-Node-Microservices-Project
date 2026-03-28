# Simple E-Commerce Microservices

This project is a straightforward Node.js application demonstrating a microservices architecture. It is designed to be a learning tool for developers to understand how microservices communicate without being bogged down by databases or complex deployments.

## Architecture

The project is split into four separate Node.js applications:

1.  **API Gateway (Port 3000)**: The single entry point for all client requests. It routes requests to the appropriate backend microservice.
2.  **Users Service (Port 3001)**: Manages read/write operations for user profiles.
3.  **Products Service (Port 3002)**: Manages catalog and inventory (products).
4.  **Orders Service (Port 3003)**: Manages order creation. This service demonstrates *Inter-Service Communication* by making HTTP requests to the Users Service to verify the user, and the Products Service to verify the product exists and has stock.

## Prerequisites

- Node.js installed

## Generating the Environment and Running the App

Follow these steps to successfully run the project:

### 1. Install All Dependencies

From the root directory (`/ecommerce-microservices`), run:
```bash
npm run install-all
```
This script will install the root dependencies and then navigate into each microservice folder (`api-gateway`, `users-service`, `products-service`, `orders-service`) to install their respective dependencies (`express`, `cors`, `axios`).

### 2. Start the Application

From the root directory, run:
```bash
npm start
```
This uses the `concurrently` package to start all four microservices at the same time in your terminal. You should see boot up logs from ports `3000`, `3001`, `3002`, and `3003`.

## How to Test

You can test the microservices using `curl` or Postman to make requests directly to the API Gateway (`http://localhost:3000`).

### Test Users Service
Get all users:
```bash
curl http://localhost:3000/api/users
```

### Test Products Service
Get all products:
```bash
curl http://localhost:3000/api/products
```

### Test Orders Service (Inter-Service Communication)
Create an order. The API Gateway forwards this to Orders Service. Orders Service then makes HTTP requests to Users Service and Products Service to validate the data:
```bash
curl -X POST http://localhost:3000/api/orders \
-H "Content-Type: application/json" \
-d "{\"userId\": 1, \"productId\": 101, \"quantity\": 2}"
```
If you provide an invalid `userId` or `productId`, the Orders service will return an error because it fails validation against the other services!

## Developer Notes

- **No Databases**: We are using in-memory arrays (simple JS arrays) to store Data. This is strictly to help you focus on the Express Routing and Axios requests.
- **REST APIs**: Standard JSON HTTP requests are used across the board.
- **Each Folder is Independent**: Although we start them together via `concurrently`, each microservice folder is a fully independent Node project and its own isolated entity.
