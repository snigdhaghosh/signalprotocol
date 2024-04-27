const sodium = require('libsodium-wrappers');
const crypto = require('crypto');

module.exports = {
    getRandomBytes: function (size) {
        return crypto.randomBytes(size);
    },
    createKeyPair: async function () {
        await sodium.ready;
        const { publicKey, privateKey } = sodium.crypto_sign_keypair();
        return {
            pubKey: publicKey,
            privKey: privateKey
        };
    },
    Ed25519Sign: async function (privKey, message) {
        await sodium.ready;
        const signature = sodium.crypto_sign_detached(message, privKey);
        return signature;
    },
    Ed25519Verify: async function (pubKey, msg, sig) {
        return sodium.crypto_sign_verify_detached(sig, msg, pubKey);
    },
    generateMAC: async function (data, key) {
        await sodium.ready;
        return sodium.crypto_generichash(32, data, key);
    },
    verifyMAC: async function (data, key, mac) {
        await sodium.ready;
        const calculatedMAC = await this.generateMAC(data, key);
        return sodium.memcmp(calculatedMAC, mac);
    },
    generateHash: async function (data) {
        await sodium.ready;
        return sodium.crypto_generichash(32, data);
    }
};
