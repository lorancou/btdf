var io = require("socket.io").listen(8080);

// Broadcast received chat messages
io.sockets.on("connection", function(socket) {
    socket.on("c", function(data) {
        io.sockets.emit("s",{ m: data["m"] });
    });
});
