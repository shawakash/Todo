const WebSocket = require('ws');
const fs = require("fs");

const wss = new WebSocket.Server({ port: 8084 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Send a message to the client
    // ws.send('Hello from the server!');

    ws.on('message', (message) => {
        if(message == 'request-file') {
            fs.readFile('todos.json', "utf-8", (err, data) => {
                if(err) {
                    ws.send(err)
                    return;
                }
                console.log(data)
                ws.send(data);
            });
        }
    })

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
