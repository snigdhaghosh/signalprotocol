// index.js

const express = require("express");
const cors = require("cors");
const x3dh = require("./protocol/x3dh.js"); // Importing X3DH module

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const axios = require("axios");
const x3dh = require ("./protocol/x3dh.js");

app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    // Get or create user on Chat Engine!
    try {
        // Generate key pair for X3DH
        const keyPair = await x3dh.createKeyPair();
        // Save the public key with the username
        users[username] = keyPair.pubKey;

        // Return the public key to the client
        return res.status(200).json({ publicKey: keyPair.pubKey });
    } catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/start-x3dh", async (req, res) => {
    const { username, otherUsername } = req.body;
    try {
        const publicKey = users[username];
        const otherPublicKey = users[otherUsername];

        if (!publicKey || !otherPublicKey) {
            return res.status(404).json({ error: "User not found" });
        }

        // Start X3DH protocol
        const sharedSecret = await x3dh.startX3DH(publicKey, otherPublicKey);

        return res.status(200).json({ sharedSecret });
    } catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(3001);
