// Command handling functions...

function handleRegister(ws, data) {
    // You can implement the registration logic here
    // Check device information and respond accordingly
  
    if (data.sn === "AYRG14039578") {
      const responseMessage = JSON.stringify({
        ret: 'reg',
        result: true,
        cloudtime: new Date().toISOString(),
        nosenduser: false,
      });
      ws.send(responseMessage);

    }else if (data.sn === "UI") {
            const responseMessage = JSON.stringify({
              ret: 'reg',
              result: true,
              cloudtime: new Date().toISOString(),
              nosenduser: false,
            });
            ws.send(responseMessage);

    } else {
      const responseMessage = JSON.stringify({
        ret: 'reg',
        result: false,
        reason: 'did not reg', // Specify the reason for failure
      });
      console.log(`Sending response to device ${data.sn}: ${responseMessage}`);

      ws.send(responseMessage);
    }
  }

  function handleSendLog(ws, data) {
    // Process the received log data
    const receivedLogs = data.record;
    
    // Your logic to process the received log data and respond accordingly
    // For demonstration purposes, let's assume the logs were processed successfully
    const processedLogs = receivedLogs.map(log => {
        return {
            enrollid: log.enrollid,
            time: log.time,
            result: true, // Replace with your actual logic for processing logs
        };
    });

    const responseMessage = JSON.stringify({
        ret: 'sendlog',
        result: true,
//        count: processedLogs.length,
        count: data.count,
        logindex: data.logindex,
        cloudtime: new Date().toISOString(),
        access: 1, // 1 for open the door, 0 for cannot open the door (implementar aqui a logica para autorização de acesso via servidor, caso use o dispositivo para somente autorizar quando o servidor autorizar)
    });
    console.log(responseMessage)
    ws.send(responseMessage);
  }

    // Assuming you have a user database or data structure to store user information
    const userDatabase = []; // This is just a placeholder, replace it with your actual database
    function handleSendUser(ws, data) {
        const enrollid = data.enrollid;
        const name = data.name;
        const backupnum = data.backupnum;
        const admin = data.admin;
        const record = data.record;

        // Store the user data in your database
        userDatabase.push({
            enrollid: enrollid,
            name: name,
            backupnum: backupnum,
            admin: admin,
            record: record,
        });

        const responseMessage = {
            ret: 'senduser',
            result: true,
            cloudtime: new Date().toISOString(),
        };

        ws.send(JSON.stringify(responseMessage));
  }

  const userList = [];

function getUserList(ws) {
  const requestMessage = {
    cmd: 'getuserlist',
    stn: true,
  };

  ws.send(JSON.stringify(requestMessage));
}

function handleGetUserList(ws, data) {
  if (data.result === true) {
    if(data.count > 0){
        if (data.from === 0) {
        userList.length = 0; // Clear the user list for the first package
        userList.push(...data.record);
        } else if (data.from === userList.length -1) {
        userList.push(...data.record);
        }

        if (data.count < 40) {
        const responseMessage = JSON.stringify({
            cmd: 'getuserlist',
            stn: false,
        });
        ws.send(responseMessage);
        }

    } else {
      console.log('User list successfully received.');
    }
  } else {
    console.log('Failed to receive user list.');
  }
}
  
function getUserInfo(ws, data) {
    const requestMessage = {
        cmd:"getuserinfo",
        enrollid: data.enrollid, 
        backupnum: data.backupnum,
    };
    ws.send(JSON.stringify(requestMessage));
    console.log(requestMessage);
  }  


  function handleGetUserInfo(ws, data) {
        if (result===true) {
            handleSendUser(ws, data)
            console.log (userDatabase.lastIndexOf)
        } else {
            console.log ('Failed to retrieve User Data')
        };
    }
    
    function setUserInfo(ws, data) {
        const requestMessage = {
            cmd: 'setuserinfo',
            enrollid: data.enrollid, 
            name: data.name, 
            backupnum: data.backupnum, 
            admin: data.admin, 
            record: data.record, 
        };
        ws.send(JSON.stringify(requestMessage));
    }
    
    function handleSetUserInfo(ws, data) {
        if (data.result === true) {
            console.log('User successfully added to the device');
        } else {
            console.log('Failed to add User to the device');
        }
    }
    
    function deleteUser(ws, data) {
        const requestMessage = {
            cmd:"deleteuser",
            enrollid: data.enrollid,
            backupnum: data.backupnum,
        };
        ws.send(JSON.stringify(requestMessage));
    }  

  function handleDeleteUser(ws, data) {
    if (data.result === true) {
        console.log('User successfully deleted from the device');
    } else {
        console.log('Failed to delete User from the device');
    }
}

    function getUserName(ws, data) {
        const requestMessage = {
            cmd:"getusername",
            enrollid: data.enrollid,
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleGetUserName(ws, data) {
        if (data.result === true) {
            console.log('Nome de Usuário: ', data.record);
        } else {
            console.log('Failed to retrieve UserName from the device');
        }
    }
    const toSendList = [];

    function sendNamesNextChunk(ws) {
        // Splice the next chunk of names to be sent
        const namesToSend = toSendList.splice(0, 50);
        
        const requestMessage = {
            cmd: 'setusername',
            count: namesToSend.length,
            record: namesToSend.map(name => ({ enrollid: name.enrollid, name: name.name }))
        };
    
        ws.send(JSON.stringify(requestMessage));
    }
    
    function setUserName(ws, data) {
        // Reset the list and push the new name data
        toSendList.length = 0;
        toSendList.push({ enrollid: data.enrollid, name: data.name });
        sendNamesNextChunk(ws);
    }
    
    function handleSetUserName(ws, data) {
        if (data.result === true) {
            // If there are more names to send, continue sending, else log success
            if (toSendList.length > 0) {
                sendNamesNextChunk(ws);
            } else {
                console.log('New user names successfully added to the device.');
            }
        } else {
            console.log('Failed to add the user names to the device.');
        }
    }
    

    function enableUser(ws, data) {
        const requestMessage = {
            cmd:"enableuser",
            enrollid: data.enrollid,
            enflag:1,
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleEnableUser(ws, data) {
        if (data.result === true) {
            console.log('User sucessfully Enabled/Disabled');
        } else {
            console.log('Failed to Enabled/Disabled user in the device');
        }
    }
    function disableUser(ws, data) {
        const requestMessage = {
            cmd:"enableuser",
            enrollid: data.enrollid,
            enflag:0,
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleDisableUser(ws, data) {
        if (data.result === true) {
            console.log('User sucessfully Enabled/Disabled');
        } else {
            console.log('Failed to Enabled/Disabled user in the device');
        }
    }

    function cleanUser(ws) {
        const requestMessage = {
            cmd:"cleanuser",
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleCleanUser(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully removed all users from the device');
        } else {
            console.log('Failed to remove all users from the device');
        }
    }

    function getNewLog(ws) {
        const requestMessage = {
            cmd:"getnewlog",
            stn:true,
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    const newLogDatabase = []; // This is just a placeholder, replace it with your actual database

    function handleGetNewLog(ws, data) {
        if (data.result === true) {
            if (data.from === 0) {
                newLogDatabase.length = 0;
            }
            newLogDatabase.push(...data.record);

            if (data.count !== data.to) {
                const responseMessage = {
                    cmd: 'getnewlog',
                    stn: false,
                };
                ws.send(JSON.stringify(responseMessage));
            } else {
                console.log('New logs successfully fetched.');
            }
        } else {
            console.log('Failed to fetch new logs.');
        }
    }

    function getAllLog(ws, interval) {
        const requestMessage = {
            cmd: 'getalllog',
            stn: true,
        };
    
        if (interval.from !== undefined && interval.to !== undefined) {
            requestMessage.from = from;
            requestMessage.to = to;
        }
    
        ws.send(JSON.stringify(requestMessage));
    }
    

    const allLogDatabase = []; // This is just a placeholder, replace it with your actual database
    function handleGetAllLog(ws, data) {
        if (data.result === true) {
            if (data.from === 0) {
                allLogDatabase.length = 0;
            }
            allLogDatabase.push(...data.record);

            if (data.count !== data.to) {
                const responseMessage = {
                    cmd: 'getalllog',
                    stn: false,
                };
                ws.send(JSON.stringify(responseMessage));
            } else {
                console.log('All logs successfully fetched.');
            }
        } else {
            console.log('Failed to fetch all logs.');
        }
    }

    function cleanAllLogs(ws) {
        const requestMessage = {
            cmd:"cleanlog",
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleCleanAllLogs(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully removed all logs from the device');
        } else {
            console.log('Failed to remove all logs from the device');
        }
    }

    function initSys(ws) {
        const requestMessage = {
            cmd:"initsys",
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleInitSys(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully removed all users and logs from the device');
        } else {
            console.log('Failed to remove all users and logs from the device');
        }
    }

    function reboot(ws) {
        const requestMessage = {
            cmd: "reboot",
        };
        ws.send(JSON.stringify(requestMessage));
    } 
    
    function cleanAdmin(ws) {
        const requestMessage = {
            cmd:"cleanadmin",
        };
        ws.send(JSON.stringify(requestMessage));
    }  

    function handleCleanAdmin(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully removed all admins and set them to normal users.');
        } else {
            console.log('Failed to remove all admins and set them to normal users');
        }
    }

    function setTime(ws) {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
        const requestMessage = {
            cmd: "settime",
            cloudtime: formattedDate,
        };
    
        console.log(requestMessage);
        ws.send(JSON.stringify(requestMessage));
    }
    

    function handleSetTime(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully sync server time to the device.');
        } else {
            console.log('Failed to sync server time to the device');
        }
    }

    function setTerminalParam(ws, data) {
        const requestMessage = {
            cmd: 'setdevinfo',
        };
    
        if (data.deviceid !== undefined) {
            requestMessage.deviceid = data.deviceid;
        }
        if (data.language !== undefined) {
            requestMessage.language = data.language;
        }
        if (data.volume !== undefined) {
            requestMessage.volume = data.volume;
        }
        if (data.screensaver !== undefined) {
            requestMessage.screensaver = data.screensaver;
        }
        if (data.verifymode !== undefined) {
            requestMessage.verifymode = data.verifymode;
        }
        if (data.sleep !== undefined) {
            requestMessage.sleep = data.sleep;
        }
        if (data.userfpnum !== undefined) {
            requestMessage.userfpnum = data.userfpnum;
        }
        if (data.loghint !== undefined) {
            requestMessage.loghint = data.loghint;
        }
        if (data.reverifytime !== undefined) {
            requestMessage.reverifytime = data.reverifytime;
        }
    
            //UILANG_EN, ==0 english
            //UILANG_SC, ==1 simplified Chinese
            //UILANG_TC, ==2 taiwan chinese
            //UILANG_JAPAN, ==3 japanese
            //UILANG_NKR, ==4 north korean
            //UILANG_SKR, ==5 south korean
            //UILANG_THAI, ==6 thai
            //UILANG_INDONESIA, ==7 Indonesian
            //UILANG_VIETNAM, ==8 Vietnamese
            //UILANG_SPA, ==9 Spanish
            //UILANG_FAN, ==10 French
            //UILANG_POR, ==11 Portuguese
            //UILANG_GEN, ==12 German
            //UILANG_RUSSIA, ==13 Russian
            //UILANG_TUR, ==14 Turkish
            //UILANG_ITALIAN, ==15 Italian
            //UILANG_CZECH, ==16 Czech
            //UILANG_ALB, ==17 Arabic
            //UILANG_PARSI==18 Farsi

            //3.Verify mode：
            //VERIFY_KIND_FP_CARD_PWD, ==0 Rfid card or Fingerprint or Password
            //VERIFY_KIND_CARD_ADD_FP, ==1 Rfid card and Fingerprint
            //VERIFY_KIND_PWD_ADD_FP, ==2 Password and Fingerprint
            //VERIFY_KIND_CARD_ADD_FP_ADD_PWD, ==3 Rfid card and Fingerprint and Password
            //VERIFY_KIND_CARD_ADD_PWD, ==4 Rfid card and Password
        ws.send(JSON.stringify(requestMessage));
    };  

    function handleSetTerminalParam(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully set params to the device.');
        } else {
            console.log('Failed to set params to the device');
        }
    }

    function getDevInfo(ws) {
        const requestMessage = {
            cmd: 'getdevinfo',
        };
        ws.send(JSON.stringify(requestMessage));
    }
    const devInfo = []; // This is just a placeholder, replace it with your actual database
    function handleGetDevInfo(ws, data) {
        if (data.result === true) {
            const deviceInfo = {
                deviceid: data.deviceid,
                language: data.language,
                volume: data.volume,
                screensaver: data.screensaver,
                verifymode: data.verifymode,
                sleep: data.sleep,
                userfpnum: data.userfpnum,
                loghint: data.loghint,
                reverifytime: data.reverifytime
            };
            
            devInfo.push(deviceInfo);
            
            console.log('Device info successfully fetched:', deviceInfo);
        } else {
            console.log('Failed to fetch device info.');
        }
    }   

    function openDoor(ws,data) {
        const requestMessage = {
            cmd:"opendoor",
        }
            if (data.doornum !== undefined) { //this just for access controller(1~4) because access controller have 4 doors. If delete the item, will open all doors. Normal access or attendance machine no need this item.
                requestMessage.doornum = data.doornum;
            }
        ws.send(JSON.stringify(requestMessage));
    };

    function handleOpenDoor(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully opened the door');
        } else {
            console.log('Failed to open the door');
        }
    }
  
    function setDevLock(ws, data) {
        const requestMessage = {
            cmd: 'setdevlock',
        };
    
        const parameters = [
            'opendelay', 'doorsensor', 'alarmdelay', 'threat', 'InputAlarm',
            'antpass', 'interlock', 'mutiopen', 'tryalarm', 'tamper', 'wgformat',
            'wgoutput', 'cardoutput', 'dayzone', 'weekzone'
        ];
    
        parameters.forEach(param => {
            if (param in data) {
                requestMessage[param] = data[param];
            }
        });
    
        ws.send(JSON.stringify(requestMessage));
    }
    

    function handleSetDevLock(ws, data) {
        if (data.result === true) {
            console.log('Sucessfully set device lock params.');
        } else {
            console.log('Failed to set device lock params');
        }
    }

    function getDevLock(ws) {
        const requestMessage = {
            cmd:"getdevlock",
        }
        ws.send(JSON.stringify(requestMessage));
    };
    const devLock = [];

    function handleGetDevLock(ws, data) {
        if (data.result === true) {
            devLock.length = 0;
            const {
                opendelay,
                doorsensor,
                alarmdelay,
                threat,
                InputAlarm,
                antpass,
                interlock,
                mutiopen,
                tryalarm,
                tamper,
                wgformat,
                wgoutput,
                cardoutput,
                dayzone,
                weekzone,
                lockgroup,
            } = data;
    
            // Store the data in the devLock array
            devLock.push({
                opendelay,
                doorsensor,
                alarmdelay,
                threat,
                InputAlarm,
                antpass,
                interlock,
                mutiopen,
                tryalarm,
                tamper,
                wgformat,
                wgoutput,
                cardoutput,
                dayzone,
                weekzone,
                lockgroup,
            });
    
            console.log('Successfully received devLock data.');
        } else {
            console.log('Failed to receive devLock data.');
        }
    }
    // Get the user access parameter
function getUserLock(ws, data) {
    const requestMessage = {
        cmd: 'getuserlock',
        enrollid: data.enrollid,
    };
    ws.send(JSON.stringify(requestMessage));
}

function handleGetUserLock(ws, data) {
    if (data.result === true) {
        const {
            enrollid,
            weekzone,
            weekzone2,
            weekzone3,
            weekzone4,
            group,
            starttime,
            endtime,
        } = data;

        // Store the user access parameter data in your database or data structure
        // Assuming you have a userAccessDatabase
        userAccessDatabase.push({
            enrollid,
            weekzone,
            weekzone2,
            weekzone3,
            weekzone4,
            group,
            starttime,
            endtime,
        });

        console.log('User access parameter successfully received.');
    } else {
        console.log('Failed to receive user access parameter.');
    }
}

    // Set the user's access parameter
    function setUserLock(ws, data) {
        const requestMessage = {
            cmd: 'setuserlock',
            count: data.count,
            record: data.record,
        };
        console.log(requestMessage)
        ws.send(JSON.stringify(requestMessage));
    }
    function handleSetUserLock(ws, data) {
        if (data.result === true) {
            console.log('User access parameter successfully set.');
        } else {
            console.log('Failed to set user access parameter.');
        }
    }

    // Delete the user access parameter
    function deleteUserLock(ws, data) {
        const requestMessage = {
            cmd: 'deleteuserlock',
            enrollid: data.enrollid,
        };
        ws.send(JSON.stringify(requestMessage));
    }

    function handleDeleteUserlock(ws, data) {
        if (data.result === true) {
            console.log('User access parameter successfully deleted.');
        } else {
            console.log('Failed to delete user access parameter.');
        }
    }

    // Clean all user access parameter
    function cleanUserLock(ws) {
        const requestMessage = {
            cmd: 'cleanuserlock',
        };
        ws.send(JSON.stringify(requestMessage));
    }

    function handleCleanUserLock(ws, data) {
        if (data.result === true) {
            console.log('All user access parameters successfully cleaned.');
        } else {
            console.log('Failed to clean all user access parameters.');
        }
    }

    module.exports = {
        handleRegister,
        handleSendLog,
        handleSendUser,
        getUserList,
        handleGetUserList,
        getUserInfo,
        handleGetUserInfo,
        setUserInfo,
        handleSetUserInfo,
        deleteUser,
        handleDeleteUser,
        getUserName,
        handleGetUserName,
        setUserName,
        handleSetUserName,
        enableUser,
        handleEnableUser,
        disableUser,
        handleDisableUser,
        cleanUser,
        handleCleanUser,
        getNewLog,
        handleGetNewLog,
        getAllLog,
        handleGetAllLog,
        cleanAllLogs,
        handleCleanAllLogs,
        initSys,
        handleInitSys,
        reboot,
        cleanAdmin,
        handleCleanAdmin,
        setTime,
        handleSetTime,
        setTerminalParam,
        handleSetTerminalParam,
        getDevInfo,
        handleGetDevInfo,
        openDoor,
        handleOpenDoor,
        setDevLock,
        handleSetDevLock,
        getDevLock,
        handleGetDevLock,
        getUserLock,
        handleGetUserLock,
        setUserLock,
        handleSetUserLock,
        deleteUserLock,
        handleDeleteUserlock,
        cleanUserLock,
        handleCleanUserLock
    };