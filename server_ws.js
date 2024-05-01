const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 1200 });
const clients = []; // Array to store connected WebSocket instances


wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  clients.push(ws);

  ws.on('message', function incoming(data) {
    console.log('received: %s', data);
    // Broadcast the received message to all connected clients
    // clients.forEach(client => {
    //   client.send(data);
    // });
    ws.send(data.toString());
  });

  ws.send('Connected to the server');
});
