"use strict";

// Messages:
// "e" -> Connection established
// "c" -> Chat message received from client
// "s" -> Chat message broadcasted from server
// "d" -> Duck position update

// Init socket.io
var io = require("socket.io").listen(8080);
if (typeof io !== "undefined") {
    console.log("socket.io ready");
}

// Init validator
var validator = require("validator");
if (typeof validator !== "undefined") {
    console.log("validator ready");
}

var allMessages = new Array();

// Server info sent to clients
var serverInfo = {
    state : "intro",
    isBeneath: false,
    duckPos : -0.5,
    duckSpeed : 0.1
};

// Server constants
var constants = {
    SERVER_DT : 100,
    DUCK_SPEED_DELTA : 0.01,
    DUCK_SPEED_MIN : -0.05,
    DUCK_SPEED_MAX : 0.10
};

// Server started!
allMessages.push({u: "server", m: "here comes the duck {:V", i : serverInfo});

// Broadcast received chat messages
io.sockets.on("connection", function(socket) {
    if (allMessages.length > 32) {
        allMessages.splice(0, allMessages.length - 32);
    }
    socket.emit("e",allMessages);

    socket.on("c", function(data) {
        if (serverInfo.state == "playing") {
            var sanitizedUser = validator.escape(data["u"]+"").substring(0, 32);
            var sanitizedMessage = validator.escape(data["m"]+"").substring(0, 240);
            
            if (sanitizedMessage != "" && sanitizedUser != "" && sanitizedUser != "server") {
                var sayQuack = false;
            
                if (sanitizedMessage == "beneath" || sanitizedMessage == "bn") {
                    serverInfo.isBeneath = true;
                } else if (sanitizedMessage == "surface" || sanitizedMessage == "sf") {
                    serverInfo.duckSpeed = 0.0;
                    serverInfo.isBeneath = false;
                } else if (sanitizedMessage == "forward" || sanitizedMessage == "fw") {
                    if ( serverInfo.isBeneath) {
                        serverInfo.duckSpeed += constants.DUCK_SPEED_DELTA;
                        if ( serverInfo.duckSpeed > constants.DUCK_SPEED_MAX ) {
                            serverInfo.duckSpeed = constants.DUCK_SPEED_MAX;
                        }
                    }
                } else if (sanitizedMessage == "backward" || sanitizedMessage == "bw") {
                    if ( serverInfo.isBeneath) {
                        serverInfo.duckSpeed -= constants.DUCK_SPEED_DELTA;
                        if ( serverInfo.duckSpeed < constants.DUCK_SPEED_MIN ) {
                            serverInfo.duckSpeed = constants.DUCK_SPEED_MIN;
                        }
                    }
                } else if (sanitizedMessage == "quack" || sanitizedMessage == "qk") {
                    sayQuack = true;
                }

                var fullMessage = { u: sanitizedUser, m: sanitizedMessage, i: serverInfo };
                io.sockets.emit("s",fullMessage);
                allMessages.push(fullMessage);
                
                if (sayQuack) {
                    var quackMessage = {u: "server", m: "quack! {:V", i: serverInfo};
                    io.sockets.emit("s",quackMessage);
                    allMessages.push(quackMessage);
                }
            }
        }
    });
});

// Move the duck once in a while
function update() {
    serverInfo.duckPos += serverInfo.duckSpeed * constants.SERVER_DT / 1000.0;
    
    if (serverInfo.state == "intro") {
        if (serverInfo.duckPos >= 0.0) {
            serverInfo.duckSpeed = 0.0;
            serverInfo.state = "playing";

            var playingMessage = {u: "server", m: "say something?", i: serverInfo};
            io.sockets.emit("s",playingMessage);
            allMessages.push(playingMessage);
        }
    } else if (serverInfo.state == "playing") {
        if (serverInfo.duckPos < 0.0) {
            serverInfo.duckPos = 0.0;
            serverInfo.duckSpeed = 0.0;

            var loseMessage = {u: "server", m: "not this way...", i: serverInfo};
            io.sockets.emit("s",loseMessage);
            allMessages.push(loseMessage);
        } else if (serverInfo.duckPos >= 1.0) {
            serverInfo.duckSpeed = 0.1;
            serverInfo.state = "outro";

            var winMessage = {u: "server", m: "great success!", i: serverInfo};
            io.sockets.emit("s",winMessage);
            allMessages.push(winMessage);
        }
    } else if (serverInfo.state == "outro") {
        if (serverInfo.duckPos >= 1.5) {
            serverInfo.duckPos = -0.5;
            serverInfo.duckSpeed = 0.1;
            serverInfo.isBeneath = false;
            serverInfo.state = "intro";

            var resetMessage = {u: "server", m: "here's another duck {:V", i: serverInfo};
            io.sockets.emit("s",resetMessage);
            allMessages.push(resetMessage);
        }
    }
}
setInterval(update, constants.SERVER_DT);
