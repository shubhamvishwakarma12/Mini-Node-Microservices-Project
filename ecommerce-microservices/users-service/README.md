# Users Microservice

## Purpose
The Users Microservice handles all user-related data (creating users, fetching users).

## Concept Explored
This demonstrates a **stateless, independent microservice** that only cares about its own domain (Users). It has its own isolated package.json and simple express server. It runs completely separated from the Products and Orders logic.

## Standard Practices
- We return `200 OK` for fetching data.
- We return `201 Created` for making a new user.
- We return `404 Not Found` if a user ID does not exist.
- We return `400 Bad Request` if payload validation fails.
