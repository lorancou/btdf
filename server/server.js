// Messages:
// "e" -> connection Established
// "c" -> chat message received from Client
// "s" -> chat message broadcasted from Server

var io = require("socket.io").listen(8080),
    sanitize = require('validator').sanitize,
    allMessages = new Array();
    
// Server started!
allMessages.push({u: "server", m: "Quack! {:V"});

// Broadcast received chat messages
io.sockets.on("connection", function(socket) {
    socket.emit("e",allMessages);

    socket.on("c", function(data) {
        var sanitizedUser = sanitize(data["u"]).escape();
        var sanitizedMessage = sanitize(data["m"]).escape();
        var fullMessage = { u: sanitizedUser, m: sanitizedMessage };
        io.sockets.emit("s",fullMessage);
        allMessages.push(fullMessage);
    });
});
