const cryptoUtils = require('./x3dh.js');

async function testCryptoUtils() {
    try {
        // Generate random bytes
        const randomBytes = cryptoUtils.getRandomBytes(16);
        console.log('Random Bytes:', randomBytes);

        // Encrypt and decrypt data
        const key = cryptoUtils.getRandomBytes(32); // AES key
        const iv = cryptoUtils.getRandomBytes(16); // Initialization Vector
        const plaintext = Buffer.from('Hello, world!', 'utf-8');
        console.log('Plaintext:', plaintext.toString());
        const encryptedData = await cryptoUtils.encrypt(key, plaintext, iv);
        console.log('Encrypted Data:', encryptedData.toString('hex'));
        const decryptedData = await cryptoUtils.decrypt(key, encryptedData, iv);
        console.log('Decrypted Data:', decryptedData.toString());

        // Hash data
        const dataToHash = Buffer.from('Hello, world!', 'utf-8');
        const hash = await cryptoUtils.hash(dataToHash);
        console.log('Hash:', hash.toString('hex'));

        // Generate key pair
        const keyPair = await cryptoUtils.createKeyPair();
        console.log('Public Key:', keyPair.pubKey.toString('hex'));
        console.log('Private Key:', keyPair.privKey.toString('hex'));

        // ECDH
        const sharedSecret = await cryptoUtils.ECDHE(keyPair.pubKey, keyPair.privKey);
        console.log('Shared Secret:', sharedSecret.toString('hex'));

        // Ed25519 Sign and Verify
        const message = Buffer.from('Hello, world!', 'utf-8');
        const signature = await cryptoUtils.Ed25519Sign(keyPair.privKey, message);
        console.log('Signature:', signature.toString('hex'));
        const isVerified = await cryptoUtils.Ed25519Verify(keyPair.pubKey, message, signature);
        console.log('Is Verified:', isVerified);

        // Verify MAC
        const keyMAC = await cryptoUtils.getRandomBytes(32);
        const mac = await cryptoUtils.sign(keyMAC, dataToHash);
        await cryptoUtils.verifyMAC(dataToHash, keyMAC, mac, mac.byteLength);
        console.log('MAC Verified!');
    } catch (error) {
        console.error('Error:', error);
    }
}

testCryptoUtils();
