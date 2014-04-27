var gamejs = require('gamejs');

// The background
exports.background = function() {    
    exports.background.superConstructor.apply(this, arguments);
    this.image = gamejs.image.load("./res/background.png");
    this.rect = new gamejs.Rect([0,0]);
    return this;
};
gamejs.utils.objects.extend(exports.background, gamejs.sprite.Sprite);

// The foreground
exports.foreground = function() {    
    exports.foreground.superConstructor.apply(this, arguments);
    this.image = gamejs.image.load("./res/foreground.png");
    this.rect = new gamejs.Rect([0,0]);
    return this;
};
gamejs.utils.objects.extend(exports.foreground, gamejs.sprite.Sprite);
