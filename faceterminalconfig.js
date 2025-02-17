const WebSocket = require('ws');

//const websocketUrl = 'ws://152.244.203.193:7792';
const websocketUrl = 'ws://192.168.015.004:7792';


const registerMessage = {
    cmd: 'reg',
    sn: 'AYRG14039578',
    cpusn: '123456789',
    devinfo: {
        // ... rest of the device information ...
    }
};

const socket = new WebSocket(websocketUrl);

socket.on('open', () => {
    console.log('WebSocket connection opened');
    
    // Send the register message when the connection is opened
    socket.send(JSON.stringify(registerMessage));
});

socket.on('message', (message) => {
    console.log('Received message:', message);
    
    // Handle incoming messages from the server
});

socket.on('error', (error) => {
    console.error('WebSocket error:', error);
    
    // Handle connection errors
});

socket.on('close', (code, reason) => {
    console.log(`WebSocket closed, code=${code}, reason=${reason}`);
    
    // Handle connection closure
});