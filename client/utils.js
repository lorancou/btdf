"use strict";

exports.centerToTopLeft = function(pos, image) {
    pos.x -= image.getSize()[0] * 0.5;
    pos.y -= image.getSize()[1] * 0.5;
    return pos;
}