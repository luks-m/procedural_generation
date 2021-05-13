
/**
 * An example of 2-variable noise function which produces an effect of wave
 * @param {number} x - first variable value
 * @param {number} y - second variable value
 * @returns {number} the noise value
 */
function wave(x, y) {
    return Math.sin(x + y ** 2) * Math.sqrt(x ** 2 + y ** 2) / (10);
}

/**
 * An example of 2-variable noise function which produces an effect of splash
 * @param {number} x - first variable value
 * @param {number} y - second variable value
 * @returns {number} the noise value
 */
function splash(x, y) {
    return Math.sin(x / 10 + y / 10) * (x ** 3) * (y ** 2);
}

/**
 * An example of 2-variable noise function which produces an effect a hole and a pic around the (0,0) coordinate
 * @param {number} x - first variable value
 * @param {number} y - second variable value
 * @returns {number} the noise value
 */
function pic(x, y) {
    return Math.sin(x ** 2 + 3 * y ** 2) / (0.1 + Math.sqrt(x ** 2 + y ** 2)) + (x ** 2 + 5 * y ** 2) * Math.exp(1 - (x ** 2 + y ** 2)) / 2;
}

/**
 * Returns the fractale noise function of the MandelBrot set
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
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
 * Returns the fractale noise function of the Julia set
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @param {[number,number]} c - the initiale complex number of the recurrence sequence
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
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
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaSquare(max, limit) {
    return julia(max, limit, [0.3, 0.5]);
}

/**
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaSpi(max, limit) {
    return julia(max, limit, [0.285, 0.01]);
}

/**
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaPeak(max, limit) {
    return julia(max, limit, [-1.4107, 0.0099]);
}

/**
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaElec(max, limit) {
    return julia(max, limit, [-0.038, 0.9754]);
}

/**
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaCrown(max, limit) {
    return julia(max, limit, [-1.476, 0]);
}

/**
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaBubble(max, limit) {
    return julia(max, limit, [-0.4, -0.6]);
}

/**
 * Returns the fractale noise function of a specific Julia figure
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
 */
function juliaDragon(max, limit) {
    return julia(max, limit, [-0.8, 0.156]);
}

/**
 * Returns the fractale noise of a complex function
 * @param {number} max - number of recursive calculation
 * @param {number} limit - the complex number modulus frontier
 * @param {function([number,number]): [number,number]} f - a complex function
 * @returns {function(number,number): number} function which return the noise value for the (x,y) coordinate
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
 * Zoom on a part of a 2D-variable noise function
 * @param {function(number,number): number} f - the 2D-variable noise function
 * @param {number} height - the image height
 * @param {number} width - the image width
 * @param {number} xmin - the x minimum axis for the zoom
 * @param {number} xmax - the x maximum axis for the zoom
 * @param {number} ymin - the y minimum axis for the zoom 
 * @param {number} ymax - the y maximum axis for the zoom 
 * @returns {function(number,number): number} the 2D-variable noise function zoomed
 */
function focused(f, height, width, xmin, xmax, ymin, ymax) {
    const rapport_x = (xmax - xmin) / width;
    const rapport_y = (ymax - ymin) / height;
    return (x, y) => f(xmin + x * rapport_x, ymin + y * rapport_y);
}

/**
 * The dictionnary of specific Julia set noise functions 
*/
const juliaShapes = {
                        juliaSquare : juliaSquare,
                        juliaSpi    : juliaSpi,
                        juliaPeak   : juliaPeak,
                        juliaElec   : juliaElec,
                        juliaCrown  : juliaCrown,
                        juliaBubble : juliaBubble,
                        juliaDragon : juliaDragon
                    };

exports.splash = splash;
exports.pic = pic;
exports.wave = wave;
exports.mandelbrotSet = mandelbrotSet;
exports.julia = julia;
exports.juliaShapes = juliaShapes;
exports.fractale = fractale;
exports.focused = focused;
