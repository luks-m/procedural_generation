/**
 * Convert a value from one range to another
 * @param {number} n - The value to change
 * @param {number} min_old - Old lower bound of n
 * @param {number} max_old - Old upper bound of n
 * @param {number} min_new - New lower bound for n
 * @param {number} max_new - New upper bound for n
 * @returns {number} - The converted value
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
 * Random generator
 * @param seed - Generator seed
 * @returns {function()} - Function returning a value between -1 and 1
 */
function makeRandom(seed=101) {
    return () => (123456791 * Math.sin(seed * seed * seed++)) % 1;
}


exports.changeRange = changeRange;
exports.norm = norm;
exports.makeRandom = makeRandom;
