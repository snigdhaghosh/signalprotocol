// In cryptoUtils.js

// Import necessary libraries
const sodium = require('libsodium-wrappers');

// Function to generate random bytes
const getRandomBytes = async function (size) {
    await sodium.ready;
    return sodium.randombytes_buf(size);
};

// Function to generate a key pair for Ed25519 signing
const createKeyPair = async function () {
    await sodium.ready;
    const { publicKey, privateKey } = sodium.crypto_sign_keypair();
    // Extract the first 32 bytes (256 bits) as the private key
    const truncatedPrivateKey = privateKey.slice(0, sodium.crypto_sign_SECRETKEYBYTES / 2);
    console.log('Private Key Length:', truncatedPrivateKey.length);
    return {
        pubKey: publicKey,
        privKey: truncatedPrivateKey
    };
};

// Function to sign a message using Ed25519
const Ed25519Sign = async function (privKey, message) {
    await sodium.ready;
    const signature = sodium.crypto_sign_detached(message, privKey);
    return signature;
};

// Function to verify a signature using Ed25519
const Ed25519Verify = async function (pubKey, msg, sig) {
    return sodium.crypto_sign_verify_detached(sig, msg, pubKey);
};

// Function to generate a Message Authentication Code (MAC)
const generateMAC = async function (data, key) {
    await sodium.ready;
    return sodium.crypto_generichash(32, data, key);
};

// Function to verify a MAC
const verifyMAC = async function (data, key, mac) {
    await sodium.ready;
    const calculatedMAC = await this.generateMAC(data, key);
    return sodium.memcmp(calculatedMAC, mac);
};

// Function to generate a hash of data
const generateHash = async function (data) {
    await sodium.ready;
    return sodium.crypto_generichash(32, data);
};

// Function to perform Diffie-Hellman key agreement
const diffieHellman = async function (publicKey, privateKey) {
    await sodium.ready;
    if (privateKey.length !== sodium.crypto_sign_SECRETKEYBYTES / 2) {
        throw new Error('Invalid private key length');
    }
    return sodium.crypto_scalarmult(privateKey, publicKey);
};

// Function to perform HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
const hkdf = async function (secretKey, salt) {
    await sodium.ready;
    return sodium.crypto_generichash(32, secretKey, salt);
};

// Function to encrypt data using AES
const encryptAES = async function (key, data) {
    await sodium.ready;
    const nonce = sodium.randombytes_buf(sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    const cipherText = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(data, null, null, nonce, key);
    return cipherText;
};

// Function to decrypt data using AES
const decryptAES = async function (key, cipherText) {
    await sodium.ready;
    const nonce = cipherText.slice(0, sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES);
    const message = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(null, cipherText.slice(sodium.crypto_aead_chacha20poly1305_ietf_NPUBBYTES), null, nonce, key);
    return message;
};

// Export all functions for use in other modules
module.exports = {
    getRandomBytes: getRandomBytes,
    createKeyPair: createKeyPair,
    Ed25519Sign: Ed25519Sign,
    Ed25519Verify: Ed25519Verify,
    generateMAC: generateMAC,
    verifyMAC: verifyMAC,
    generateHash: generateHash,
    diffieHellman: diffieHellman,
    hkdf: hkdf,
    encryptAES: encryptAES,
    decryptAES: decryptAES
};
