"use strict";

exports.centerToTopLeft = function(pos, image) {
    pos.x -= image.getSize()[0] * 0.5;
    pos.y -= image.getSize()[1] * 0.5;
    return pos;
}

exports.floatBob = function(speed, angleMax) {
    this.SPEED = speed;
    this.ANGLE_MAX = angleMax;
    this.rotationT = Math.random();;
    this.rotation = 0;
    return this;
}

exports.floatBob.prototype.update = function(dt) {
    this.rotationT += dt * this.SPEED;
    var cosT = Math.cos(this.rotationT);
    this.rotation = (cosT - 0.5) * this.ANGLE_MAX ;
}
