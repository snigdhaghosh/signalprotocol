# Secure Chat App with X3DH Protocol and Double Ratcheting Algorithm

This is a secure chat application that utilizes the X3DH (Extended Triple Diffie-Hellman) protocol for secure key exchange and the Double Ratcheting Algorithm for end-to-end encryption.

## X3DH Protocol

The X3DH protocol is used for secure key exchange between two parties in a communication session. It allows parties to establish shared secret keys without prior interaction, providing forward secrecy and deniability. The protocol involves multiple steps, including key generation, key agreement, and key derivation.

## Double Ratcheting Algorithm

The Double Ratcheting Algorithm is a method used for end-to-end encryption in secure messaging applications. It employs two ratchets, one for sending messages and one for receiving messages, to continuously update encryption keys. This ensures that even if an encryption key is compromised, only a limited number of messages are affected, providing forward secrecy.

## Getting Started

To run the application, follow these steps:

1. **Frontend Setup:**
   - Navigate to the `frontend` folder.
   - Run `npm install` to install dependencies.
   - Run `npm run start` to start the frontend server.

2. **Backend Setup:**
   - Navigate to the `backend` folder.
   - Run `npm install` to install dependencies.
   - Run `npm run dev` to start the backend server.

3. **Accessing the Application:**
   - Once both frontend and backend servers are running, you can access the application in your web browser.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Encryption Libraries:** libsodium-wrappers (for X3DH protocol), crypto (for Double Ratcheting Algorithm)
- **HTTP Requests:** Axios
- **Database:** Simulated database (users stored in memory)

## Contributing
- Chandhu Bhumireddy 
- Snigdha Ghosh Dastidar 
- Gunashree Channakeshava 
- Rohan Karle Sudarshan
- Abhiram Vasudev 
