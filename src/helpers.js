



const optionalParameter = function (parameter, defaultValue) {
    return typeof(parameter) !== 'undefined' ? parameter : defaultValue;
};

// Convert a value from one range to another
const changeRange = function (n, min_old, max_old, min_new, max_new) {
    if (n > max_old)
        return max_new;
    if (n < min_old)
        return min_new;
    return ((n - min_old) / (max_old - min_old)) * (max_new - min_new) + min_new;
};

// Return the euclidian distance between two points
function norm(vec1, vec2){
    return Math.sqrt((vec1[0] - vec2[0]) ** 2 + (vec1[1] - vec2[1]) ** 2);
}

function makeRandom(seed=101) {
    return () => (123456791 * Math.sin(seed * seed * seed++)) % 1;
}

function scalarProduct(arr1, arr2) {
    return arr1.map((value, index) => value * arr2[index]).reduce((result, value) => result + value, 0);
}

function multiply(A, B) {
    return A.map((x) => B.map((y) => scalarProduct(x, y)));
}



exports.optionalParameter = optionalParameter;
exports.changeRange = changeRange;
exports.norm = norm;
exports.makeRandom = makeRandom;
