const helpers = require('./helpers.js');
const geometric = require('./geometricPredicate.js');
const genColor = require('./colors.js');

/**
 * 
 * @param {*} size 
 * @param {*} color1 
 * @param {*} color2 
 * @returns 
 */
function generatorRectangleTriangle(options) {
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
function generatorIsoscelesTriangle(options) {
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
function generatorEquilateralTriangle(options) {
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
function generatorZigzag(options) {
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
function generatorGrid(options) {
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
function generatorSquare(options) {
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
function generatorVichy(options) {
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
function generatorDoubleVichy(options) {
    function doubleVichy(x, y) {
        const baseColor = generatorSquare(options)(x, y);
        if (genColor.compareColor(baseColor, options.color1)) {
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
function generatorHourglass(options) {
    function hourglass(x, y) {
        if (y % options.size < options.size / 4 || y % options.size > (3 * options.size / 4)) {
            return generatorEquilateralTriangle(options)(x, y);
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
function generatorOctagonal(options) {
    const pred = [
        [geometric.predDiagBottomLeftTopRight, geometric.predTopLine, geometric.predDiagBottomRightTopLeft],
        [geometric.predLeftLine, geometric.predFalse, geometric.predRightLine],
        [geometric.predDiagBottomRightTopLeft, geometric.predBottomLine, geometric.predDiagBottomLeftTopRight]
    ];
    function octagonale(x, y) {
        const predOptions = { x: x % options.size, y: y % options.size, size: options.size / 3, width: options.width };
        const [index1, index2] = geometric.whichPart(predOptions);
        if (pred[index1][index2](predOptions)) {
            return options.color1;
        }
        return options.color2;
    }
    return octagonale;
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
function generatorGrandmaTexture(options) {
    const pred1 = generatorDoubleVichy({ size: options.size1, color1: options.color1, color2: options.color2 });
    const pred2 = generatorOctagonal({ size: options.size2, width: options.width, color1: options.color1, color2: options.color2 });


    function grandma(x, y) {
        if (genColor.compareColor(pred1(x, y), pred2(x, y))) {
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
function generatorBeePattern(options) {
    let size1 = 20;
    let size2 = 8.33;
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
function generatorVoronoi(options) {
    function voronoi(x, y) {
        let array = options.center.map((i) => { return helpers.norm(i, [x, y]); })
        let min = array.reduce((acc, val, index) => { return acc.value > val ? { value: val, index: index } : acc },
                              { value: array[0], index: 0 });
        return options.color[min.index];
    }
    return voronoi;
}

/**
 * @todo Refactor to erase for loop
 * @param {*} height 
 * @param {*} width 
 * @param {*} number 
 * @returns 
 */
function generatorVoronoiRandom(options) {
    
    let array = [];
    let color = [];
    for (let i = 0; i < options.number; i++) {
        array.push([Math.random() * options.width, Math.random() * options.height]);
        color.push(genColor.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255));
    }
    let optionVoronoi = {center:array,color:color};
    return generatorVoronoi(optionVoronoi);
}

/**
 * @todo Move to example of generator using voronoi ?
 * @todo Refactor to erase for loop
 * @param {*} height 
 * @param {*} width 
 * @param {*} size 
 * @returns 
 */
function generatorHexagonal(options) {
    let array = [];
    let color = [];
    for (let i = 0; i < 1.5 * Math.floor(options.height / options.size); i++) {
        for (let j = 0; j < 1.5 * Math.floor(options.width / options.size); j++) {
            if (geometric.isEven({x:i})) {
                array.push([-1 * options.size + j * options.size, i * options.size]);
            }
            else {
                array.push([-1 * 3 / 2 * options.size + j * options.size, i * options.size]);
            }
            color.push(genColor.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255));
        }
    }
    let optionVoronoi = {center:array,color:color};
    return generatorVoronoi(optionVoronoi);
}

/**
 * @todo refactor to use function and not for
 * @param {*} height 
 * @param {*} width 
 * @param {*} size 
 * @returns 
 */
function pentagone(options) {
    let array = [];
    let color = [];
    for (let i = 0; i < 3 * Math.floor(options.height / options.size); i++) {
        for (let j = 0; j < 3 * Math.floor(options.width / options.size); j++) {
            if (geometric.isEven({x:i})) {
                array.push([-1 * options.size + j * options.size + options.size / 3, i * options.size / 2]);
                array.push([-1 * options.size + j * options.size - options.size / 3, i * options.size / 2]);
                array.push([-1 * options.size + j * options.size, i * options.size / 2 - options.size / 4]);
                array.push([-1 * options.size + j * options.size, i * options.size / 2 + options.size / 4]);
            }
            else {
                array.push([-1 * 3 / 2 * options.size + j * options.size, i * options.size / 2 + options.size / 4]);
                array.push([-1 * 3 / 2 * options.size + j * options.size, i * options.size / 2 - options.size / 4]);
                array.push([-1 * 3 / 2 * options.size + j * options.size - options.size / 3, i * options.size / 2]);
                array.push([-1 * 3 / 2 * options.size + j * options.size + options.size / 3, i * options.size / 2]);

            }
            color.push(genColor.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255));
            color.push(genColor.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255));
            color.push(genColor.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255));
            color.push(genColor.createColor(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 255));
        }
    }
    let optionVoronoi = {center:array,color:color};
    return generatorVoronoi(optionVoronoi);
}


/////////////////////////////////////////////////////
/**
 * @todo : REFACTOR generator function usage
 */
/////////////////////////////////////////////////////
function generator(generators, size, color1, color2) {
    function getOtherColor(actualColor, color1, color2) {
        if (genColor.compareColor(actualColor, color1)) {
            return color2;
        }
        return color1;
    }
    function getGenerators(x, y) {
        function getColor(acc, curr) {
            if (acc) {
                acc = genColor.compareColor(color1, curr);
            }
            else {
                let new_color = getOtherColor(curr, color1, color2);
                acc = genColor.compareColor(color1, new_color);
            }
            return acc;
        }
        let color = generators.map((f, i) => { let [x1, y1] = size[i](x, y); return f(x1, y1); });
        let bool = color.reduce((acc, curr) => getColor(acc, curr), true);
        if ((bool && genColor.compareColor(color[color.length - 1], color1)) || (!bool && !genColor.compareColor(color[color.length - 1], color1))) {
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
exports.generatorOctagonal = generatorOctagonal;
exports.generatorZigzag = generatorZigzag;
exports.generatorGrandmaTexture = generatorGrandmaTexture;
exports.generatorBeePattern = generatorBeePattern;
exports.generatorVoronoi = generatorVoronoi;
exports.generatorVoronoiRandom = generatorVoronoiRandom;
exports.generatorHexagonal = generatorHexagonal;
exports.pentagone = pentagone;
exports.generator = generator;
