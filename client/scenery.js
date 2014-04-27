"use strict";

var gamejs = require('gamejs'),
    utils = require('utils');

// The background & foreground
exports.fullScreenSprite = function(scene, scrollSpeed, imageFile) {
    exports.fullScreenSprite.superConstructor.apply(this, arguments);
    this.scene = scene;
    this.scrollSpeed = scrollSpeed;
    this.image = gamejs.image.load(imageFile);
    this.rect = new gamejs.Rect([0, 0]);
    return this;
};
gamejs.utils.objects.extend(exports.fullScreenSprite, gamejs.sprite.Sprite);

// Background & foreground update
exports.fullScreenSprite.prototype.update = function(dt) {
    this.rect.x += this.scrollSpeed * dt;
    if ( this.rect.x < -this.scene.WIDTH ) {
        this.rect.x = -this.scene.WIDTH;
        this.scrollSpeed = -this.scrollSpeed;
    } else if ( this.rect.x > 0 ) {
        this.rect.x = 0;
        this.scrollSpeed = -this.scrollSpeed;
    }
}

// The buoys
exports.buoy = function(scene, xPosition, imageFile) {    
    exports.buoy.superConstructor.apply(this, arguments);
    this.scene = scene;
    this.originalImage = gamejs.image.load(imageFile);
    this.image = this.originalImage;
    this.rect = utils.centerToTopLeft(new gamejs.Rect([xPosition, 230]), this.image);
    this.floatBob = new utils.floatBob(0.0015, 6);
    return this;
};
gamejs.utils.objects.extend(exports.buoy, gamejs.sprite.Sprite);

// Buoys update
exports.buoy.prototype.update = function(dt) {
    this.floatBob.update(dt);
    this.image = gamejs.transform.rotate(this.originalImage, this.floatBob.rotation);
}
