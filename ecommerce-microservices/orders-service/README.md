# Orders Microservice

## Purpose
The Orders Service creates records for purchases.

## Key Concept Explored (Synchronous Inter-Service Communication)
This service demonstrates why Microservices can be incredibly complicated yet scalable. Before an order is created, the service does not check its own local database for User info or Product info, because it does not own that data.

Instead, it makes HTTP `GET` requests using `axios` over the network to:
1. Contact the Users Service and verify the user ID is valid.
2. Contact the Products Service and verify the product ID is valid and has enough stock.
3. Make an HTTP `PATCH` request to the Products Service to deduct the requested amount of stock.

Only when all three network requests pass successfully does it finally create the Order Object in memory.

### Fallback/Error Handling
If the product service throws a 404 because the ID doesn't exist, Axios will throw an error, which we catch, and we return that specific `Service Communication Error` back to the consumer.
