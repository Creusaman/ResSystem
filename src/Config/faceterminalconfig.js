const websocket = new WebSocket("ws://<152.244.203.193>:<7792>");  // Replace with your device's IP and port

websocket.onopen = () => {
    console.log("Connected to device.");
};

websocket.onmessage = (event) => {
    console.log(`Received: ${event.data}`);
};

function cmd() {
    const command = prompt("Enter a command: ");
    websocket.send(command);
}