// import WebSocket from 'ws';
const WebSocket = require('ws');
const readline = require('readline');

// WebSocket server URL
const serverUrl = 'ws://localhost:1200';

// Create a new WebSocket instance
const ws = new WebSocket(serverUrl);

// Event listener for WebSocket connection open
ws.on('open', function open() {
  console.log('Connected to WebSocket server');

  // Send test data to server
  ws.send('Hello from client!');
});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
  // Ask for input from the user
rl.question('Enter a message to send to the server: ', function(message) {
  // Send the message to the server
  ws.send(message);

  // Close the interface
  rl.close();
});

// Event listener for WebSocket message received
ws.on('message', function incoming(data) {
  console.log('Received message from server:', data);
});

// Event listener for WebSocket connection close
ws.on('close', function close() {
  console.log('Disconnected from WebSocket server');
});
