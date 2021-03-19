const helpers = require('./helpers.js');

function opacityChanger(image, opacity) {
    function opacityIntern(x, y) {
	let colorPixel = image(x,y);
	colorPixel.alpha = opacity;
	return colorPixel;
    }
    return opacityIntern;
}

exports.opacityChanger = opacityChanger;
