const { ConnectedDevice } = require('../entities/ConnectedDevice');

class ConnectedDeviceController {
	constructor(io, socket, state) {
		this.io = io;
		this.socket = socket;
		this.state = state;

		this.socket.on('led_connect', data => {
            console.log('Led matrix connected');
			this.state = {
				...this.state,
				...data,
				ledId: this.socket.id
			}
			this.socket.broadcast('state', this.state);
        });
	}
}

module.exports = { ConnectedDeviceController };
