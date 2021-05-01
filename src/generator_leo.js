const helpers = require('./helpers.js');


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

exports.generator = generator;
