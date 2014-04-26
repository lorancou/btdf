console.log("I'm the client, hi! {:V");

// Open a socket to the server
var socket = io.connect("http://btdf.roustach.fr:8080/");

// Callback to send a chat message to a server
function sendChatMsg() {
    var message = document.getElementById("chat-msg").value;
    socket.emit("c", { m : message });
    document.getElementById("chat-msg").value = "";
}

// Send a chat message when the "send" button is pressed
document.getElementById("chat-send").onclick = sendChatMsg;

// Send a chat message when return is pressed in the message box
document.getElementById("chat-msg").onkeypress = function (event) {
    if (event.which == 13 || event.keyCode == 13) {
        sendChatMsg();
        return false;
    }
    return true;
};

// Appends chat messages received from the server in the log
socket.on("s", function(data) {
    document.getElementById("chat-log").innerHTML += data["m"] + "<br/>";
});
