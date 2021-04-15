const helpers = require('./helpers.js');
const geometric = require('./geometricPredicate.js');

/**
 * 
 * @param {*} size 
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
 */
function generatorRectangleTriangle(options) {//size, color1, color2) {
    function rectangleTriangle(x, y) {
        if (x % options.size < y % options.size) {
            return color1;
        }
        return color2;
    }
    return rectangleTriangle;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorIsoscelesTriangle(options) {//size, color_1, color_2) {
    function isoscelesTriangle(x, y) {
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
    return isoscelesTriangle;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorEquilateralTriangle(options) {//size, color_1, color_2) {
    function equilateralTriangle(x, y) {
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
    return equilateralTriangle;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorZigzag(options) {//size, color_1, color_2) {
    function zigzag(x, y) {
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
    return zigzag;
}

/**
 * @todo rename quadrillage
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorGrid(options) {//size, color_1, color_2) {
    function grid(x, y) {
        if (geometric.sameParity({ x: x / options.size, y: y / options.size })) {
            return options.color1;
        }
        return options.color2;
    }

    return grid;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorSquare(options) {//size, color_1, color_2) {
    function square(x, y) {
        if (geometric.sameParity({ x: (x - x % options.size) / options.size, y: (y - y % options.size) / options.size })) {
            return options.color1;
        }
        return options.color2;
    }
    return square;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorVichy(options) {//size, color_1, color_2) {
    function vichy(x, y) {
        if (geometric.sameParity({ x: x % options.size, y: y % options.size })) {
            return options.color1;
        }
        return options.color2;
    }
    return vichy;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorDoubleVichy(options) {//size, color_1, color_2) {
    function doubleVichy(x, y) {
        const baseColor = generatorSquare(options)(x, y);//size, color_1, color_2)(x, y);
        //options.size = options.size / 2;
        if (helpers.compareColor(baseColor, options.color1)) {
            return generatorVichy({ size: options.size / 2, color1: options.color2, color2: options.color1 })(x, y);
        }
        return generatorVichy({ size: options.size / 2, color1: options.color2, color2: options.color1 })(x, y);
    }
    return doubleVichy;
}

/**
 * 
 * @param {*} size 
 * @param {*} color_1 
 * @param {*} color_2 
 * @returns 
 */
function generatorHourglass(options) {//size, color_1, color_2) {
    function hourglass(x, y) {
        if (y % options.size < options.size / 4 || y % options.size > (3 * options.size / 4)) {
            return generatorEquilateralTriangle(options)(x, y);//size, color_1, color_2)(x, y);
        }
        return options.color1;
    }
    return hourglass;
}

/**
 * 
 * @param {*} size 
 * @param {*} width 
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
 */
function generatorHexagonal(options) {//size, width, color1, color2) {
    const pred = [
        [geometric.predDiagBottomLeftTopRight, geometric.predTopLine, geometric.predDiagBottomRightTopLeft],
        [geometric.predLeftLine, geometric.predFalse, geometric.predRightLine],
        [geometric.predDiagBottomRightTopLeft, geometric.predBottomLine, geometric.predDiagBottomLeftTopRight]
    ];
    function hexagonale(x, y) {
        const predOptions = { x: x % options.size, y: y % options.size, size: options.size / 3, width: options.width };
        const [index1, index2] = geometric.whichPart(predOptions);
        if (pred[index1][index2](predOptions)) {
            return options.color1;
        }
        return options.color2;
    }
    return hexagonale;
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
function generatorGrandmaTexture(options) {//size1, size2, width, color1, color2
    const pred1 = generatorDoubleVichy({ size: options.size1, color1: options.color1, color2: options.color2 });
    const pred2 = generatorHexagonal({ size: options.size2, width: options.width, color1: options.color1, color2: options.color2 });


    function grandma(x, y) {
        if (helpers.compareColor(pred1(x, y), pred2(x, y))) {
            return options.color1;
        }
        return options.color2;
    }
    return grandma;
}

/**
 * @todo Move to a file wich contains example of predeterminated generator ?
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
 */
function generatorBeePattern(options) {//color1, color2) {
    let size1 = 20;
    let size2 = 50 / 6;
    const pred = generatorGrandmaTexture({ size1: size1, size2: size2, width: 1, color1: options.color1, color2: options.color2 });
    const f = (x, y) => { return [x % size1, y % size1]; };
    return generator([pred], [f], options.color1, options.color2);
}

/**
 * 
 * @param {*} center 
 * @param {*} color 
 * @returns 
 */
function generatorVoronoi(center, color) {
    function norm(vec1, vec2) {
        return Math.sqrt((vec1[0] - vec2[0]) ** 2 + (vec1[1] - vec2[1]) ** 2);
    }
    function voronoi(x, y) {
        let array = center.map((i) => { return norm(i, [x, y]); })
        let min = array.reduce((acc, val, index) => { return acc.value > val ? { value: val, index: index } : acc }, { value: array[0], index: 0 });
        return color[min.index];
    }
    return voronoi;
}



/////////////////////////////////////////////////////
/**
 * @todo : REFACTOR generator function usage
 */
/////////////////////////////////////////////////////
function generator(generators, size, color1, color2) {
    function getOtherColor(actualColor, color1, color2) {
        if (helpers.compareColor(actualColor, color1)) {
            return color2;
        }
        return color1;
    }
    function getGenerators(x, y) {
        function getColor(acc, curr) {
            if (acc) {
                acc = helpers.compareColor(color1, curr);
            }
            else {
                let new_color = getOtherColor(curr, color1, color2);
                acc = helpers.compareColor(color1, new_color);
            }
            return acc;
        }
        let color = generators.map((f, i) => { let [x1, y1] = size[i](x, y); return f(x1, y1); });
        let bool = color.reduce((acc, curr) => getColor(acc, curr), true);
        if ((bool && helpers.compareColor(color[color.length - 1], color1)) || (!bool && !helpers.compareColor(color[color.length - 1], color1))) {
            return color[color.length - 1];
        }
        return getOtherColor(color[color.length - 1], color1, color2);
    }

    return getGenerators;
}


exports.generatorRectangleTriangle = generatorRectangleTriangle;
exports.generatorIsoscelesTriangle = generatorIsoscelesTriangle;
exports.generatorEquilateralTriangle = generatorEquilateralTriangle;
exports.generatorGrid = generatorGrid;
exports.generatorSquare = generatorSquare;
exports.generatorDoubleVichy = generatorDoubleVichy;
exports.generatorHourglass = generatorHourglass;
exports.generatorHexagonal = generatorHexagonal;
exports.generatorZigzag = generatorZigzag;
exports.generatorGrandmaTexture = generatorGrandmaTexture;
exports.generatorBeePattern = generatorBeePattern;
exports.generatorVoronoi = generatorVoronoi;
exports.generator = generator;
