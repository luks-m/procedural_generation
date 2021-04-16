/**
 * 
 * @param {*} options 
 * @returns 
 */
function isEven(options) {
    return options.x % 2 === 0;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function isOdd(options) {
    return options.x % 2 !==0;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function sameParity(options) {
    return isEven({x:options.x}) === isEven({x:options.y});
}

/**
 * 
 * @returns 
 */
function predTrue() {
    return true;
}

/**
 * 
 * @returns 
 */
function predFalse() {
    return false;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predTopLine(options) {//x, y, size, width) {
    return options.x % options.size < options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predBottomLine(options) {//x, y, size, width) {
    return (options.size - options.x % options.size) < options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predLeftLine(options) {//x, y, size, width) {
    return options.y % options.size < options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predRightLine(options) {//x, y, size, width) {
    return (options.size - options.y % options.size) < options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predCornerTopRight(options) {//x, y, size, width) {
    return (options.x % options.size) > (options.y % options.size) - options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predCornerTopLeft(options) {//x, y, size, width) {
    return (options.size - options.x % options.size) > (options.y % options.size) - options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predCornerBottomRight(options) {//x, y, size, width) {
    return (options.x % options.size) > (options.size - options.y % options.size) - options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predCornerBottomLeft(options) {//x, y, size, width) {
    return (options.x % options.size) < (options.y % options.size) + options.width;
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predDiagBottomRightTopLeft(options) {//x, y, size, width) {
    options.width = -options.width/2;
    return !predCornerBottomLeft(options) && !predCornerTopRight(options);
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function predDiagBottomLeftTopRight(options) {//x, y, size, width) {
    options.width = -options.width / 2;
    return !predCornerBottomRight(options) && !predCornerTopLeft(options);
}
/**
 * 
 * @param {*} options 
 * @returns 
 */
function whichPart(options) {//x, y, size) {
    return [Math.floor(options.x / options.size), Math.floor(options.y / options.size)];
}

/**
 * 
 * @param {*} options 
 * @returns 
 */
function isSquareDiag(options) {//x, y, size) {
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
