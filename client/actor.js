"use strict";

var gamejs = require('gamejs'),
    utils = require('utils');

// Duck ctor
exports.duck = function(scene, serverInfo) {    
    exports.duck.superConstructor.apply(this, arguments);
    this.scene = scene;
    this.serverInfo = serverInfo;
    this.image = gamejs.image.load("./res/duck.png");
    this.rect = this.getRect();
    return this;
};
gamejs.utils.objects.extend(exports.duck, gamejs.sprite.Sprite);

// Duck position
exports.duck.prototype.getRect = function() {
    var centerPos = new gamejs.Rect(
        this.scene.START + this.serverInfo.duckPos * (this.scene.FINISH - this.scene.START),
        240
        );
    return utils.centerToTopLeft(centerPos, this.image);
}

// Duck update
exports.duck.prototype.update = function(dt) {
    this.rect = this.getRect();
}
