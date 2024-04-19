// X3DH 
// X3DH has three phases:
// Bob publishes his identity key and prekeys to a server.
// Alice fetches a "prekey bundle" from the server, and uses it to send an initial message to Bob.
// Bob receives and processes Alice's initial message.

// curve 22519
// hash SHA 256
// npm install elliptic

const sodium = require('libsodium-wrappers');
const { ec } = require('elliptic');
const crypto = require('crypto');
const curve = new ec('curve25519');

const sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest();
};


// Generate a random private key
const generatePrivateKey = () => {
  return curve.genKeyPair();
  // return crypto.randomBytes(32);
};

// Calculate shared secret
// Step 5: Derive Shared Secrets (X3DH Key Agreement)
function deriveSharedSecret(identityKey, ephemeralKey, prekey, ownIdentityPrivateKey, ownPrekeyPrivateKey) {

  // TODO: fix for derive!
  // TODO: cannot derive. public key is probably not generating properly!

  const sharedSecret1 = curve.keyFromPublic(identityKey).derive(ownIdentityPrivateKey);
  const sharedSecret2 = curve.keyFromPublic(ephemeralKey).derive(ownPrekeyPrivateKey);
  const sharedSecret3 = curve.keyFromPublic(prekey).derive(ownPrekeyPrivateKey);

  // Concatenate and hash the shared secrets
  const sharedSecretBytes = Buffer.concat([
    sharedSecret1.toArrayLike(Buffer),
    sharedSecret2.toArrayLike(Buffer),
    sharedSecret3.toArrayLike(Buffer),
  ]);
  const hashedSecret = sha256(sharedSecretBytes);

  return hashedSecret;
}


const x3dh = (user1IdentityKeyPair, user1PrekeyPair, user1PrekeyBundle, 
  user2IdentityKeyPair, user2PrekeyPair, user2PrekeyBundle) => {


  const user1SharedSecret = deriveSharedSecret(
    user1PrekeyBundle.identityKey,
    user1PrekeyBundle.ephemeralKey,
    user1PrekeyBundle.prekey,
    user2IdentityKeyPair.getPrivate(),
    user2PrekeyPair.getPrivate(),
  );

  const user2SharedSecret = deriveSharedSecret(
    user2PrekeyBundle.identityKey,
    user2PrekeyBundle.ephemeralKey,
    user2PrekeyBundle.prekey,
    user1IdentityKeyPair.getPrivate(),
    user1PrekeyPair.getPrivate(),
  );


}


// example from CHATGPT
const aliceIdentityKeyPair = generatePrivateKey();
const alicePrekeyPair = curve.genKeyPair();

const alicePrekeyBundle = {
  identityKey: aliceIdentityKeyPair.getPublic(),
  ephemeralKey: curve.genKeyPair().getPublic(), // Ephemeral key pair for each session
  prekey: alicePrekeyPair.getPublic(),
};

const bobIdentityKeyPair = generatePrivateKey();
const bobPrekeyPair = curve.genKeyPair();
const bobPrekeyBundle = {
  identityKey: bobIdentityKeyPair.getPublic(),
  ephemeralKey: curve.genKeyPair().getPublic(), // Ephemeral key pair for each session
  prekey: bobPrekeyPair.getPublic(),
};


x3dh(aliceIdentityKeyPair, alicePrekeyPair, alicePrekeyBundle, bobIdentityKeyPair, bobPrekeyPair, bobPrekeyBundle);



