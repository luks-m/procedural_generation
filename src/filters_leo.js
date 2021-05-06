const helpers = require('./helpers.js');
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

function clear() {
    return functionsColor.examples.TRANSPARENT;
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
    const x_scale = options.width / size;
    const y_scale = options.height / size;
    return (x, y) => options.src((x * x_scale) % (size * x_scale), (y * y_scale) % (size * y_scale));
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

exports.mirror = mirror;
exports.composition = composition;
// exports.smooth = smooth;
exports.setOpacity = setOpacity;
exports.translate = translate;
exports.takeColor = takeColor;
exports.blackWhite = blackWhite;
exports.anaglyphe = anaglyphe;
exports.repeat = repeat;
