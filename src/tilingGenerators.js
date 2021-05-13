const helpers = require('./helpers.js');
const geometric = require('./geometricPredicate.js');
const colorFunctions = require('./colors.js');

/**
 * @typedef {Object} Color
 * @property {number} red Value of red
 * @property {number} green Value of green
 * @property {number} blue Value of blue
 * @property {number} alpha Value of alpha
 */

/**
 * @typedef {Object} SolidOptions
 * @property {Color} color - Color to fill the image (default = TRANSPARENT)
 */

/**
 * Create an image which is filled by a color (default = TRANSPARENT)
 * @param {SolidOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function solid(options) {
    const _options = {
        color: colorFunctions.examples.TRANSPARENT,
        ...options
    };
    return () => _options.color;
}

/**
 * @typedef {Object} CheckerBoardOptions
 * @property {number} pixelPerCase The number of pixels which constitute a case
 * @property {Color} color1 The first color of the checkerboard
 * @property {Color} color2 The second color of the checkerboard
 */

/**
 * A checkerboard generator
 * @param {CheckerBoardOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function checkerboard(options) {
    function _checkerboard(x, y) {
        if ((x % (options.pixelPerCase * 2) < options.pixelPerCase && y % (options.pixelPerCase * 2) < options.pixelPerCase)
            || (x % (options.pixelPerCase * 2) > options.pixelPerCase && y % (options.pixelPerCase * 2) > options.pixelPerCase))
            return options.color1;
        else
            return options.color2;
    }
    return _checkerboard;
}

/**
 * @typedef {Object} CommonOptions
 * @property {number} size The number of pixels which constitute a case
 * @property {Color} color1 The first color of the checkerboard
 * @property {Color} color2 The second color of the checkerboard
 */

/**
 * A generator of rectangle triangle
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function rectangleTriangle(options) {
    function _rectangleTriangle(x, y) {
        if (x % options.size < y % options.size) {
            return options.color1;
        }
        return options.color2;
    }
    return _rectangleTriangle;
}

/**
 * A generator of isocele triangle
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function isoscelesTriangle(options) {
    function _isoscelesTriangle(x, y) {
        const halfSize = options.size / 2;
        if (geometric.isEven({ x: (y - y % options.size) / options.size })) {
            if (x % options.size < (halfSize - y % halfSize) || x % options.size > (halfSize + y % halfSize)) {
                return options.color1;
            }
            return options.color2;
        }
        else if (x % options.size > (halfSize - (options.size - y) % halfSize) || x % options.size < (halfSize + (options.size - y) % halfSize)) {
            return options.color1;
        }
        return options.color2;
    }
    return _isoscelesTriangle;
}

/**
 * A generator of equilateral triangle
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function equilateralTriangle(options) {
    function _equilateralTriangle(x, y) {
        const halfSize = options.size / 2;
        if (geometric.isEven({ x: (y - y % options.size) / options.size })) {
            if (x % options.size < (halfSize - y % halfSize) || x % options.size > (halfSize + y % halfSize)) {
                return options.color1;
            }
            return options.color2;
        }
        if (x % options.size > (y % halfSize) && x % options.size < (options.size - y % halfSize)) {
            return options.color1;
        }
        return options.color2;
    }
    return _equilateralTriangle;
}

/**
 * A generator of zigzag
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function zigzag(options) {
    function _zigzag(x, y) {
        const predicate = x % options.size < (options.size / 2 - y % options.size / 2) || x % options.size > (options.size / 2 + y % options.size / 2);
        if (geometric.isEven({ x: (y - y % options.size) / options.size })) {
            if (predicate) {
                return options.color1;
            }
            return options.color2;
        }
        if (!predicate) {
            return options.color1;
        }
        return options.color2;
    }
    return _zigzag;
}

/**
 * A generator of a grid image
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function grid(options) {
    function _grid(x, y) {
        if (geometric.sameParity({ x: x / options.size, y: y / options.size })) {
            return options.color1;
        }
        return options.color2;
    }
    return _grid;
}

/**
 * A generator of square image
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function square(options) {
    function _square(x, y) {
        if (geometric.sameParity({ x: (x - x % options.size) / options.size, y: (y - y % options.size) / options.size })) {
            return options.color1;
        }
        return options.color2;
    }
    return _square;
}

/**
 * A generator of vichy pattern
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function vichy(options) {
    function _vichy(x, y) {
        if (geometric.sameParity({ x: x % options.size, y: y % options.size })) {
            return options.color1;
        }
        return options.color2;
    }
    return _vichy;
}

/**
 * A generator of double vichy pattern
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function doubleVichy(options) {
    function _doubleVichy(x, y) {
        const baseColor = square(options)(x, y);
        if (colorFunctions.compareColor(baseColor, options.color1)) {
            return vichy({ size: options.size / 2, color1: options.color2, color2: options.color1 })(x, y);
        }
        return vichy({ size: options.size / 2, color1: options.color2, color2: options.color1 })(x, y);
    }
    return _doubleVichy;
}

/**
 * A generator of hourglass pattern
 * @param {CommonOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function hourglass(options) {
    function _hourglass(x, y) {
        if (y % options.size < options.size / 4 || y % options.size > (3 * options.size / 4)) {
            return equilateralTriangle(options)(x, y);
        }
        return options.color1;
    }
    return _hourglass;
}

/**
 * @typedef {Object} OctogonalOptions
 * @property {number} size The number of pixels which constitute a case
 * @property {number} width The line width
 * @property {Color} color1 The first color of the checkerboard
 * @property {Color} color2 The second color of the checkerboard
 */

/**
 * A generator of octogonale form
 * @param {OctogonalOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function octagonal(options) {
    const pred = [
        [geometric.predDiagBottomLeftTopRight, geometric.predTopLine, geometric.predDiagBottomRightTopLeft],
        [geometric.predLeftLine, geometric.predFalse, geometric.predRightLine],
        [geometric.predDiagBottomRightTopLeft, geometric.predBottomLine, geometric.predDiagBottomLeftTopRight]
    ];
    function _octagonal(x, y) {
        const predOptions = { x: x % options.size, y: y % options.size, size: options.size / 3, width: options.width };
        const [index1, index2] = geometric.whichPart(predOptions);
        if (pred[index1][index2](predOptions)) {
            return options.color1;
        }
        return options.color2;
    }
    return _octagonal;
}


/**
 * @typedef {Object} GrandmaOptions
 * @property {number} size1 Size for the double vichy generator
 * @property {number} size2 Size for the octagonal generator
 * @property {number} width The line width
 * @property {Color} color1 The first color of the checkerboard
 * @property {Color} color2 The second color of the checkerboard
 */

/**
 * A generator of particular texture ressembling to old pattern
 * Use doubleVichy generator and octagonal generator
 * @param {GrandmaOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function grandmaTexture(options) {
    const pred1 = doubleVichy({ size: options.size1, color1: options.color1, color2: options.color2 });
    const pred2 = octagonal({ size: options.size2, width: options.width, color1: options.color1, color2: options.color2 });


    function _grandma(x, y) {
        if (colorFunctions.compareColor(pred1(x, y), pred2(x, y))) {
            return options.color1;
        }
        return options.color2;
    }
    return _grandma;
}

/**
 * @typedef {Object} BeeOptions
 * @property {Color} color1 The first color of the checkerboard
 * @property {Color} color2 The second color of the checkerboard
 */

/**
 * A generator of a particular texture
 * Use particulars values for the grandmaTexture generator
 * @param {BeeOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function beePattern(options) {
    let size1 = 20;
    let size2 = 8.33;
    const pred = grandmaTexture({ size1: size1, size2: size2, width: 1, color1: options.color1, color2: options.color2 });

    function compute(x, y) {
        return pred(x % size1, y % size1);
    }
    return compute;
}

/**
 * @typedef {Object} VoronoiOptions
 * @property {[[number, number], ...[number, number]]} center Array of array of point coordinates
 * @property {[Color, ...Color]} color Array of color corresponding of the point coordinates
 */

/**
 * Generator for Voronoi interpretation of points
 * @param {VoronoiOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function voronoi(options) {
    function _voronoi(x, y) {
        let array = options.center.map((i) => helpers.norm(i, [x, y]));
        let min = array.reduce(
            (acc, val, index) => acc.value > val ? { value: val, index: index } : acc,
            { value: array[0], index: 0 }
        );
        return options.color[min.index];
    }
    return _voronoi;
}

/**
 * @typedef {Object} VoronoiRandomOptions
 * @property {number} number Number of point to generate
 * @property {number} width Width of the image
 * @property {number} height Height of the image
 */

/**
 * Generator for Voronoi interpretation on `number` random points
 * @param {VoronoiRandomOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function voronoiRandom(options) {
    const _options = [...Array(options.number).keys()].reduce((accumulator) => {
        return {
            center: [...accumulator.center, [Math.random() * options.width, Math.random() * options.height]],
            color: [...accumulator.color, colorFunctions.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255)]
        };
    }, { center: [], color: [] });

    return voronoi(_options);
}

/**
 * @typedef {Object} VoronoiFormsOptions
 * @property {number} width Width of 
 * @property {number} height Height of
 * @property {number} size Size of
 */

/**
 * Generator of hexagonal form using Voronoi interpretation of points
 * @param {VoronoiFormsOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function voronoiHexagonal(options) {
    const numberPointHeight = 3 * Math.floor(options.height / options.size);
    const numberPointWidth = 3 * Math.floor(options.width / options.size);
    const iterable = [...Array(numberPointHeight).keys()].map(() => [...Array(numberPointWidth).keys()]);
    const _options = iterable.reduce((accumulator, value, y) =>
        value.reduce((acc, x) => {
            const center = (
                geometric.isEven({ x: y }) ?
                    [-options.size + x * options.size, y * options.size] :
                    [-1.5 * options.size + x * options.size, y * options.size]
            );
            return {
                center: [...acc.center, center],
                color: [...acc.color, colorFunctions.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255)]
            };
        }, accumulator),
        { center: [], color: [] }
    );
    return voronoi(_options);
}

/**
 * Generator of pentagonal form using Voronoi interpretation of points
 * @param {VoronoiFormsOptions} options Set of options for this generator function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function voronoiPentagonal(options) {
    const numberPointHeight = 3 * Math.floor(options.height / options.size);
    const numberPointWidth = 3 * Math.floor(options.width / options.size);
    const iterable = [...Array(numberPointHeight).keys()].map(() => [...Array(numberPointWidth).keys()]);
    const _options = iterable.reduce((accumulator, value, i) =>
        value.reduce((acc, j) => {
            const centers = (geometric.isEven({ x: i }) ? [
                ...acc.center,
                [-options.size + j * options.size + options.size / 3, i * options.size / 2],
                [-options.size + j * options.size - options.size / 3, i * options.size / 2],
                [-options.size + j * options.size, i * options.size / 2 + options.size / 4],
                [-options.size + j * options.size, i * options.size / 2 - options.size / 4]
            ] : [
                ...acc.center,
                [-1.5 * options.size + j * options.size, i * options.size / 2 + options.size / 4],
                [-1.5 * options.size + j * options.size, i * options.size / 2 - options.size / 4],
                [-1.5 * options.size + j * options.size - options.size / 3, i * options.size / 2],
                [-1.5 * options.size + j * options.size + options.size / 3, i * options.size / 2]
            ]
            );
            return {
                center: centers,
                color: [
                    ...acc.color,
                    colorFunctions.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255),
                    colorFunctions.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255),
                    colorFunctions.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255),
                    colorFunctions.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255)
                ]
            };
        }, accumulator),
        { center: [], color: [] }
    );
    return voronoi(_options);
}

exports.solid = solid;
exports.checkerboard = checkerboard;
exports.rectangleTriangle = rectangleTriangle;
exports.isoscelesTriangle = isoscelesTriangle;
exports.equilateralTriangle = equilateralTriangle;
exports.grid = grid;
exports.square = square;
exports.doubleVichy = doubleVichy;
exports.hourglass = hourglass;
exports.octagonal = octagonal;
exports.zigzag = zigzag;
exports.grandmaTexture = grandmaTexture;
exports.beePattern = beePattern;
exports.voronoi = voronoi;
exports.voronoiRandom = voronoiRandom;
exports.voronoiHexagonal = voronoiHexagonal;
exports.voronoiPentagonal = voronoiPentagonal;
