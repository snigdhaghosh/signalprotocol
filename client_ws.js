const WebSocket = require('ws');
const readline = require('readline');

const serverUrl = 'ws://localhost:1200';
const ws = new WebSocket(serverUrl);

ws.on('open', function open() {
  console.log('Connected to WebSocket server');
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to continuously accept user input and send it to the server
function sendMessages() {
  rl.question('Enter a message to send to the server: ', function(message) {
    ws.send(message);
    sendMessages(); // Recursively call sendMessages to continue accepting input
  });
}

sendMessages();

ws.on('message', function incoming(data) {
  console.log('Received message from server:', data);
});

ws.on('close', function close() {
  console.log('Disconnected from WebSocket server');
});
