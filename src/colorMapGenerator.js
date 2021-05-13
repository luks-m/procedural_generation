const colorFunctions = require('./colors.js');
const examples = require('./colorMapExamples.js');
const predicate = require('./colorMapPredicate.js');

/**
 * @typedef {Object} Color
 * @property {number} red Value of red
 * @property {number} green Value of green
 * @property {number} blue Value of blue
 * @property {number} alpha Value of alpha
 */

/**
 * Generate a gradient function between two values 
 * @param {number} min - the beginning value of the gradient
 * @param {number} max - the end value of the gradient
 * @returns {function(number,[[number, ?number],...[number, ?number]]): number} the function computing the gradient
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
        if (variations[index].length === 1) {
            return variations[index][0];
        }
        const normedValue = (value - index * step) / step;
        return variations[index][0] + (variations[index][1] - variations[index][0]) * normedValue;
    }
    return _gradient;
}

/**
 * @typedef {Object} ColorMapOptions
 * @property {function(number,number): number} f - Noise function computing the noise of (x,y) point
 * @property {number} min - the beginning gradient value
 * @property {number} max - the end gradient value
 * @property {[[number, ?number],...[number, ?number]]} redVariations - variations of red color
 * @property {[[number, ?number],...[number, ?number]]} greenVariations - variations of green color
 * @property {[[number, ?number],...[number, ?number]]} blueVariations - variations of blue color
 * @property {[[number, ?number],...[number, ?number]]} alphaVariations - variations of transparency
 */

/**
 * Apply multiGradient to each color depending on the result of f(x, y)
 * @param {ColorMapOptions} options - the function parameters
 * @returns {function(number,number): Color} the color map function
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

exports.examples = examples;
exports.predicate = predicate;
exports.colorMap = colorMap;
