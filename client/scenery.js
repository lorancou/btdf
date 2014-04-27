"use strict";

var gamejs = require('gamejs'),
    utils = require('utils');

// The background & foreground
exports.fullScreenSprite = function(imageFile) {    
    exports.fullScreenSprite.superConstructor.apply(this, arguments);
    this.image = gamejs.image.load(imageFile);
    this.rect = new gamejs.Rect([0, 0]);
    return this;
};
gamejs.utils.objects.extend(exports.fullScreenSprite, gamejs.sprite.Sprite);

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
