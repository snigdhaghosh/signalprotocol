// In DRTesting.js

// Import necessary modules
const DoubleRatchet = require('./doubleRatchet');
const cryptoUtils = require('./cryptoUtils');

// Define a function to run tests
async function runTests() {
    try {
        // Initialize Double Ratchet instance
        const dr = new DoubleRatchet();
        await dr.initialize();

        // Generate key pair for key agreement
        const { pubKey, privKey } = await cryptoUtils.createKeyPair();

        // Perform key agreement
        await dr.performKeyAgreement(privKey, pubKey);

        // Encrypt and decrypt a message
        const message = 'Hello, world!';
        const encryptedMessage = await dr.encryptMessage(message);
        const decryptedMessage = await dr.decryptMessage(encryptedMessage);

        // Verify the decrypted message
        if (decryptedMessage === message) {
            console.log('Message encryption and decryption successful!');
        } else {
            console.error('Message encryption and decryption failed!');
        }

        // Output additional test results as needed
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the tests
runTests();
