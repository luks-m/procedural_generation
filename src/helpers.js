
/**
 * @todo REMOVE ?
 */
const optionalParameter = function (parameter, defaultValue) {
    return typeof(parameter) !== 'undefined' ? parameter : defaultValue;
};

/**
 * Convert a value from one range to another
 * @param {*} n 
 * @param {*} min_old 
 * @param {*} max_old 
 * @param {*} min_new 
 * @param {*} max_new 
 * @returns 
 */
const changeRange = function (n, min_old, max_old, min_new, max_new) {
    if (n > max_old)
        return max_new;
    if (n < min_old)
        return min_new;
    return ((n - min_old) / (max_old - min_old)) * (max_new - min_new) + min_new;
};

/**
 * Return the euclidian distance between two points
 * @param {*} vec1 
 * @param {*} vec2 
 * @returns 
 */
function norm(vec1, vec2){
    return Math.sqrt((vec1[0] - vec2[0]) ** 2 + (vec1[1] - vec2[1]) ** 2);
}

/**
 * 
 * @param {*} seed 
 * @returns 
 */
function makeRandom(seed=101) {
    return () => (123456791 * Math.sin(seed * seed * seed++)) % 1;
}


exports.optionalParameter = optionalParameter;
exports.changeRange = changeRange;
exports.norm = norm;
exports.makeRandom = makeRandom;
