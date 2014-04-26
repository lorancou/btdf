// Messages:
// "e" -> connection Established
// "c" -> chat message received from Client
// "s" -> chat message broadcasted from Server

var io = require("socket.io").listen(8080),
    sanitize = require('validator').sanitize;

// Broadcast received chat messages
io.sockets.on("connection", function(socket) {
    socket.emit("e",{});

    socket.on("c", function(data) {
        var sanitizedUser = sanitize(data["u"]).escape();
        var sanitizedMessage = sanitize(data["m"]).escape();
        io.sockets.emit("s",{ u: sanitizedUser, m: sanitizedMessage });
    });
});
