//index.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const axios = require("axios");
const x3dh = require("./protocol/x3dh.js");

// Simulated database to store user data
const users = {};

app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    
    try {
        // Check if the user exists in the simulated database
        let user = users[username];
        
        // If the user doesn't exist, create a new X3DH key pair for the user
        if (!user) {
            const keyPair = await x3dh.createKeyPair();
            user = {
                username: username,
                x3dhPublicKey: keyPair.pubKey,
                x3dhPrivateKey: keyPair.privKey
            };
            // Store the user in the simulated databasee
            users[username] = user;
        }
        
        // Simulated X3DH key exchange
        const serverPublicKey = x3dh.getRandomBytes(32); // Simulating server's public key
        const clientKey = await x3dh.generateHash(user.x3dhPublicKey); // Simulating client's ephemeral key
        const sharedSecret = await x3dh.generateMAC(serverPublicKey, clientKey); // Simulating shared secret
        
        // Log the shared secret (just for simulation purposes)
        console.log("Shared secret:", sharedSecret.toString("hex"));
        
        // Simulate storing shared secret securely (in a real scenario, this would be stored securely)
        user.sharedSecret = sharedSecret;
        
        // Simulate sending the shared secret securely to the client
        // In this simulation, we will just return the username and success message
        return res.status(200).json({ username: username, message: "Authentication successful" });
    } catch (error) {
        // Handle errors
        return res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});