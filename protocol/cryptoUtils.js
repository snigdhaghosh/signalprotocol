// In cryptoUtils.js
const sign = async function (key, data) {
    const hmacKey = await sodium.crypto_auth_keygen();
    const signature = sodium.crypto_auth(data, hmacKey);
    return signature;
};

module.exports = {
    // Your other functions...
    sign: sign
};
