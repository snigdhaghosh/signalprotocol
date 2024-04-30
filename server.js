const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// User data (for demo purposes; replace with database in production)
let users = [];

// Message data (for demo purposes; replace with database in production)
let messages = [];

// Handle user registration
app.post('/register', (req, res) => {
    // Extract username and password from request body
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Add user to users array (for demo purposes; replace with database insertion in production)
    users.push({ username, password });

    // Respond with a success message
    res.status(200).json({ message: 'User registered successfully' });
});

// Handle message sending
app.post('/message', (req, res) => {
    // Extract sender, recipient, and message content from request body
    const { sender, recipient, message } = req.body;

    // Check if sender, recipient, and message are provided
    if (!sender || !recipient || !message) {
        return res.status(400).json({ error: 'Sender, recipient, and message are required' });
    }

    // Add message to messages array (for demo purposes; replace with database insertion in production)
    messages.push({ sender, recipient, message });

    // Respond with a success message
    res.status(200).json({ message: 'Message sent successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
