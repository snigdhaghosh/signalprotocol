const ws = new WebSocket('ws://localhost:1200');

ws.onopen = function(event) {
    console.log('Connected to WebSocket server');
};

ws.onmessage = function(event) {
    console.log('Received message from server:', event.data);
    // Display received message in the chat window
    var chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML += '<p>' + event.data + '</p>';
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};

ws.onclose = function() {
    console.log('Disconnected from WebSocket server');
};

// Function to send a message to the server
function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value;
    ws.send(message);
    messageInput.value = ''; // Clear input field after sending
}



/// --------- Old Terminal based! -------------------
// const WebSocket = require('ws');
// const readline = require('readline');

// const serverUrl = 'ws://localhost:1200';
// const ws = new WebSocket(serverUrl);

// ws.on('open', function open() {
//   console.log('Connected to WebSocket server');
// });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Function to continuously accept user input and send it to the server
// function sendMessages() {
//   rl.question('Enter a message to send to the server: ', function(message) {
//     ws.send(message);
//     sendMessages(); // Recursively call sendMessages to continue accepting input
//   });
// }

// sendMessages();

// ws.on('message', function incoming(data) {
//   console.log('Received message from server:', data);
// });

// ws.on('close', function close() {
//   console.log('Disconnected from WebSocket server');
// });
