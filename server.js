const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Set the port for the server

// Define a route
app.get('/', (req, res) => {
    res.send('Just Testing'); // Send a simple response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
