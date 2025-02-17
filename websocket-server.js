const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const functions = require('./websocket-functions');
console.log('Imported websocket-functions module successfully.');

const wss = new WebSocket.Server({ port: 7792 });
console.log('WebSocket server is running on port 7792...');

// Object mappings for commands and returns
const commandHandlers = {
  reg: functions.handleRegister,
  sendlog: functions.handleSendLog,
  senduser: functions.handleSendUser,
  // Add other cmd functions here as you expand...
  getuserlist: functions.getUserList,
  getuserinfo: functions.getUserInfo,
  setuserinfo: functions.setUserInfo,
  deleteuser: functions.deleteUser,
  getusername: functions.getUserName,
  setusername: functions.setUserName,
  enableuser: functions.enableUser,
  disableuser: functions.disableUser,
  cleanuser: functions.cleanUser,
  getnewlog: functions.getNewLog,
  getalllog: functions.getAllLog,
  cleanlog: functions.cleanAllLogs,
  initsys: functions.initSys,
  cleanadmin: functions.cleanAdmin,
  settime: functions.setTime,
  setdevinfo: functions.setTerminalParam,
  getdevinfo: functions.getDevInfo,
  opendoor: functions.openDoor,
  setdevlock: functions.setDevLock,
  getdevlock: functions.getDevLock,
  getuserlock: functions.getUserLock,
  setuserlock: functions.setUserLock,
  deleteuserlock: functions.deleteUserLock,
  cleanuserlock: functions.cleanUserLock,
};

const returnHandlers = {
  getuserlist: functions.handleGetUserList,
  getuserinfo: functions.handleGetUserInfo,
  setuserinfo: functions.handleSetUserInfo,
  deleteuser: functions.handleDeleteUser,
  getusername: functions.handleGetUserName,
  setusername: functions.handleSetUserName,
  enableuser: functions.handleEnableUser,
  disableuser: functions.handleDisableUser,
  cleanuser: functions.handleCleanUser,
  getnewlog: functions.handleGetNewLog,
  getalllog: functions.handleGetAllLog,
  cleanlog: functions.handleCleanAllLogs,
  initsys: functions.handleInitSys,
  cleanadmin: functions.handleCleanAdmin,
  settime: functions.handleSetTime,
  setdevinfo: functions.handleSetTerminalParam,
  getdevinfo: functions.handleGetDevInfo,
  opendoor: functions.handleOpenDoor,
  setdevlock: functions.handleSetDevLock,
  getdevlock: functions.handleGetDevLock,
  getuserlock: functions.handleGetUserLock,
  setuserlock: functions.handleSetUserLock,
  deleteuserlock: functions.handleDeleteUserlock,
  cleanuserlock: functions.handleCleanUserLock,
  // Add other ret functions here as needed...
};

const clients = {};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(data);

            // If the device sends an "sn" field and the WebSocket is not yet tagged, associate it with its WebSocket connection
            if (data.sn && !ws.sn) {
                ws.sn = data.sn; // Tag the WebSocket with the SN
                clients[data.sn] = ws;
                functions.handleRegister(ws, data);
                console.log('Connected device with serial number:', data.sn);
            }

            let deviceSN = ws.sn;

            // If the message comes from UI
            if (deviceSN === 'UI') {
                for (let sn in clients) {
                    if (sn !== 'UI') {
                        if (commandHandlers[data.cmd]) {
                            commandHandlers[data.cmd](clients[sn], data);
                        }
                    }
                }
            } else if (deviceSN) { // For registered devices
                if (data.cmd && commandHandlers[data.cmd]) {
                    commandHandlers[data.cmd](ws, data);
                } else if (data.ret && returnHandlers[data.ret]) {
                    returnHandlers[data.ret](ws, data);
                } else {
                    console.log('Unknown return value:', data);
                }
            }

        } catch (error) {
         
            console.error('Error parsing message:', error.message);
        }
    });

    ws.on('close', () => {
        let deviceSN = ws.sn;
        if (deviceSN) {
            delete clients[deviceSN];
            console.log('Disconnected device with serial number:', deviceSN);
        }
    });
});

const INTERFACE_PORT = process.env.INTERFACE_PORT || 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  // Add other MIME types as necessary...
};

const interfaceServer = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'UserInterface.html' : req.url);
  let extname = path.extname(filePath);
  let contentType = mimeTypes[extname] || 'text/plain';

  fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
          res.writeHead(500);
          res.end('Internal Server Error');
          return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
  });
});

interfaceServer.listen(INTERFACE_PORT, () => {
  console.log(`Interface Server running at http://localhost:${INTERFACE_PORT}`);
});

function sendMessageToClient(sn, message) {
  const ws = clients[sn];
  if (ws) {
      ws.send(JSON.stringify(message));
  }
}