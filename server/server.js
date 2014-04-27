// Messages:
// "e" -> connection Established
// "c" -> chat message received from Client
// "s" -> chat message broadcasted from Server
// "d" -> Duck position update

var io = require("socket.io").listen(8080),
    sanitize = require('validator').sanitize,
    allMessages = new Array();

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
    socket.emit("e",allMessages);

    socket.on("c", function(data) {
        if (serverInfo.state == "playing") {
            var sanitizedUser = sanitize(data["u"]).escape();
            var sanitizedMessage = sanitize(data["m"]).escape();
            
            if (sanitizedMessage != "" && sanitizedUser != "" && sanitizedUser !="server") {
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
