console.log("I'm the client, hi! {:V");

// Open a socket to the server
var socket = io.connect("http://btdf.roustach.fr:8080/");

// Callback to send a chat message to a server
function sendChatMsg() {
    var user = document.getElementById("chat-user").value;
    var message = document.getElementById("chat-message").value;
    socket.emit("c", { u : user, m : message });
    document.getElementById("chat-message").value = "";
}

// Generate a random user name
// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
document.getElementById("chat-user").value = "user_" + Math.random().toString(36).substr(2, 5);

// Send a chat message when the "send" button is pressed
document.getElementById("chat-send").onclick = sendChatMsg;

// Send a chat message when return is pressed in the message box
document.getElementById("chat-message").onkeypress = function (event) {
    if (event.which == 13 || event.keyCode == 13) {
        sendChatMsg();
        return false;
    }
    return true;
};

// Appends chat messages received from the server in the log
socket.on("s", function(data) {
    document.getElementById("chat-log").innerHTML += "<b>" + data["u"] + ":</b> " + data["m"] + "<br/>";
});

// Resources
var data = [
];

// Main
function main() {
    init();
    
    gamejs.onTick(function(dt) {
        update(dt);
    });
}

// Init
function init() {
    // Init GameJs
    var canvas = document.getElementById("gjs-canvas");
    var display = gamejs.display.setMode([canvas.width, canvas.height]);
    
    // Focus the chat message box (GameJs kind of takes the focus)
    document.getElementById("chat-message").focus();
}

// Update
function update(dt) {
    gamejs.display.getSurface().fill('magenta');
}

// Run GameJs
var gamejs = require('gamejs');
gamejs.preload(data);
gamejs.ready(main);
