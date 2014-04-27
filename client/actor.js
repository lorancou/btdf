"use strict";

var gamejs = require('gamejs'),
    utils = require('utils');

// Duck ctor
exports.duck = function(scene, serverInfo) {    
    exports.duck.superConstructor.apply(this, arguments);
    this.scene = scene;
    this.originalImage = gamejs.image.load("./res/duck.png");
    this.image = this.originalImage;
    this.rect = this.getRect(serverInfo);
    this.floatBob = new utils.floatBob(0.003, 12);
    return this;
};
gamejs.utils.objects.extend(exports.duck, gamejs.sprite.Sprite);

// Duck position
exports.duck.prototype.getRect = function(serverInfo) {
    var centerPos = new gamejs.Rect(
        this.scene.START + serverInfo.duckPos * (this.scene.FINISH - this.scene.START),
        245
        );
    return utils.centerToTopLeft(centerPos, this.image);
}

// Duck update
exports.duck.prototype.update = function(dt, serverInfo) {
    this.rect = this.getRect(serverInfo);
    this.floatBob.update(dt);
    this.image = gamejs.transform.rotate(this.originalImage, this.floatBob.rotation);
}
