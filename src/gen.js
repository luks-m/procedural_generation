const colorFunctions = require('./colors.js');
const helpers = require('./helpers.js');
const geometric = require('./geometricPredicate.js');

/**
 * A checkerboard generator
 *
 * @param {number} pixelPerCase The number of pixels which constitute a case
 * @param {object} color1 The first color of the checkerboard
 * @param {object} color2 The second color of the checkerboard
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
 * 
 * @param {*} size 
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * @todo rename quadrillage
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
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
 * 
 * @param {*} size 
 * @param {*} width 
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
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
 * 
 * @param {*} size1 
 * @param {*} size2 
 * @param {*} width 
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
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
 * @todo implement generator
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
 */
function beePattern(options) {
    let size1 = 20;
    let size2 = 8.33;
    const pred = grandmaTexture({ size1: size1, size2: size2, width: 1, color1: options.color1, color2: options.color2 });
    const f = (x, y) => { return [x % size1, y % size1]; };
    return generator([pred], [f], options.color1, options.color2);
}

/**
 * 
 * @param {*} center 
 * @param {*} color 
 * @returns 
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
 * 
 * @param {*} height 
 * @param {*} width 
 * @param {*} number 
 * @returns 
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
 * @todo Move to example of generator using voronoi ?
 * @param {*} height 
 * @param {*} width 
 * @param {*} size 
 * @returns 
 */
function voronoiHexagonal(options) {
    const numberPointHeight = 3 * Math.floor(options.height / options.size);
    const numberPointWidth = 3 * Math.floor(options.width / options.size);
    const iterable = [...Array(numberPointHeight).keys()].map(() => [...Array(numberPointWidth).keys()]);
    const _options = iterable.reduce( (accumulator, value, y) =>
            value.reduce( (acc, x) => {
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
 * 
 * @param {*} height 
 * @param {*} width 
 * @param {*} size 
 * @returns 
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

/**
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
function multiGradient(min, max) {
    const dist = Math.abs(max - min) * 1.01; //distance intervalle
    let sign = 1;
    if (min > max) { // si les bornes sont inversée on inverse tout ainsi que x
        min = -min;
        max = -max;
        sign = -1;
    }
    function _gradient(x, variations) {
        let value;
        
        x = x * sign;
        if (x < min) { // si x est avant l'intervalle
            // borne max positive - écart
            value = dist - Math.abs(x - min) % dist; // calcul de l'écart à la borne modulo la taille de l'intervalle
        }
        else if (x <= max) { // si x est dans l'intervalle pas de soucis
            value = x - min;
        }
        else { // si x est après l'intervalle
            value = Math.abs(x - max) % dist; // calcul de l'écart à la borne modulo la taille de l'intervalle
        }
        
        const step = dist / variations.length;
        const index = Math.floor(value / step);
        if (variations[index].length === 1){
            return variations[index][0];
        }
        const normedValue = (value - index * step) / step;
        return variations[index][0] + (variations[index][1] - variations[index][0]) * normedValue;
    }
    return _gradient;
}

/**
 * Apply multiGradient to each color depending on the result of f(x, y)
 * @param {*} f 
 * @param {*} min 
 * @param {*} max 
 * @param {*} redVariations 
 * @param {*} greenVariations 
 * @param {*} blueVariations 
 * @param {*} alphaVariations 
 * @returns 
 */
function colorMap(options) {
    const gradient = multiGradient(options.min, options.max);
    function _colorMap(x, y) {
        let res = options.f(x, y);
        let red = gradient(res, options.redVariations);
        let green = gradient(res, options.greenVariations);
        let blue = gradient(res, options.blueVariations);
        let alpha = gradient(res, options.alphaVariations);
        return colorFunctions.createColor(red, green, blue, alpha);
    }
    return _colorMap;
}

/**
 * @typedef {Object} noiseDescriptor
 * @property {function} noise - Noise generator
 * @property {Object} noiseOptions - Set of parameters to configure the noise
 */

/**
 * @typedef {Object} fractalNoiseDescriptor
 * @property {function} fractal - Fractal Noise generator
 * @property {Object} fractalOptions - Set of parameters to configure the fractal noise
 */

/**
 * Generic Noise Generator (White, Perlin, Worley) & Fractal Generator (FBM, Turbulence & Ridged)
 * @param {(noiseDescriptor|fractalNoiseDescriptor)} options - Set of parameters to configure the noise
 * @returns {function} - Noise generator function according to given parameters
 */
function noiseGenerator(options) {
    const width = options.noiseOptions.width;
    const height = options.noiseOptions.height;
    if (typeof(width) !== "number" || typeof(height) !== "number")
        throw Error(`TypeError: Please provide valid width and height values.`);

    return options.noise(width, height, options.noiseOptions);
}

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
exports.colorMap = colorMap;
exports.noiseGen = noiseGenerator;