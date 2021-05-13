const generators = require('./colorMapGenerator.js');

/**
 * @typedef {Object} Color
 * @property {number} red Value of red
 * @property {number} green Value of green
 * @property {number} blue Value of blue
 * @property {number} alpha Value of alpha
 */

/**
 * @typedef {Object} ColorMapExampleOptions
 * @property {function(number, number) : number} f - Function taking the coordinate of a point and return a value representing this point
 * @property {number} min - Min boundary value of f
 * @property {number} max - Max boundary value of f
 */

/**
 * Color an image in grayscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapGreys(options) {
    const rgbVariations = [[255, 0]];
    const _options = {
        ...options,
        redVariations: rgbVariations,
        greenVariations: rgbVariations,
        blueVariations: rgbVariations,
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in mushroomscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapMushroom(options) {
    const _options = {
        ...options,
        redVariations: [[255, 0]],
        greenVariations: [[0, 255]],
        blueVariations: [[0, 255]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in springscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapSpring(options) {
    const _options = {
                ...options,
                redVariations: [[255, 0]],
                greenVariations: [[0, 255]], 
                blueVariations: [[0]],
                alphaVariations: [[255]]
            };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in jetscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapJet(options) {
    const _options = {
        ...options,
        redVariations: [[255, 0]],
        greenVariations: [[0]],
        blueVariations: [[0, 255]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in HSLscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapHSL(options) {
    const _options = {
        ...options,
        redVariations: [[240]],
        greenVariations: [[0, 255]],
        blueVariations: [[97]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in lightscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapLight(options) {
    const _options = {
        ...options,
        redVariations: [[0], [0], [0, 125], [0, 255], [125, 0]],
        greenVariations: [[0, 125], [125, 255], [255, 125], [125, 0], [0]],
        blueVariations: [[255, 125], [125, 0], [0], [0], [0]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in greenscale and brownscale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapIsland(options) {
    const _options = {
        ...options,
        redVariations: [[0], [135], [249], [127], [154], [128]],
        greenVariations: [[0], [206], [228], [255], [205], [128]],
        blueVariations: [[255], [235], [183], [0], [50], [0]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in greenscale and brownscale gradient depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapIslandD(options) {
    const _options = {
        ...options,
        redVariations: [[0, 135], [135, 249], [249, 127], [127, 154], [154, 128], [128]],
        greenVariations: [[0, 206], [206, 228], [228, 255], [255, 205], [205, 128], [128]],
        blueVariations: [[255, 235], [235, 183], [183, 0], [0, 50], [50, 0], [0]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in snowscale (white/blue scale) depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapSnow(options) {
    const _options = {
        ...options,
        redVariations: [[0], [0, 120], [120, 240], [240, 110]],
        greenVariations: [[0, 120], [0], [120, 0], [0]],
        blueVariations: [[255]],
        alphaVariations: [[255, 120], [120, 0], [0], [0]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in purplescale depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapPurple(options) {
    const _options = {
        ...options,
        redVariations: [[0], [0, 120], [120, 240], [240, 110]],
        greenVariations: [[0], [0, 120], [120, 0], [0]],
        blueVariations: [[255, 120], [120, 0], [0], [0]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * Color an image in hotscale (red / orange scale) depending on a noise function
 * @param {ColorMapExampleOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function colorMapHot(options) {
    const _options = {
        ...options,
        redVariations: [[28], [7], [0], [10], [37], [75], [121], [243], [203], [161], [113], [67], [23], [7], [1], [15], [48], [92], [140], [186], [222], [250]],
        greenVariations: [[8], [26], [59], [98], [136], [176], [211], [252], [142], [95], [58], [26], [5], [0], [11], [35], [71], [112], [158], [198], [227], [251]],
        blueVariations: [[1], [4], [8], [11], [19], [22], [35], [75], [123], [143], [152], [166], [185], [189], [207], [218], [227], [237], [244], [250], [247], [255]],
        alphaVariations: [[255]]
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}



exports.greys = colorMapGreys;
exports.mushroom = colorMapMushroom;
exports.hot = colorMapHot;
exports.spring = colorMapSpring;
exports.purple = colorMapPurple;
exports.jet = colorMapJet;
exports.hsl = colorMapHSL;
exports.light = colorMapLight;
exports.island = colorMapIsland;
exports.islandD = colorMapIslandD;
exports.snow = colorMapSnow;
