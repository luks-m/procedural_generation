
/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
function wave(x, y) {
    return Math.sin(x + y ** 2) * Math.sqrt(x ** 2 + y ** 2) / (10);
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
function flag(x, y) {
    return Math.sin(x / 10 + y / 10) * (x ** 3) * (y ** 2);
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
function pic(x, y) {
    return Math.sin(x ** 2 + 3 * y ** 2) / (0.1 + Math.sqrt(x ** 2 + y ** 2)) + (x ** 2 + 5 * y ** 2) * Math.exp(1 - (x ** 2 + y ** 2)) / 2;
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function mandelbrotSet(max, limit) {
    function mandel(x, y) {
        function fixedPoint(res,i){
            const norm = Math.sqrt(res[0] ** 2 + res[1] ** 2);
            if ( norm < limit && i < max)
                return fixedPoint([x - res[1] ** 2 + res[0] ** 2, y + 2 * res[1] * res[0]], i+1);
            return norm;
        }
        return fixedPoint([0,0], 0);
    }
    return mandel;
}

/**
 * 
 * @param {*} max 
 * @param {*} limit 
 * @param {*} c
 * @returns 
 */
function julia(max, limit, c) {
    function mandel(x, y) {
        function fixedPoint(res, i) {
            const norm = Math.sqrt(res[0] ** 2 + res[1] ** 2);
            if (norm < limit && i < max)
                return fixedPoint([c[0] - res[1] ** 2 + res[0] ** 2, c[1] + 2 * res[1] * res[0]], i + 1);
            return norm;
        }
        return fixedPoint([x, y], 0);
    }
    return mandel;
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaSquare(max, limit) {
    return julia(max, limit, [0.3, 0.5]);
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaSpi(max, limit) {
    return julia(max, limit, [0.285, 0.01]);
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaPeak(max, limit) {
    return julia(max, limit, [-1.4107, 0.0099]);
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaElec(max, limit) {
    return julia(max, limit, [-0.038, 0.9754]);
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaCrown(max, limit) {
    return julia(max, limit, [-1.476, 0]);
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaBubble(max, limit) {
    return julia(max, limit, [-0.4, -0.6]);
}

/**
 * 
 * @param {*} max 
 * @returns 
 */
function juliaDragon(max, limit) {
    return julia(max, limit, [-0.8, 0.156]);
}

/**
 * 
 * @param {*} max 
 * @param {*} f 
 * @returns 
 */
function fractale(max, limit, f) {
    function mandelbrotIteration(x, y) {
        function fixedPoint(res, i) {
            const norm = Math.sqrt(res[0] ** 2 + res[1] ** 2);
            if (norm < limit && i < max)
                return fixedPoint(f(res), i + 1);
            return norm;
        }
        return fixedPoint([x, y], 0);
    }
    return mandelbrotIteration;
}

/**
 * 
 * @param {*} f 
 * @param {*} height 
 * @param {*} width 
 * @param {*} xmin 
 * @param {*} xmax 
 * @param {*} ymin 
 * @param {*} ymax 
 * @returns 
 */
function focused(f, height, width, xmin, xmax, ymin, ymax) {
    const rapport_x = (xmax - xmin) / width;
    const rapport_y = (ymax - ymin) / height;
    return (x, y) => f(xmin + x * rapport_x, ymin + y * rapport_y);
}


const juliaShapes = {
                        juliaSquare : juliaSquare,
                        juliaSpi    : juliaSpi,
                        juliaPeak   : juliaPeak,
                        juliaElec   : juliaElec,
                        juliaCrown  : juliaCrown,
                        juliaBubble : juliaBubble,
                        juliaDragon : juliaDragon
                    };

exports.flag = flag;
exports.pic = pic;
exports.wave = wave;
exports.mandelbrotSet = mandelbrotSet;
exports.julia = julia;
exports.juliaShapes = juliaShapes;
exports.fractale = fractale;
exports.focused = focused;
