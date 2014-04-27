// Open a socket to the server
var socket = io.connect("http://btdf.roustach.fr:8080/");

// Callback to send a chat message to a server
function sendChatMessage() {
    var user = document.getElementById("chat-user").value;
    var message = document.getElementById("chat-message").value;
    socket.emit("c", { u : user, m : message });
    document.getElementById("chat-message").value = "";
}

// Format a chat message for display in the log
function formatChatMessage(user, message) {
    return "<b>" + user + ":</b> " + message + "<br/>"
}

// Generate a random user name
// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
document.getElementById("chat-user").value = "user_" + Math.random().toString(36).substr(2, 5);

// Send a chat message when the "send" button is pressed
document.getElementById("chat-send").onclick = sendChatMessage;

// Send a chat message when return is pressed in the message box
document.getElementById("chat-message").onkeypress = function (event) {
    if (event.which == 13 || event.keyCode == 13) {
        sendChatMessage();
        return false;
    }
    return true;
};

// Init the chat log when the connection is established
socket.on("e", function(data) {
    var chatLog = document.getElementById("chat-log");

    // Display all previous messages
    chatLog.innerHTML = "";
    for (var i=0; i<data.length; ++i) {
        chatLog.innerHTML += formatChatMessage(data[i]["u"], data[i]["m"]);
    }

    // Scroll down
    chatLog.scrollTop = chatLog.scrollHeight;
});

// Appends new chat messages received from the server in the log
socket.on("s", function(data) {
    var chatLog = document.getElementById("chat-log");
    
    // Actually appends
    chatLog.innerHTML += formatChatMessage(data["u"], data["m"]);
    
    // Scroll down
    chatLog.scrollTop = chatLog.scrollHeight;
});

// GameJs stuff starts here
var gamejs = require('gamejs'),
    scenery = require('scenery');

// Resources
var resources = [
    "./res/background.png",
    "./res/foreground.png",
    "./res/duck.png",
];

// Client objects
var gClient = {
    width : 512,
    height : 512,
    background : null,
    foreground : null
};

// Main
function main() {
    init();
    
    gamejs.onTick(function(dt) {
        update(dt);
        draw();
    });
}

// Run GameJs
gamejs.preload(resources);
gamejs.ready(main);

// Init
function init() {
    // Init GameJs
    var canvas = document.getElementById("gjs-canvas");
    gamejs.display.setMode([gClient.width, gClient.height]);
    
    // Init game objects
    gClient.background = new scenery.background(0,0,gClient.width,gClient.height);
    gClient.foreground = new scenery.foreground(0,0,gClient.width,gClient.height);
    
    // Focus the chat message box (GameJs kind of takes the focus)
    document.getElementById("chat-message").focus();
}

// Update
function update(dt) {
}

// Draw
function draw() {
    var mainSurface = gamejs.display.getSurface();
    gClient.background.draw(mainSurface);
    gClient.foreground.draw(mainSurface);
}
