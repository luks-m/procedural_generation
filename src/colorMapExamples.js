const generators = require('./colorMapGenerator.js');

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapGreys(options) {
    const rgbVariations = [[255, 0]];
    const _options = {
        redVariations: rgbVariations,
        greenVariations: rgbVariations,
        blueVariations: rgbVariations,
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapMushroom(options) {
    const _options = {
        redVariations: [[255, 0]],
        greenVariations: [[0, 255]],
        blueVariations: [[0, 255]],
        alphaVariations: [[255]],
        ...options 
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapSpring(options) {
    const _options = { 
                redVariations: [[255, 0]],
                greenVariations: [[0, 255]], 
                blueVariations: [[0]],
                alphaVariations: [[255]],
                ...options
            };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapJet(options) {
    const _options = {
        redVariations: [[255, 0]],
        greenVariations: [[0]],
        blueVariations: [[0, 255]],
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapHSL(options) {
    const _options = {
        redVariations: [[240]],
        greenVariations: [[0, 255]],
        blueVariations: [[97]],
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapLight(options) {
    const _options = {
        redVariations: [[0], [0], [0, 125], [0, 255], [125, 0]],
        greenVariations: [[0, 125], [125, 255], [255, 125], [125, 0], [0]],
        blueVariations: [[255, 125], [125, 0], [0], [0], [0]],
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapIsland(options) {
    const _options = {
        redVariations: [[0], [135], [249], [127], [154], [128]],
        greenVariations: [[0], [206], [228], [255], [205], [128]],
        blueVariations: [[255], [235], [183], [0], [50], [0]],
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapIslandD(options) {
    const _options = {
        redVariations: [[0, 135], [135, 249], [249, 127], [127, 154], [154, 128], [128]],
        greenVariations: [[0, 206], [206, 228], [228, 255], [255, 205], [205, 128], [128]],
        blueVariations: [[255, 235], [235, 183], [183, 0], [0, 50], [50, 0], [0]],
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapSnow(options) {
    const _options = {
        redVariations: [[0], [0, 120], [120, 240], [240, 110]],
        greenVariations: [[0, 120], [0], [120, 0], [0]],
        blueVariations: [[255]],
        alphaVariations: [[255, 120], [120, 0], [0], [0]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapPurple(options) {
    const _options = {
        redVariations: [[0], [0, 120], [120, 240], [240, 110]],
        greenVariations: [[0], [0, 120], [120, 0], [0]],
        blueVariations: [[255, 120], [120, 0], [0], [0]],
        alphaVariations: [[255]],
        ...options
    };
    const generator = generators.colorMap(_options);
    return (x, y) => generator(x, y);
}

/**
 * 
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function colorMapHot(options) {
    const _options = {
        redVariations: [[28], [7], [0], [10], [37], [75], [121], [243], [203], [161], [113], [67], [23], [7], [1], [15], [48], [92], [140], [186], [222], [250]],
        greenVariations: [[8], [26], [59], [98], [136], [176], [211], [252], [142], [95], [58], [26], [5], [0], [11], [35], [71], [112], [158], [198], [227], [251]],
        blueVariations: [[1], [4], [8], [11], [19], [22], [35], [75], [123], [143], [152], [166], [185], [189], [207], [218], [227], [237], [244], [250], [247], [255]],
        alphaVariations: [[255]],
        ...options
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
