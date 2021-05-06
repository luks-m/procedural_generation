const helpers = require('./helpers.js');

/**
 * A checkerboard generator
 *
 * @param {number} pixelPerCase The number of pixels which constitute a case
 * @param {object} color1 The first color of the checkerboard
 * @param {object} color2 The second color of the checkerboard
 */
function makeCheckerboard(options) {
    function checkerboard(x, y) {
		if ((x % (options.pixelPerCase * 2) < options.pixelPerCase && y % (options.pixelPerCase * 2) < options.pixelPerCase)
			|| (x % (options.pixelPerCase * 2) > options.pixelPerCase && y % (options.pixelPerCase * 2) > options.pixelPerCase))
			return options.color1;
		else
			return options.color2;
	}
    return checkerboard;
}

exports.makeCheckerboard = makeCheckerboard;

