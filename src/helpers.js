const getColor = function (_red, _green, _blue, _alpha) {
    return {red : _red%256, green : _green%256, blue : _blue%256, alpha : _alpha%256};
};

const hsl2rgb = function(_h) {
    let L = 0.5;
    let S = 0.5;
    let C = (1 - Math.abs(2 * L - 1)) * S;
    let X = C * (1 - Math.abs(((_h / 60) % 2) - 1));
    let m = L - C / 2;


    function _hsl2rgb(_h) {
        if (0 <= _h && _h < 60)
            return [C, X, 0];
        if (60 <= _h && _h < 120)
            return [X, C, 0];
        if (120 <= _h && _h < 180)
            return [0, C, X];
        if (180 <= _h && _h < 240)
            return [0, X, C];
        if (240 <= _h && _h < 300)
            return [X, 0, C];
        return [C, 0, X];
    }

    let [Rp, Gp, Bp] = _hsl2rgb(_h);

    return [(Rp + m) * 255, (Gp + m) * 255, (Bp + m) * 255];
};

const compareColor = function (color1, color2) {
    return (color1.red === color2.red
        && color1.green === color2.green
        && color1.blue === color2.blue
        && color2.alpha === color2.alpha);
};

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


exports.getColor = getColor;
exports.compareColor = compareColor;
exports.hsl2rgb = hsl2rgb;
exports.optionalParameter = optionalParameter;
exports.changeRange = changeRange;
exports.norm = norm;
exports.makeRandom = makeRandom;
