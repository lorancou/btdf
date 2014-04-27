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
                duckPos += 0.1;
            } else if (sanitizedMessage == "backward") {
                duckPos -= 0.1;
            }
            
            var fullMessage = { u: sanitizedUser, m: sanitizedMessage, d: duckPos };
        
            io.sockets.emit("s",fullMessage);
            allMessages.push(fullMessage);
        }
    });
});
