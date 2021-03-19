const helpers = require('./helpers.js');

function makeCheckerboard(width, height, pixelPerCase, color1, color2) {
    function checkerboard(x, y) {
	if ((x%(pixelPerCase*2) < pixelPerCase && y%(pixelPerCase*2) < pixelPerCase)
	    || (x%(pixelPerCase*2) > pixelPerCase && y%(pixelPerCase*2) > pixelPerCase))
	    return color1;
	else
	    return color2;
    }
    return checkerboard;
}

exports.makeCheckerboard = makeCheckerboard;

