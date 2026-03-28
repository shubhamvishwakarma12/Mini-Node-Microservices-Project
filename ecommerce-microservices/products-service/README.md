# Products Microservice

## Purpose
The Products Microservice handles fetching and updating inventory.

## Features
Like all other services, it stores data in a simple array.
It has a specialized `PATCH` HTTP endpoint (`/:id/stock`) to update inventory amounts, which will be called by the Orders Service during checkout.

## Inter-Service Communication Endpoints
- `GET /api/products/:id`: Returns Product data (used to check if it exists or is in stock).
- `PATCH /api/products/:id/stock`: Updates stock downwards (used to fulfill an Order).
