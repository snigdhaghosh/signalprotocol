const cryptoUtils = require('./x3dh.js');

async function testCryptoUtils() {
    try {
        // Generate random bytes
        const randomBytes = cryptoUtils.getRandomBytes(16);
        console.log('Random Bytes:', randomBytes);

        // Generate key pair
        const keyPair = await cryptoUtils.createKeyPair();
        console.log('Public Key:', keyPair.pubKey.toString('hex'));
        console.log('Private Key:', keyPair.privKey.toString('hex'));

        // Sign and verify
        const message = Buffer.from('Hello, world!', 'utf-8');
        console.log('Message:', message.toString('utf-8'));
        
        // Sign the message
        const signature = await cryptoUtils.Ed25519Sign(keyPair.privKey, message);
        console.log('Generated Signature:', signature.toString('hex'));

        // Verify the signature
        const isVerified = await cryptoUtils.Ed25519Verify(keyPair.pubKey, message, signature);
        console.log('Is Signature Verified:', isVerified);

        if (!isVerified) {
            console.error('Signature verification failed!');
        } else {
            console.log('Signature verification successful!');
        }

        // Generate MAC
        const keyMAC = cryptoUtils.getRandomBytes(32);
        const dataToMAC = Buffer.from('Data to MAC', 'utf-8');
        const mac = await cryptoUtils.generateMAC(dataToMAC, keyMAC);
        console.log('Generated MAC:', mac.toString('hex'));

        // Verify MAC
        const isMACVerified = await cryptoUtils.verifyMAC(dataToMAC, keyMAC, mac);
        console.log('Is MAC Verified:', isMACVerified);
        
        if (!isMACVerified) {
            console.error('MAC verification failed!');
        } else {
            console.log('MAC verification successful!');
        }

        // Generate Hash
        const dataToHash = Buffer.from('Data to hash', 'utf-8');
        const hash = await cryptoUtils.generateHash(dataToHash);
        console.log('Generated Hash:', hash.toString('hex'));
    } catch (error) {
        console.error('Error:', error);
    }
}

testCryptoUtils();