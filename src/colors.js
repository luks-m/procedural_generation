/**
 * Return a dictionary containing the rgba values (<=255) representing a color
 * @param {number} _red Value of red
 * @param {number} _green Value of green
 * @param {number} _blue Value of blue
 * @param {number} _alpha Value of alpha
 * @returns {{red: number, green: number, blue: number, alpha: number}}
 */
const createColor = function (_red, _green, _blue, _alpha) {
    return { red: ~~(_red % 256), green: ~~(_green % 256), blue: ~~(_blue % 256), alpha: ~~(_alpha % 256) };
};

/**
 * Compare two colors
 * @param {{red: number, green: number, blue: number, alpha: number}} color2 Color to compare
 * @param {{red: number, green: number, blue: number, alpha: number}} color1 Color to compare
 * @returns true if it is the same colors, false else
 */
const compareColor = function (color1, color2) {
    return (color1.red === color2.red
        && color1.green === color2.green
        && color1.blue === color2.blue
        && color2.alpha === color2.alpha);
};

/**
 * Transform an HSL color number to a RGBA color dictionary
 * @param {number} hsl an HSL color number
 * @returns {{red: number, green: number, blue: number, alpha: number}} the RGBA color corresponding to hsl
 */
const hsl2rgb = function (hsl) {
    const L = 0.5;
    const S = 0.5;
    const C = (1 - Math.abs(2 * L - 1)) * S;
    const X = C * (1 - Math.abs(((hsl / 60) % 2) - 1));
    const m = L - C / 2;

    function _hsl2rgb() {
        if (0 <= hsl && hsl < 60)
            return [C, X, 0];
        if (60 <= hsl && hsl < 120)
            return [X, C, 0];
        if (120 <= hsl && hsl < 180)
            return [0, C, X];
        if (180 <= hsl && hsl < 240)
            return [0, X, C];
        if (240 <= hsl && hsl < 300)
            return [X, 0, C];
        return [C, 0, X];
    }

    const [Rp, Gp, Bp] = _hsl2rgb();

    return createColor((Rp + m) * 255, (Gp + m) * 255, (Bp + m) * 255, 255);
};

const examples = {
    BLACK: createColor(0,0,0,255),
    WHITE: createColor(255, 255, 255, 255),
    RED: createColor(255, 0, 0, 255),
    GREEN: createColor(0, 255, 0, 255),
    BLUE: createColor(0, 0, 255, 255),
    ORANGE: createColor(255, 165, 0, 255),
    YELLOW: createColor(255, 255, 0, 255),
    BEIGE: createColor(245, 245, 220, 255),
    BROWN: createColor(165, 42, 42, 255),
    PURPLE: createColor(238, 130, 238, 255),
    PINK: createColor(255, 192, 203, 255),
    GREY: createColor(128, 128, 128, 255),
    INDIGO: createColor(121, 28, 248, 255),
    VERDIGRI: createColor(149, 165, 149, 255),
    TRANSPARENT: createColor(0,0,0,0)
};

exports.examples = examples;
exports.createColor = createColor;
exports.compareColor = compareColor;
exports.hsl2rgb = hsl2rgb;
