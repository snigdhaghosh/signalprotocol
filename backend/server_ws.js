const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 1200 });
const clients = []; // Array to store connected WebSocket instances


wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  clients.push(ws);
  
  const clientIndex = clients.indexOf(ws);
  console.log(`Client ${clientIndex+1} connected`);
  

  ws.on('message', function incoming(data) {
    console.log('Received from %d client: %s', clientIndex+1, data);
    // Broadcast the received message to all connected clients
    // clients.forEach(client => {
    //   client.send(data);
    // });
    ws.send(data.toString());
  });

  ws.on('close', function() {
    const clientIndex = clients.indexOf(ws);
    console.log(`Client ${clientIndex+1} disconnected`);
    clients.splice(clientIndex, 1); // Remove disconnected client from array
  });

  ws.send('Connected to the server');
});
