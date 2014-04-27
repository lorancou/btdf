"use strict";

var gamejs = require('gamejs'),
    utils = require('utils');

// Duck ctor
exports.duck = function(scene, serverInfo) {    
    exports.duck.superConstructor.apply(this, arguments);
    
    this.scene = scene;

    this.animFrame = 0;
    this.animTime = 0;
    this.ANIM_DELTA = 100;

    this.originalImage = [
        gamejs.image.load("./res/duck0.png"),
        gamejs.image.load("./res/duck1.png"),
        gamejs.image.load("./res/duck2.png"),
        gamejs.image.load("./res/duck3.png"),
        gamejs.image.load("./res/duck4.png"),
        gamejs.image.load("./res/duck5.png"),
        gamejs.image.load("./res/duck6.png"),
    ];

    this.image = this.originalImage[this.animFrame];

    //this.originalImage = gamejs.image.load("./res/duck.png");
    // this.image = this.originalImage;
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

    // 7 frames anim
    this.animTime += dt;
    if (this.animTime > this.ANIM_DELTA)
    {
        this.animTime -= this.ANIM_DELTA;
        this.animFrame = (this.animFrame + 1) % 7;
    }

    this.rect = this.getRect(serverInfo);
    this.floatBob.update(dt);
    this.image = gamejs.transform.rotate(this.originalImage[this.animFrame], this.floatBob.rotation);
}
