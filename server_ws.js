// import { WebSocketServer } from 'ws';
const { WebSocketServer } = require('ws');


const wss = new WebSocketServer({ port: 1200 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function incoming(data) {
    console.log('received: %s', data);
    ws.send(data);
  });

  ws.send('Connected to the server');
});

