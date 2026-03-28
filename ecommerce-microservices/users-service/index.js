const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Users service runs on port 3001

app.use(cors());
app.use(express.json());

// In-Memory Database for Users
// We use a simple array instead of a real database to keep the project easy to understand.
let users = [
    { id: 1, name: "Alice Smith", email: "alice@example.com" },
    { id: 2, name: "Bob Johnson", email: "bob@example.com" }
];

// 1. Get all users
app.get('/', (req, res) => {
    res.json(users);
});

// 2. Get a single user by ID
app.get('/:id', (req, res) => {
    // req.params.id is a string, so we convert it to an integer
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
});

// 3. Create a new user
app.post('/', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser = {
        id: users.length + 1, // Simple ID generation
        name,
        email
    };
    
    users.push(newUser);
    // 201 Created is the standard HTTP status code for successful creation
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`[Users Service] Listening on port ${PORT}`);
});
