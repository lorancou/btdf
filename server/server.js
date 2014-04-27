// Messages:
// "e" -> connection Established
// "c" -> chat message received from Client
// "s" -> chat message broadcasted from Server

var io = require("socket.io").listen(8080),
    sanitize = require('validator').sanitize,
    allMessages = new Array();

// Server info
var serverInfo = {
    isBeneath: false,
    duckPos : 0.0
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
                serverInfo.duckPos += 0.05;
            } else if (sanitizedMessage == "backward" || sanitizedMessage == "bw") {
                serverInfo.duckPos -= 0.05;
            }

            var fullMessage = { u: sanitizedUser, m: sanitizedMessage, i: serverInfo };
            io.sockets.emit("s",fullMessage);
            allMessages.push(fullMessage);

            if (serverInfo.duckPos < 0.0) {
                serverInfo.duckPos = 0.0;
                var loseMessage = {u: "server", m: "Not this way", i: serverInfo};
                io.sockets.emit("s",loseMessage);
                allMessages.push(loseMessage);
            } else if (serverInfo.duckPos >= 1.0) {
                serverInfo.duckPos = 0.0;
                var winMessage = {u: "server", m: "Great success! {:V", i: serverInfo};
                io.sockets.emit("s",winMessage);
                allMessages.push(winMessage);
            }
        }
    });
});
