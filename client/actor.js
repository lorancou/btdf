var gamejs = require('gamejs');

// The duck
exports.duck = function(rect) {    
    exports.duck.superConstructor.apply(this, arguments);
    this.image = gamejs.image.load("./res/duck.png");
    this.rect = new gamejs.Rect(rect);
    return this;
};
gamejs.utils.objects.extend(exports.duck, gamejs.sprite.Sprite);
