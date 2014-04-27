"use strict";

// Open a socket to the server
var socket = io.connect("http://btdf.roustach.fr:8080/");

// Server info
var serverInfo = {
    isBeneath: false,
    duckPos : 0.0,
    duckSpeed : 0.0
};

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

    // Apply duck position, etc.
    if ( data.length > 0 ) {
        serverInfo = data[data.length-1]["i"];
    }
});

// Appends new chat messages received from the server in the log
socket.on("s", function(data) {
    var chatLog = document.getElementById("chat-log");
    
    // Actually appends
    chatLog.innerHTML += formatChatMessage(data["u"], data["m"]);
    
    // Scroll down
    chatLog.scrollTop = chatLog.scrollHeight;
    
    // Apply duck position, etc.
    serverInfo = data["i"];
});

// Duck position update
socket.on("d", function(data) {
    serverInfo.duckPos = data;
});

// GameJs stuff starts here
var gamejs = require('gamejs'),
    scenery = require('scenery'),
    actor = require('actor');

// Resources
var resources = [
    "./res/background.png",
    "./res/beneath.png",
    "./res/duck0.png",
    "./res/duck1.png",
    "./res/duck2.png",
    "./res/duck3.png",
    "./res/duck4.png",
    "./res/duck5.png",
    "./res/duck6.png",
    "./res/foreground_beneath.png",
    "./res/foreground_filled.png",
    "./res/finish.png",
    "./res/start.png",
];

// Client objects
var scene = {
    WIDTH : 512,
    HEIGHT : 512,
    START : 100,
    FINISH : 412,
    isBeneath : false,
    background : null,
    beneath : null,
    foregroundFilled : null,
    foregroundBeneath : null,
    startBuoy : null,
    finishBuoy : null,
    duck : null
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
    gamejs.display.setMode([scene.WIDTH, scene.HEIGHT]);
    
    // Focus the chat message box (GameJs takes the focus in .ready())
    document.getElementById("chat-message").focus();

    // Init scene
    scene.background = new scenery.fullScreenSprite(scene, 0, "./res/background.png");
    scene.beneath = new scenery.fullScreenSprite(scene, 0.01, "./res/beneath.png");
    scene.foregroundFilled = new scenery.fullScreenSprite(scene, 0.01, "./res/foreground_filled.png");
    scene.foregroundBeneath = new scenery.fullScreenSprite(scene, 0.01, "./res/foreground_beneath.png");
    scene.startBuoy = new scenery.buoy(scene, scene.START, "./res/start.png");
    scene.finishBuoy = new scenery.buoy(scene, scene.FINISH, "./res/finish.png");
    scene.duck = new actor.duck(scene, serverInfo);
}

// Update scene
function update(dt) {
    // Dead reckoning on the duck position
    serverInfo.duckPos += serverInfo.duckSpeed * dt / 1000.0;

    scene.beneath.update(dt);
    scene.foregroundFilled.update(dt);
    scene.foregroundBeneath.update(dt);
    scene.startBuoy.update(dt);
    scene.finishBuoy.update(dt);
    scene.duck.update(dt, serverInfo);
}

// Draw scene
function draw() {
    var mainSurface = gamejs.display.getSurface();
    
    scene.background.draw(mainSurface);

    if (serverInfo.isBeneath) {
        scene.beneath.draw(mainSurface);
    }

    scene.startBuoy.draw(mainSurface);
    scene.finishBuoy.draw(mainSurface);
    scene.duck.draw(mainSurface);
    
    if (serverInfo.isBeneath) {
        scene.foregroundBeneath.draw(mainSurface);
    } else {
        scene.foregroundFilled.draw(mainSurface);
    }
}
