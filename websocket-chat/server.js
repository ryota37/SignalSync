const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8090 });

server.on('connection', (socket) => {
  console.log('A new client connected!');

  socket.on('message', (message) => {
    // メッセージを文字列として処理
    const text = message.toString();

    console.log(`Received message: ${text}`);

    // クライアント全員にメッセージを送信
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  });

  socket.on('close', () => {
    console.log('A client disconnected.');
  });
});

console.log('WebSocket server is running on ws://{localIP}:8090');
