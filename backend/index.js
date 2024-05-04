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

const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'CS594Proj'
};

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');
        return connection;
    } catch (error) {
        console.error('Error connecting to MySQL database:', error.message);
        throw error;
    }
}

// Check if user exists in the database
async function checkUserExists(username) {
    const connection = await connectToDatabase();
    try {
        const [rows, fields] = await connection.execute('SELECT * FROM server_db WHERE username = ?', [username]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error checking user existence:', error.message);
        throw error;
    } finally {
        await connection.end();
        console.log('Disconnected from MySQL database');
    }
}

// Add user to the database
async function addUser(username, publicKey, ephemeralKeyPair_pub, ephemeralKeyPair_priv) {
    const connection = await connectToDatabase();

    try {
        const [result] = await connection.execute('INSERT INTO server_db (username, identityKeyPair, ephemeralKey_Pub, ephemeralKey_Private) VALUES (?, ?, ?, ?, )', [username, publicKey, ephemeralKeyPair_pub, ephemeralKeyPair_priv]);
        console.log(`User '${username}' added to the database`);
        return result.insertId; // Returns the ID of the newly inserted row
    } catch (error) {
        console.error('Error adding user to the database:', error.message);
        throw error;
    } finally {
        await connection.end();
        console.log('Disconnected from MySQL database');
    }
}


// Add signed prekey for a particular username
async function addSignedPreKey(username, signedPreKey) {
    const connection = await connectToDatabase();

    try {
        const [result] = await connection.execute('UPDATE server_db SET signed_prekey = ? WHERE username = ?', [signedPreKey, username]);
        if (result.affectedRows === 0) {
            console.log(`No user found with username '${username}'.`);
        } else {
            console.log(`Signed prekey added for user '${username}'.`);
        }
    } catch (error) {
        console.error('Error adding signed prekey:', error.message);
        throw error;
    } finally {
        await connection.end();
        console.log('Disconnected from MySQL database');
    }
}

// for output purpose!
const preBundleKeysMap = new Map();

app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
    
    try {

        // Check if the user exists in the simulated database
        let user =  await checkUserExists(username);

        // If the user doesn't exist, create a new X3DH key pair for the user
        if (!user) {
            // const keyPair = await x3dh.createKeyPair();
            const identityKeyPair = (await x3dh.createKeyPair()).privKey;
            const ephemeralKeyPair = await x3dh.createKeyPair();
            user = {
                username: username,
                x3dhPublicKey: identityKeyPair.pubKey,
                x3dhPrivateKey: identityKeyPair.privKey
            };
            // Store the user in the simulated databasee
            users[username] = user;

            const userId = await addUser(username, identityKeyPair, ephemeralKeyPair.pubKey, ephemeralKeyPair.privKey);

            preBundleKeysMap.set(username, {
                identityKeyPair,
                ephemeralKeyPair
              });
    
            console.log([...preBundleKeysMap.entries()]);
                preBundleKeysMap.forEach((value, key) => {
                console.log(`Username: ${key}`);
                console.log('Prebundle Keys:');
                console.log('Identity Key Pair:', value.identityKeyPair);
                console.log('Ephemeral Key Pair:', value.ephemeralKeyPair);
                console.log('---');
            });
        }

        // Simulated X3DH key exchange
        const serverPublicKey = x3dh.getRandomBytes(32); // Simulating server's public key
        const clientKey = await x3dh.generateHash(user.x3dhPublicKey); // Simulating client's ephemeral key
        const sharedSecret = await x3dh.generateMAC(serverPublicKey, clientKey); // Simulating shared secret
        
        // Log the shared secret (just for simulation purposes)
        console.log("Shared secret:", sharedSecret.toString("hex"));

        await addSignedPreKey(username, sharedSecret.toString("hex"));
        
        
        user.sharedSecret = sharedSecret;
        
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