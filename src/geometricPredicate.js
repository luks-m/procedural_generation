/**
 * @typedef {Object} CommonXOptions
 * @property {number} x - the number to tested
 */

/**
 * Checks if the parameter is an even number
 * @param {CommonXOptions} options 
 * @returns {boolean} true if the parameter is even, false else
 */
function isEven(options) {
    return options.x % 2 === 0;
}

/**
 * Checks if the parameter is an odd number
 * @param {CommonXOptions} options 
 * @returns {boolean} true if the parameter is odd, false else
 */
function isOdd(options) {
    return options.x % 2 !==0;
}

/**
 * @typedef {Object} SameParityOptions
 * @property {number} x - the first number to tested
 * @property {number} y - the second number to tested
 */

/**
 * Checks if the two parameters have the same parity
 * @param {SameParityOptions} options 
 * @returns {boolean} true if the two parameter have the same parity, false else
 */
function sameParity(options) {
    return isEven({x:options.x}) === isEven({x:options.y});
}

/**
 * Returns always true
 * @returns {boolean} always true
 */
function predTrue() {
    return true;
}

/**
 * Returns always false
 * @returns {boolean} always false
 */
function predFalse() {
    return false;
}

/**
 * @typedef {Object} GeometricOptions
 * @property {number} x - the x axis of the pixel
 * @property {number} y - the y axis of the pixel
 * @property {number} size - the tile size
 * @property {number} width - the line width
 */

/**
 * Checks if a pixel belongs to the top line of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the top line, false else
 */
function predTopLine(options) {
    return options.x % options.size < options.width;
}

/**
 * Checks if a pixel belongs to the bottom line of a tile
 * @param {GeometricOptions} options true if the pixel belongs to the bottom line, false else
 * @return {boolean}
 */
function predBottomLine(options) {
    return (options.size - options.x % options.size) < options.width;
}

/**
 * Checks if a pixel belongs to the left line of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the left line, false else
 */
function predLeftLine(options) {
    return options.y % options.size < options.width;
}

/**
 * Checks if a pixel belongs to the right line of a tile
 * @param {GeometricOptions} options true if the pixel belongs to the right line, false else
 * @returns {boolean}
 */
function predRightLine(options) {
    return (options.size - options.y % options.size) < options.width;
}

/**
 * Checks if a pixel belongs to the top right corner of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the top right corner, false else
 */
function predCornerTopRight(options) {
    return (options.x % options.size) > (options.y % options.size) - options.width;
}

/**
 * Checks if a pixel belongs to the top left corner of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the top left corner, false else
 */
function predCornerTopLeft(options) {
    return (options.size - options.x % options.size) > (options.y % options.size) - options.width;
}

/**
 * Checks if a pixel belongs to the bottom right corner of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the bottom right corner, false else
 */
function predCornerBottomRight(options) {
    return (options.x % options.size) > (options.size - options.y % options.size) - options.width;
}

/**
 * Checks if a pixel belongs to the bottom left corner of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the bottom left corner, false else
 */
function predCornerBottomLeft(options) {
    return (options.x % options.size) < (options.y % options.size) + options.width;
}

/**
 * Checks if a pixel belongs to the diagonal from bottom right to top left of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if the pixel belongs to the diagonal from bottom right to top left, false else
 */
function predDiagBottomRightTopLeft(options) {
    options.width = -options.width/2;
    return !predCornerBottomLeft(options) && !predCornerTopRight(options);
}

/**
 * Checks if a pixel belongs to the diagonal from bottom left to top right of a tile
 * @param {GeometricOptions} options 
 * @returns {boolean} true if a pixel belongs to the diagonal from bottom left to top right, false else
 */
function predDiagBottomLeftTopRight(options) {
    options.width = -options.width / 2;
    return !predCornerBottomRight(options) && !predCornerTopLeft(options);
}


/**
 * @typedef {Object} PartOptions
 * @property {number} x - the x axis of the pixel
 * @property {number} y - the y axis of the pixel
 * @property {number} size - the tile size
 */


/**
 * Give the number of the tile to which the pixel belongs
 * @param {PartOptions} options 
 * @returns {[number,number]} an array where the first item is the number according the x axis and the second item is the number according the y axis
 */
function whichPart(options) {
    return [Math.floor(options.x / options.size), Math.floor(options.y / options.size)];
}

/**
 * Checks if the pixel is on a tile border
 * @param {PartOptions} options 
 * @returns {boolean} true if the pixel is on a border, false else
 */
function isSquareDiag(options) {
    return (options.x === 0 || options.x === options.size) && (options.y === 0 || options.y === options.size);
}

exports.isEven = isEven;
exports.isOdd = isOdd;
exports.sameParity = sameParity;
exports.predTrue = predTrue;
exports.predFalse = predFalse;
exports.predTopLine = predTopLine;
exports.predBottomLine = predBottomLine;
exports.predLeftLine = predLeftLine;
exports.predRightLine = predRightLine;
exports.predCornerTopRight = predCornerTopRight;
exports.predCornerTopLeft = predCornerTopLeft;
exports.predCornerBottomRight = predCornerBottomRight;
exports.predCornerBottomLeft = predCornerBottomLeft;
exports.predDiagBottomRightTopLeft = predDiagBottomRightTopLeft;
exports.predDiagBottomLeftTopRight = predDiagBottomLeftTopRight;
exports.whichPart = whichPart;
exports.isSquareDiag = isSquareDiag;
