const io = require('socket.io-client');
const { config } = require('./config');
const { AnimationController } = require('./AnimationController');

const socket = io(`${config.socket_url}:${config.socket_port}`);
const animationController = new AnimationController();

socket.on('connect', () => {
    console.log('Connected');
    socket.emit('led_connect', {
        rows: config.rows,
        cols: config.cols,
        ledId: socket.id,
    })
})

socket.on('set_animation', data => {
    animationController.animate(data);
})