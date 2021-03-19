const getColor = function (_red, _green, _blue, _alpha) {
    return {red : _red, green : _green, blue : _blue, alpha : _alpha};
}

const compareColor = function (color1, color2) {
    return (color1.red === color2.red
        && color1.green === color2.green
        && color1.blue === color2.blue
        && color2.alpha === color2.alpha);
}

exports.getColor = getColor;
exports.compareColor = compareColor;
