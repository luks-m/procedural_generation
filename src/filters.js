const functionsColor = require('./colors.js');

/**
 * @typedef {Object} Color
 * @property {number} red Value of red
 * @property {number} green Value of green
 * @property {number} blue Value of blue
 * @property {number} alpha Value of alpha
 */

/**
 * @typedef {Object} MirrorOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {string} axe - Axes to take to apply the mirror effect ("x", "y" or "xy")
 * @property {number} width - Width of the image
 * @property {number} height - Height of the image
 */

/**
 * Compute a mirror effect depending on x or/and y axes
 * @param {MirrorOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function mirror(options) {
    if (options.axe === "x")
        return (x, y) => options.src(options.width - x, y);
    if (options.axe === "y")
        return (x, y) => options.src(x, options.height - y);
    if (options.axe === "xy")
        return (x, y) => options.src(options.width - x, options.height - y);
    return (x, y) => options.src(x, y);
}

/**
 * @typedef {Object} CompositionOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {function(number,number): Color} dst - Function computing a color depending on a pixel coordinate
 */

/**
 * Compute a xor composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function xor(options) {
    function _xor(x, y) {
        const gen1Color = options.src(x, y);
        const gen2Color = options.dst(x, y);
        return functionsColor.createColor(
            gen1Color.red ^ gen2Color.red,
            gen1Color.green ^ gen2Color.green,
            gen1Color.blue ^ gen2Color.blue,
            Math.max(gen1Color.alpha, gen2Color.alpha)
            );
    }
    return _xor;
}

/**
 * Compute an over composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function over(options) {
    function _over(x, y) {
        const srcColor = options.src(x, y);
        const dstColor = options.dst(x, y);
        const coefAlphaOfSrc = srcColor.alpha / 255;
        const coefAlphaOfDst = (1 - coefAlphaOfSrc) * (dstColor.alpha/255);

        return functionsColor.createColor(
            coefAlphaOfSrc * srcColor.red + coefAlphaOfDst * dstColor.red,
            coefAlphaOfSrc * srcColor.green + coefAlphaOfDst * dstColor.green,
            coefAlphaOfSrc * srcColor.blue + coefAlphaOfDst * dstColor.blue,
            coefAlphaOfSrc * srcColor.alpha + coefAlphaOfDst * dstColor.alpha,
            );
    }
    return _over;
}

/**
 * Compute a src composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function inSrc(options) {
    function _inSrc(x, y) {
        const srcColor = options.src(x,y);
        const dstColor = options.dst(x,y);
        return functionsColor.createColor(
            srcColor.red,
            srcColor.green,
            srcColor.blue,
            dstColor.alpha
            );
    }
    return _inSrc;
}

/**
 * Compute an out composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function out(options) {
    function _out(x, y) {
        const srcColor = options.src(x, y);
        const dstColor = options.dst(x, y);
        return functionsColor.createColor(
            srcColor.red,
            srcColor.green,
            srcColor.blue,
            255 - dstColor.alpha
        );
    }
    return _out;
}

/**
 * Compute an atop composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function atop(options) {
    return over({src: inSrc(options), dst: options.dst});
}

/**
 * @typedef {Object} OperationOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {function(number,number): Color} dst - Function computing a color depending on a pixel coordinate
 * @property {function(number,number): Color} op - Function computing a color depending on a src and dst color point (R, G, B, or A)
 */

/**
 * Compute a composition of a source and destination image depending on a function op
 * @param {OperationOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function operation(options) {
    function _operation(x, y) {
        const srcColor = options.src(x,y);
        const dstColor = options.dst(x,y);
        return functionsColor.createColor(
            options.op(srcColor.red, dstColor.red),
            options.op(srcColor.green, dstColor.green),
            options.op(srcColor.blue, dstColor.blue),
            options.op(srcColor.alpha, dstColor.alpha),
            );
    }
    return _operation;
}

/**
 * Compute a multiply composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function multiply(options) {
    return operation({
        op: (a, b) => { return ((a / 255) * (b / 255) * 255); },
        src: options.src,
        dst: options.dst
    });
}

/**
 * Compute a screen composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function screen(options) {
    return operation({
        op: (a, b) => { return (1 - (1 - a / 255) * (1 - b / 255)) * 255; },
        src: options.src,
        dst: options.dst
    });
}

/**
 * Compute a divide composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function divide(options) {
    return operation({
        op: (a, b) => { return ((((b + 1) / (a + 1)) * 255)); },
        src: options.src,
        dst: options.dst
    });
}

/**
 * Compute an add composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function add(options) {
    return operation({
        op: (a, b) => { return (a + b); },
        src: options.src,
        dst: options.dst
    });
}

/**
 * Compute a minus composition of a source and destination image
 * @param {CompositionOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function minus(options) {
    return operation({
        op: (a, b) => { if (a > b) { return 0; } return (b - a); },
        src: options.src,
        dst: options.dst
    });
}

/**
 * @typedef {Object} ClearOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {function(number,number): Color} toClear - Function determining if a pixel has to be transparent or not (default is () => true)
 */

/**
 * Return a transparent color for a pixel coordinate depending on the truth value of toClear function,
 * the color of the src image else
 * @param {ClearOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function clear(options) {
    const _options = {
        toClear: () => true,
        ...options
    };
    return (x, y) => {
        if (_options.toClear(x, y))
            return functionsColor.examples.TRANSPARENT;
        return options.src(x,y);
    };
}

/**
 * Dictionary of every composition implemented
 */
const composition = { operation, multiply, screen, divide, add, minus, atop, out, inSrc, over, xor };

/**
 * @typedef {Object} BulgeOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {{width: number, height: number}} size - Size of the image (default = { width: 250, height: 250 })
 * @property {{x: number, y: number}} bulge - Relative coordinate of where the bulge will be (default : {x: 0.5, y: 0.5})
 * @property {number} coef - Coefficient of the bulge (default : 0) < 0 means implosion and > 0 explosion
 */

/**
 * Return a transparent color for a pixel coordinate depending on the truth value of toClear function,
 * the color of the src image else
 * @param {BulgeOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function bulge(options) {
    const _options = {
        size: {width: 250, height: 250},
        bulge: {x: 0.5, y: 0.5},
        coef: 0,
        ...options
    };
    const coef = _options.coef/2;
    function _bulge(x, y) {
        let xx = x;
        let yy = y;
        x /= _options.size.width;
        y /= _options.size.height;
        const bulgeX = x - _options.bulge.x;
        const bulgeY = y - _options.bulge.y;
        const r = ((bulgeX) ** 2 + (bulgeY) ** 2);
        let rn = 0;
        if (r !== 0)
            rn = r ** (coef);
        console.log("x :", xx, "y :", yy, "val :", _options.src((rn * (bulgeX) + _options.bulge.x) * _options.size.width, (rn * (bulgeY) + _options.bulge.y) * _options.size.height));
        return _options.src((rn * (bulgeX) + _options.bulge.x) * _options.size.width, (rn * (bulgeY) + _options.bulge.y) * _options.size.height);
    }
    return _bulge;
}

/**
 * @typedef {Object} OpacityOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {number} coef - Coefficient to apply to the current opacity value (default = 0)
 * @property {number} opacity - Constant to add to the current opacity (default : 0)
 */


/**
 * Set the opacity of a source image by:
 * - multiplying the current opacity by a coefficient
 * - adding a constant opacity value
 * The new opacity value is computed as: currentValue * coefficient + constantValue
 * @param {OpacityOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function setOpacity(options) {
    const _options = {
        coef: 0,
        opacity: 0,
        ...options
    };
    function opacity(x,y) {
        const srcColor = options.src(x, y);
        return functionsColor.createColor(
            srcColor.red,
            srcColor.green,
            srcColor.blue,
            srcColor.alpha * _options.coef + _options.opacity
            );
    }
    return opacity;
}

/**
 * @typedef {Object} TransformOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {{width: number, height: number}} size - Size of the image (default = { width: 250, height: 250 })
 * @property {{x: number, y: number}} offset - Offset to apply to translate the image (default = { x: 0, y: 0 })
 * @property {{x: number, y: number}} scale - Coefficient to apply in order to resize an image (default = { x: 1, y: 1 })
 * @property {number} angle - Angle in degree in order to rotate an image (default : 0)
 */

/**
 * Do one or more of the following transformation on a source image :
 * - Scaling
 * - Translating
 * - Rotating
 * @param {TransformOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function transform(options) {
    const _options = {
        size: {width: 250, height: 250},
        offset: {x: 0, y: 0},
        scale: {x: 1, y: 1},
        angle: 0,
        ...options
    };
    _options.angle = _options.angle * Math.PI / 180;
    const midX = _options.size.width / 2;
    const midY = _options.size.height / 2;
    const tX = (Math.cos(_options.angle) / _options.scale.x);
    const tY = (Math.sin(_options.angle) / _options.scale.y);
    const ttX = -(Math.sin(_options.angle) / _options.scale.x);
    const ttY = (Math.cos(_options.angle) / _options.scale.y);

    function _transform(x, y) {
        const x2 = x - midX;
        const y2 = y - midY;
        const newX = x2 * tX + y2 * ttX + _options.offset.x + midX;
        const newY = x2 * tY + y2 * ttY + _options.offset.y + midY;
        return _options.src(newX, newY);
    }
    return _transform;
}

/**
 * @typedef {Object} LimitOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {{min: number, max: number}} xlim - Boundary for the x axis of the src image (default = { min: 0, max: 250 })
 * @property {{min: number, max: number}} ylim - Boundary for the y axis of the src image (default = { min: 0, max: 250 })
 */

/**
 * Limit the computing a source image between (xmin, ymin) and (xmax, ymax)
 * return a transparent color if the coordinate are not in this interval
 * @param {LimitOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function limit(options) {
    const _options = {
        xlim: {min: 0, max: 250},
        ylim: {min: 0, max: 250},
        ...options
    };

    function _limit(x, y) {
        if (x >= _options.xlim.min && x <= _options.xlim.max && y >= _options.ylim.min && y <= _options.ylim.max)
            return _options.src(x, y);
        return functionsColor.examples.TRANSPARENT;
    }
    return _limit;
}

/**
 * @typedef {Object} PixelateOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {{x: number, y: number}} size - New size of the pixel on the image (default = { x: 1, y: 1 })
 */

/**
 * Pixelate an image
 * @param {PixelateOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function pixelate(options) {
    const _options = {
        size: {x: 1, y: 1},
        ...options
    };
    function _pixelate(x, y) {
        return _options.src(_options.size.x * Math.floor(x / _options.size.x), _options.size.y * Math.floor(y / _options.size.y));
    }
    return _pixelate;
}

/**
 * @typedef {Object} CommonOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 */

/**
 * Negative the colors of an image
 * @param {CommonOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function negative(options) {
    function _negative (x, y){
        const pixel = options.src(x, y);
        return functionsColor.createColor(255 - pixel.red, 255 - pixel.green, 255 - pixel.blue, pixel.alpha);
    }
    return _negative;
}

/**
 * @typedef {Object} ChangeRGBAOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {number|undefined} red - New red value to apply to the image (default = undefined, e.g no change)
 * @property {number|undefined} green - New green value to apply to the image (default = undefined, e.g no change)
 * @property {number|undefined} blue - New blue value to apply to the image (default = undefined, e.g no change)
 * @property {number|undefined} alpha - New alpha value to apply to the image (default = undefined, e.g no change)
 */

/**
 * Change one or more component of the rgba color of a source image
 * @param {ChangeRGBAOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function changeRGBAColor(options){
    const _options = {
        red: undefined,
        green: undefined,
        blue: undefined,
        alpha: undefined,
        ...options
    };
    function _changeRGBAColor(x, y) {
        const color = _options.src(x, y);
        const red = _options.red === undefined ? color.red : _options.red;
        const green = _options.green === undefined ? color.green : _options.green;
        const blue = _options.blue === undefined ? color.blue : _options.blue;
        const alpha = _options.alpha === undefined ? color.alpha : _options.alpha;
        return functionsColor.createColor(red, green, blue, alpha);
    }
    return _changeRGBAColor;
}

/**
 * Transform a source image to a black and white image
 * @param {CommonOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function blackWhite(options){
    function _blackWhite(x, y) {
        const color = options.src(x,y);
        const averageColor = (color.red + color.green + color.blue) / 3;
        return functionsColor.createColor(averageColor, averageColor, averageColor, color.alpha);
    }
    return _blackWhite;
}

/**
 * @typedef {Object} RepeatOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {number} width - Width of the image
 * @property {number} height - Height of the image
 * @property {{x: number, y: number}} size - Size of the image to repeat
 */

/**
 * Repeat an image multiples times depending on a width, height and size factor
 * @param {RepeatOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function repeat(options){
    const x_scale = options.width / options.size.x;
    const y_scale = options.height / options.size.y;
    return (x, y) => options.src((x * x_scale) % (options.size * x_scale), (y * y_scale) % (options.size * y_scale));
}

/**
 * @typedef {Object} AnaglypheOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {number} dx - Translation in x of the cyan and red mask (default = 0)
 * @property {number} dy - Translation in y of the cyan and red mask (default = 0)
 */

/**
 * Transform an image to an anaglyphe image (basic 3D image effect)
 * @param {AnaglypheOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function anaglyphe(options){
    const _options = {
        dx: 0,
        dy: 0,
        ...options
    };
    function _anaglyphe(x, y) {
        const srcColorRed = (x, y) => { return _options.src(x + _options.dx, y + _options.dy); };
        const srcColorCyan = (x, y) => { return _options.src(x - _options.dx, y - _options.dy); };
        
        const redImage = changeRGBAColor({ src: srcColorRed, green: 0, blue: 0 });
        const cyanImage = changeRGBAColor({ src: srcColorCyan, red: 0 });

        const alphaRed = setOpacity({src: redImage, coef: 0.5});
        const alphaCyan = setOpacity({src: cyanImage, coef: 0.5});
        
        return composition.add({src: alphaRed, dst: alphaCyan})(x, y);
    }
    return _anaglyphe;
}

/**
 * Returns the scalar product of the vectors v1 and v2
 * 
 * @param {object} v1 Array of pixels representing the image
 * @param {object} v2 Array of values representing the kernel
 */
function scalarProduct(options) {
    return options.v1.reduce((acc, array, index) =>
        [acc[0] + array.red * options.v2[index],
        acc[1] + array.green * options.v2[index],
        acc[2] + array.blue * options.v2[index],
        acc[3] + array.alpha * options.v2[index]]
        , [0, 0, 0, 0]);
}

/**
 * Returns the scalar product of two matrixes matrix1 and matrix2
 *
 * @param {object} matrix1 Matrix of pixels
 * @param {object} matrix2 Kernel of Gaussian Blur
 */
function convolution(options) {
    return options.matrix1.reduce((acc, line, index) =>
        [acc[0] + scalarProduct({ v1: line, v2: options.matrix2[index] })[0],
        acc[1] + scalarProduct({ v1: line, v2: options.matrix2[index] })[1],
        acc[2] + scalarProduct({ v1: line, v2: options.matrix2[index] })[2],
        acc[3] + scalarProduct({ v1: line, v2: options.matrix2[index] })[3]],
        [0, 0, 0, 0]);
}

/**
 * Returns the kernel with size kernelSize for Gaussian Blur
 *
 * @param {number} kernelSize
 * @param {number} sigma
 */
function createKernel(options) {
    if (options.kernelSize % 2 === 0)
        throw new Error("Error : even kernel size");
    else
        return [...Array(options.kernelSize)].map(
            (line, x) => [...Array(options.kernelSize)].map(
                (value, y) => Math.exp(((x - (options.kernelSize - 1) / 2) ** 2 + (y - (options.kernelSize - 1) / 2) ** 2) / (-2 * (options.sigma ** 2))) / (2 * Math.PI * (options.sigma ** 2))));
}

/**
 * Copy the image around the pixel (x, y)
 *
 * @param {function} image The image to be copied
 * @param {number} x The x cooridnate of the central pixel of the copy
 * @param {number} y The y coordinate of the central pixel of the copy
 * @param {number} kernelSize The size of the kernel around the central pixel
 */
function copyFunction(options) {
    return [...Array(options.kernelSize)].map(
        (line, i) => [...Array(options.kernelSize)].map(
            (value, j) => options.image(options.x - Math.floor(options.kernelSize / 2) + j, options.y - Math.floor(options.kernelSize / 2) + i)));
}

/**
 * @typedef {Object} GaussianBlurOptions
 * @property {function(number,number): Color} src - Function computing a color depending on a pixel coordinate
 * @property {[]} kernel The Gaussian Blur kernel
 * @property {number} kernelSize The size of the Gaussian kernel
 */

/**
 * Returns the blurred image with Gaussian blur
 * @param {GaussianBlurOptions} options Set of options to pass to this filter function
 * @returns {function(number,number): Color} Function computing a color depending on a pixel coordinate
 */
function gaussianBlur(options) {
    function blurIntern(x, y) {
        const results = convolution(
            {
                matrix1: copyFunction(
                    {
                        image: options.src,
                        x: x,
                        y: y,
                        kernelSize: options.kernelSize
                    }),
                matrix2: options.kernel
            });
        return functionsColor.createColor(results[0], results[1], results[2], results[3]);
    }
    return blurIntern;
}


exports.mirror = mirror;
exports.clear = clear;
exports.composition = composition;
exports.bulge = bulge;
exports.transform = transform;
exports.pixelate = pixelate;
exports.negative = negative;
exports.limit = limit;
exports.repeat = repeat;
exports.setOpacity = setOpacity;
exports.changeRGBAColor = changeRGBAColor;
exports.blackWhite = blackWhite;
exports.anaglyphe = anaglyphe;
exports.gaussianBlur = gaussianBlur;
exports.createKernel = createKernel;
