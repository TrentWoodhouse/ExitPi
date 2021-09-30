let express = require('express');
let app = express();
let server = require('http').createServer(app);
let { config } = require('./config');
let { state } = require('./state');
const { TextController } = require('./controllers/TextController');
const { ConnectedDeviceController } = require('./controllers/ConnectedDeviceController');

server.listen(config.PORT);
console.log("Server started on port " + config.PORT);

let io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('New Connection');

    let textController = new TextController(io, socket);
    let connectedDeviceController = new ConnectedDeviceController(io, socket, state);

    socket.on('disconnect', () => {
        console.log('Bye bye');
    })
});