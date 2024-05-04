const cryptoUtils = require('./cryptoUtils');

class DoubleRatchet {
    constructor() {
        this.sendCounter = 0;
        this.receiveCounter = 0;
        this.messageBuffer = {};
        this.initializeKeys().catch(console.error);
    }

    async initializeKeys() {
        try {
            [this.rootKey, this.senderChainKey, this.receiverChainKey] = await Promise.all([
                cryptoUtils.secureRandomBytes(32),
                cryptoUtils.secureRandomBytes(32),
                cryptoUtils.secureRandomBytes(32)
            ]);
        } catch (error) {
            console.error("Failed to initialize keys: ", error.message);
            throw new Error("Initialization failed");
        }
    }

    async performKeyAgreement(privateKey, publicKey) {
        try {
            const sharedSecret = await cryptoUtils.diffieHellman(publicKey, privateKey);
            this.rootKey = await this.kdf(sharedSecret, 'newRoot');
            await this.initializeKeys(); // Reinitialize keys based on the new root key
        } catch (error) {
            console.error("Key agreement failed: ", error.message);
            throw new Error("Key agreement failed");
        }
    }

    async encryptMessage(message, senderID, receiverID) {
        try {
            if (this.sendCounter >= 100) { // Regular key update not based on threshold
                await this.initializeKeys();
            }

            const header = this.constructHeader(senderID, receiverID);
            const serializedHeader = JSON.stringify(header);
            const serializedMessage = JSON.stringify({ message });
            const [encryptedHeader, encryptedMessage] = await Promise.all([
                cryptoUtils.encryptAES(this.senderChainKey, serializedHeader),
                cryptoUtils.encryptAES(this.senderChainKey, serializedMessage)
            ]);

            this.sendCounter++;

            return Buffer.concat([encryptedHeader, encryptedMessage]);
        } catch (error) {
            console.error("Encryption failed: ", error.message);
            throw new Error("Encryption failed");
        }
    }

    async decryptMessage(encryptedData, senderID, receiverID) {
        try {
            const headerLength = 256; // Assume header is first 256 bytes of encryptedData
            const decryptedHeader = await cryptoUtils.decryptAES(this.receiverChainKey, encryptedData.slice(0, headerLength));
            const header = JSON.parse(decryptedHeader);

            if (header.messageCounter === this.receiveCounter) {
                const decryptedMessage = await this.decryptMessageContent(encryptedData.slice(headerLength));
                this.processNextMessages(header, senderID, receiverID);
                return decryptedMessage;
            } else {
                this.messageBuffer[header.messageCounter] = encryptedData;
                return null;
            }
        } catch (error) {
            console.error("Decryption failed: ", error.message);
            throw new Error("Decryption failed");
        }
    }

    async decryptMessageContent(encryptedMessageContent) {
        return JSON.parse(await cryptoUtils.decryptAES(this.receiverChainKey, encryptedMessageContent)).message;
    }

    processNextMessages(header, senderID, receiverID) {
        this.receiveCounter++;
        this.sendAck(senderID, header.messageID);

        while (this.messageBuffer[this.receiveCounter]) {
            const encryptedData = this.messageBuffer[this.receiveCounter];
            delete this.messageBuffer[this.receiveCounter];
            this.decryptMessage(encryptedData, senderID, receiverID);
        }
    }

    sendAck(receiverID, messageID) {
    }

    async kdf(secretKey, role) {
        try {
            const salt = role === 'sender' ? this.rootKey : this.senderChainKey;
            const key = await cryptoUtils.hkdf(secretKey, salt);
            return key;
        } catch (error) {
            console.error("KDF failed: ", error.message);
            throw new Error("KDF operation failed");
        }
    }

    constructHeader(senderID, receiverID) {
        return {
            messageID: cryptoUtils.getRandomBytes(16).toString('hex'), // Simulated method for unique message ID
            senderID,
            receiverID,
            messageCounter: this.sendCounter,
            timestamp: new Date().toISOString()
        };
    }

    updateSendCounter() {
        this.sendCounter++;
        if (this.sendCounter >= 100) {
            this.initializeKeys(); // Reinitialize keys to ensure security
        }
    }
}

module.exports = DoubleRatchet;
