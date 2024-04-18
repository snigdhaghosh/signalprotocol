// X3DH 
// curve 22519
// hash SHA 256


// npm install elliptic

const { ec } = require('elliptic');
const crypto = require('crypto');

const curve = new ec('curve25519');

const sha256 = (data) => {
    return crypto.createHash('sha256').update(data).digest();
};

// Generate a random private key
const generatePrivateKey = () => {
    return crypto.randomBytes(32);
  };
  
// Calculate public key from private key
const calculatePublicKey = (privateKey) => {
    const key = curve.keyFromPrivate(privateKey);
    return key.getPublic();
};

// Calculate shared secret
const calculateSharedSecret = (privateKey, publicKey) => {
    const key = curve.keyFromPrivate(privateKey);
    const shared = key.derive(publicKey);
    return shared.toArray();
};
  

const x3dh = (user1_idenitityKey, user2_identityKey, user2_prebundleKey) => {
    const user1_EphemeralPrivateKey = generatePrivateKey();
    console.log(user1_EphemeralPrivateKey);

  


}

// example from CHATGPT
const aliceIdentityKey = generatePrivateKey();
const bobIdentityKey = generatePrivateKey();
const bobPrekeyBundle = {
  identityKey: calculatePublicKey(generatePrivateKey()),
  signedPrekey: {
    publicKey: calculatePublicKey(generatePrivateKey()),
    privateKey: generatePrivateKey()
  },
  prekey: {
    publicKey: calculatePublicKey(generatePrivateKey()),
    privateKey: generatePrivateKey()
  }
};
x3dh(aliceIdentityKey, bobIdentityKey, bobPrekeyBundle);
