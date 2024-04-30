// import WebSocket from 'ws';
const { WebSocket } = require('ws');


const ws = new WebSocket('http://localhost:1200');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});