const helpers = require('./helpers.js');
const geometric = require('./geometricPredicate.js');
const colorFunctions = require('./colors.js');

function solid(options) {
    const _options = {
        color: colorFunctions.examples.TRANSPARENT,
        ...options
    };
    return () => _options.color;
}

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


/////////////////////////////////////////////////////
/**
 * @todo : REFACTOR generator function usage
 */
/////////////////////////////////////////////////////
function generator(generators, size, color1, color2) {
    function getOtherColor(actualColor, color1, color2) {
        if (colorFunctions.compareColor(actualColor, color1)) {
            return color2;
        }
        return color1;
    }
    function getGenerators(x, y) {
        function getColor(acc, curr) {
            if (acc) {
                acc = colorFunctions.compareColor(color1, curr);
            }
            else {
                let new_color = getOtherColor(curr, color1, color2);
                acc = colorFunctions.compareColor(color1, new_color);
            }
            return acc;
        }
        let color = generators.map((f, i) => { let [x1, y1] = size[i](x, y); return f(x1, y1); });
        let bool = color.reduce((acc, curr) => getColor(acc, curr), true);
        if ((bool && colorFunctions.compareColor(color[color.length - 1], color1)) || (!bool && !colorFunctions.compareColor(color[color.length - 1], color1))) {
            return color[color.length - 1];
        }
        return getOtherColor(color[color.length - 1], color1, color2);
    }

    return getGenerators;
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
exports.generator = generator;
