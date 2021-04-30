const helpers = require('./helpers.js');

// A checkerboard generator with 'color1' and 'color2'
// and with 'pixelPerCase' pixel per case, so the number a case can be chosen.
function makeCheckerboard(options) {
    function checkerboard(x, y) {
	if ((x%(options.pixelPerCase*2) < options.pixelPerCase && y%(options.pixelPerCase*2) < options.pixelPerCase)
	    || (x%(options.pixelPerCase*2) > options.pixelPerCase && y%(options.pixelPerCase*2) > options.pixelPerCase))
	    return options.color1;
	else
	    return options.color2;
    }
    return checkerboard;
}

exports.makeCheckerboard = makeCheckerboard;

