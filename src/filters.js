const functionsColor = require('./colors.js');

/**
 * 
 * @param {*} generator 
 * @param {*} axe 
 * @param {*} height 
 * @param {*} width 
 * @returns 
 */
function mirror(options) {
    if (options.axe === "x")
        return (x, y) => options.generator(options.width-1 - x, y);
    if (options.axe === "y")
        return (x, y) => options.generator(x, options.height-1 - y);
    if (options.axe === "xy")
        return (x, y) => options.generator(options.width - 1 - x, options.height-1 - y);
    return (x, y) => options.generator(x, y);
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function xor(options) {
    function _xor(x, y) {
        const gen1Color = options.src(x, y);
        const gen2Color = options.dst(x, y);
        return functionsColor.createColor(
            gen1Color.red ^ gen2Color.red,
            gen1Color.green ^ gen2Color.green,
            gen1Color.blue ^ gen2Color.blue,
            255
            );
    }
    return _xor;
}

/**
 * 
 * @param {*} src : generator1 
 * @param {*} dst : generator2 
 * @returns 
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
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
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
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
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
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function atop(options) {
    return over({src: inSrc(options), dst: options.dst});
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} operation 
 * @returns 
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

function multiply(options) {
    return operation({
        op: (a, b) => { return ((a / 255) * (b / 255) * 255); },
        src: options.src,
        dst: options.dst
    });
}

function screen(options) {
    return operation({
        op: (a, b) => { return (1 - (1 - a / 255) * (1 - b / 255)) * 255; },
        src: options.src,
        dst: options.dst
    });
}

function divide(options) {
    return operation({
        op: (a, b) => { return ((((b + 1) / (a + 1)) * 255)); },
        src: options.src,
        dst: options.dst
    });
}

function add(options) {
    return operation({
        op: (a, b) => { return (a + b); },
        src: options.src,
        dst: options.dst
    });
}

function minus(options) {
    return operation({
        op: (a, b) => { if (a > b) { return 0; } return (b - a); },
        src: options.src,
        dst: options.dst
    });
}

function clear(options) {
    return (x, y) => {
        if (options.toClear(x, y))
            return functionsColor.examples.TRANSPARENT;
        return options.src(x,y);
    };
}

const composition = { operation, multiply, screen, divide, add, minus, atop, out, inSrc, over, xor, clear };

/* TODO : erase repetition effect
function smooth(generator,height,width){
    function Smooth(x,y){
        let r = Math.random();
        let x_r;
        let y_r;
        if (r < 0.5) {
            x_r = Math.random() + x;
            y_r = y - Math.random();
        }
        else {
            let theta = -3.14 / 2 + Math.random() * 3.14 * 2;
            x_r = x * Math.cos(theta) - y * Math.sin(theta);
            y_r = x * Math.sin(theta) + y * Math.cos(theta);
        }
        let norm = Math.sqrt((x - x_r) ** 2 + (y - y_r) ** 2);
        let color = functionsColor.createColor(1 / norm, 1 / norm, 1 / norm, 1 / norm);
        let new_color = mul(generator(x_r, y_r), color);
        return new_color;//functionsColor.createColor(Math.random()*generator(x,y).red,Math.random()*generator(x,y).green,Math.random()*generator(x,y).blue,255);
    }
    return Smooth;
}
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

function translate(options){
    return (x,y) => options.src(x + options.dx, y + options.dy);
}

function takeColor(options){
    function _takeColor(x, y) {
        const color = options.src(x, y);
        const red = options.takeRed ? color.red : 0;
        const green = options.takeGreen ? color.green : 0;
        const blue = options.takeBlue ? color.blue : 0;
        return functionsColor.createColor(red, green, blue, color.alpha);
    }
    return _takeColor;
}

function blackWhite(options){
    function _blackWhite(x, y) {
        const color = options.src(x,y);
        const averageColor = (color.red + color.green + color.blue) / 3;
        return functionsColor.createColor(averageColor, averageColor, averageColor, color.alpha);
    }
    return _blackWhite;
}

function repeat(options){
    const x_scale = options.width / options.size;
    const y_scale = options.height / options.size;
    return (x, y) => options.src((x * x_scale) % (options.size * x_scale), (y * y_scale) % (options.size * y_scale));
}
	
function anaglyphe(options){
    function _anaglyphe(x, y) {
        const srcColorRed = (x, y) => { return options.src(x + options.dx, y + options.dy); };
        const srcColorCyan = (x, y) => { return options.src(x - options.dx, y - options.dy); };
        
        const redImage = takeColor({ src: srcColorRed, takeRed: true, takeGreen: false, takeBlue: false });
        const cyanImage = takeColor({ src: srcColorCyan, takeRed: false, takeGreen: true, takeBlue: true });

        const alphaRed = setOpacity({src: redImage, coef: 0.5});
        const alphaCyan = setOpacity({src: cyanImage, coef: 0.5});
        
        return composition.add({src: alphaRed, dst: alphaCyan})(x, y);
    }
    return _anaglyphe;
}

/**
 * Returns the scalar product of the vectors v1 and v2
 * 
 * @param {object} v1
 * @param {object} v2
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
 * @param {object} matrix1
 * @param {object} matrix2 
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
            (value, j) => options.image(options.x - options.kernelSize / 2 + j, options.y - options.kernelSize / 2 + i)));
}

/**
 * Returns the blurred image with Gaussian blur
 *
 * @param {function} image The image to be blurred
 * @param {object} kernel The Gaussian Blur kernel
 * @param {number} kernelSize The size of the Gaussian kernel
 */
function gaussianBlur(options) {
    function blurIntern(x, y) {
        const results = convolution(
            {
                matrix1: copyFunction(
                    {
                        image: options.image,
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
exports.composition = composition;
// exports.smooth = smooth;
exports.setOpacity = setOpacity;
exports.translate = translate;
exports.takeColor = takeColor;
exports.blackWhite = blackWhite;
exports.anaglyphe = anaglyphe;
exports.repeat = repeat;
exports.gaussianBlur = gaussianBlur;
exports.createKernel = createKernel;
