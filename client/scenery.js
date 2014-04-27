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
    this.image = gamejs.image.load(imageFile);
    this.rect = utils.centerToTopLeft(new gamejs.Rect([xPosition, 200]), this.image);
    return this;
};
gamejs.utils.objects.extend(exports.buoy, gamejs.sprite.Sprite);
