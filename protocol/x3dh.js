// // X3DH 
// // X3DH has three phases:
// // Bob publishes his identity key and prekeys to a server.
// // Alice fetches a "prekey bundle" from the server, and uses it to send an initial message to Bob.
// // Bob receives and processes Alice's initial message.


// // curve 22519
// // hash SHA 256
// // npm install elliptic


const sodium = require('libsodium-wrappers');
const { ec: EC } = require('elliptic');
const crypto = require('crypto');
const curve = new EC('curve25519');

const sign = async function (key, data) {
    const hmacKey = await sodium.crypto_auth_keygen();
    const signature = sodium.crypto_auth(data, hmacKey);
    return signature;
};


module.exports = {
    getRandomBytes: function (size) {
        return crypto.randomBytes(size);
    },
    encrypt: async function (key, data, iv) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedData = cipher.update(data);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        return encryptedData;
    },
    decrypt: async function (key, data, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedData = decipher.update(data);
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        return decryptedData;
    },
    hash: async function (data) {
        return crypto.createHash('sha256').update(data).digest();
        // const hash = await sodium.crypto_generichash(data);
        // return hash;
    },
    KDF: async function (input, salt, info) {
        const PRK = await sign(salt, input);
        const infoBuffer = Buffer.concat([info, Buffer.alloc(1).fill(1), PRK]);
        const T1 = await sign(PRK, infoBuffer.slice(32));
        infoBuffer.fill(T1, 32);
        infoBuffer[infoBuffer.length - 1] = 2;
        const T2 = await sign(PRK, infoBuffer);
        return [T1, T2];
    },
    // Curve 25519 crypto
    createKeyPair: async function () {
        await sodium.ready;
        const { publicKey, privateKey } = sodium.crypto_box_keypair();
        return {
            pubKey: publicKey,
            privKey: privateKey
        };
    },
    
    ECDHE: async function (pubKey, privKey) {
        const publicKey = curve.keyFromPublic(pubKey);
        const privateKey = curve.keyFromSecret(privKey);
        const sharedSecret = privateKey.derive(publicKey.getPublic());
        return sharedSecret.toArrayLike(Buffer);
    },
    Ed25519Sign: async function (privKey, message) {
        const signature = sodium.crypto_sign_detached(message, privKey);
        return signature;
    },
    Ed25519Verify: async function (pubKey, msg, sig) {
        return sodium.crypto_sign_verify_detached(sig, msg, pubKey);
    },
    verifyMAC: async function (data, key, mac, length) {
        const calculatedMAC = await sign(key, data);
        if (calculatedMAC.byteLength !== length || mac.byteLength !== length) {
            throw new Error('Bad MAC length');
        }
        let result = 0;
        const a = Buffer.from(calculatedMAC);
        const b = Buffer.from(mac);
        for (let i = 0; i < length; i++) {
            result |= a[i] ^ b[i];
        }
        if (result !== 0) {
            throw new Error('Bad MAC');
        }
    },
};





