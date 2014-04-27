// Messages:
// "e" -> connection Established
// "c" -> chat message received from Client
// "s" -> chat message broadcasted from Server

var io = require("socket.io").listen(8080),
    sanitize = require('validator').sanitize,
    allMessages = new Array();

var duckPos = 0.0;
 
// Server started!
allMessages.push({u: "server", m: "Quack! {:V", d: duckPos});
allMessages.push({u: "server", m: "Say \"forward\"?", d: duckPos});

// Broadcast received chat messages
io.sockets.on("connection", function(socket) {
    socket.emit("e",allMessages);

    socket.on("c", function(data) {
        var sanitizedUser = sanitize(data["u"]).escape();
        var sanitizedMessage = sanitize(data["m"]).escape();
        
        if (sanitizedMessage != "") {
            if (sanitizedMessage == "forward") {
                duckPos += 0.05;
            } else if (sanitizedMessage == "backward") {
                duckPos -= 0.05;
            }

            var fullMessage = { u: sanitizedUser, m: sanitizedMessage, d: duckPos };
            io.sockets.emit("s",fullMessage);
            allMessages.push(fullMessage);

            if (duckPos < 0.0) {
                duckPos = 0.0;
                var loseMessage = {u: "server", m: "Not this way", d: duckPos};
                io.sockets.emit("s",loseMessage);
                allMessages.push(loseMessage);
            } else if (duckPos >= 1.0) {
                duckPos = 0.0;
                var winMessage = {u: "server", m: "Great success! {:V", d: duckPos};
                io.sockets.emit("s",winMessage);
                allMessages.push(winMessage);
            }
        }
    });
});
