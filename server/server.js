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
    isBeneath: false,
    duckPos : 0.0,
    duckSpeed : 0.0
};

// Server constants
var constants = {
    SERVER_DT : 100,
    DUCK_SPEED_DELTA : 0.01,
    DUCK_SPEED_MIN : -0.05,
    DUCK_SPEED_MAX : 0.10
};

// Server started!
allMessages.push({u: "server", m: "Quack! {:V", i: serverInfo});
allMessages.push({u: "server", m: "Say \"forward\"?", i : serverInfo});

// Broadcast received chat messages
io.sockets.on("connection", function(socket) {
    socket.emit("e",allMessages);

    socket.on("c", function(data) {
        var sanitizedUser = sanitize(data["u"]).escape();
        var sanitizedMessage = sanitize(data["m"]).escape();
        
        if (sanitizedMessage != "") {
            if (sanitizedMessage == "beneath" || sanitizedMessage == "bn") {
                serverInfo.isBeneath = true;
            } else if (sanitizedMessage == "surface" || sanitizedMessage == "sf") {
                serverInfo.isBeneath = false;
            } else if (sanitizedMessage == "forward" || sanitizedMessage == "fw") {
                serverInfo.duckSpeed += constants.DUCK_SPEED_DELTA;
                if ( serverInfo.duckSpeed > constants.DUCK_SPEED_MAX ) {
                    serverInfo.duckSpeed = constants.DUCK_SPEED_MAX;
                }
            } else if (sanitizedMessage == "backward" || sanitizedMessage == "bw") {
                serverInfo.duckSpeed -= constants.DUCK_SPEED_DELTA;
                if ( serverInfo.duckSpeed < constants.DUCK_SPEED_MIN ) {
                    serverInfo.duckSpeed = constants.DUCK_SPEED_MIN;
                }
            }

            var fullMessage = { u: sanitizedUser, m: sanitizedMessage, i: serverInfo };
            io.sockets.emit("s",fullMessage);
            allMessages.push(fullMessage);
        }
    });
});

// Move the duck once in a while
function update() {
    serverInfo.duckPos += serverInfo.duckSpeed * constants.SERVER_DT / 1000.0;
    
    if (serverInfo.duckPos < 0.0) {
        reset();

        var loseMessage = {u: "server", m: "Not this way", i: serverInfo};
        io.sockets.emit("s",loseMessage);
        allMessages.push(loseMessage);
    } else if (serverInfo.duckPos >= 1.0) {
        reset();

        var winMessage = {u: "server", m: "Great success! {:V", i: serverInfo};
        io.sockets.emit("s",winMessage);
        allMessages.push(winMessage);
    }    
}
setInterval(update, constants.SERVER_DT);

// Reset
function reset() {
    serverInfo.isBeneath = false;
    serverInfo.duckPos = 0.0;
    serverInfo.duckSpeed = 0.0;
}
