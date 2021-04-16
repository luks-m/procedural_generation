const helpers = require('./helpers.js');

/**
 * 
 * @param {*} generator 
 * @param {*} axe 
 * @param {*} height 
 * @param {*} width 
 * @returns 
 */
function mirror(generator, axe, height, width) {
    if (axe === "x") {
        return (x, y) => generator(width - x, y);
    }
    if (axe === "y") {
        return (x, y) => generator(x, height - y);
    }
    if (axe === "xy") {
        return (x, y) => generator(width - x, height - y);
    }
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function Xor(generator1, generator2, color) {

    function xor(x, y) {

        if (!helpers.compareColor(generator1(x, y), color) && helpers.compareColor(generator2(x, y), color)) {
            return generator1(x, y);
        }
        else if (helpers.compareColor(generator1(x, y), color) && !helpers.compareColor(generator2(x, y), color)) {
            return generator2(x, y);
        }
        return color;
    }
    return xor;
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function Over(generator1, generator2, color) {

    function over(x, y) {

        if (!helpers.compareColor(generator1(x, y), color)) {
            return generator1(x, y);
        }
        return generator2(x, y);
    }
    return over;
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function In(generator1, generator2, color) {

    function inte(x, y) {

        if (!helpers.compareColor(generator1(x, y), color) && !helpers.compareColor(generator2(x, y), color)) {
            return generator1(x, y);
        }
        return color;
    }
    return inte;
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function Out(generator1, generator2, color) {

    function out(x, y) {

        if (!helpers.compareColor(generator1(x, y), color) && helpers.compareColor(generator2(x, y), color)) {
            return generator1(x, y);
        }
        return color;
    }
    return out;
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} color 
 * @returns 
 */
function Atop(generator1, generator2, color) {

    function atop(x, y) {

        if (!helpers.compareColor(generator1(x, y), color) && !helpers.compareColor(generator2(x, y), color)) {
            return generator1(x, y);
        }
        else if (!helpers.compareColor(generator2(x, y), color)) {
            return generator2(x, y);
        }
        return color;
    }
    return atop;
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} operation 
 * @returns 
 */
function Operation(generator1, generator2, operation) {

    if (operation === "Multiply") {
        function op(a, b) { return ((a / 255) * (b / 255) * 255); };
    }
    else if (operation === "Screen") {
        function op(a, b) { return (1 - (1 - a / 255) * (1 - b / 255)) * 255; };
    }
    else if (operation === "SrcDivide") {
        function op(a, b) { return ((((b + 1) / (a + 1)) * 255)); };
    }
    else if (operation === "DstDivide") {
        function op(a, b) { return ((((a + 1) / (b + 1)) * 255)); };
    }
    else if (operation === "Add") {
        function op(a, b) { return (a + b); };
    }
    else if (operation === "SrcMinus") {
        function op(a, b) { if (a > b) { return 0; }; return (b - a); };
    }
    else if (operation === "DstMinus") {
        function op(a, b) { if (b > a) { return 0; }; return (a - b); };
    }

    function Op(x, y) {
        let red = op(generator1(x, y).red, generator2(x, y).red)
        let green = op(generator1(x, y).green, generator2(x, y).green)
        let blue = op(generator1(x, y).blue, generator2(x, y).blue)
        let alpha = op(generator1(x, y).alpha, generator2(x, y).alpha)
        return helpers.getColor(red, green, blue, alpha);
    }
    return Op;
}

/**
 * 
 * @param {*} generator1 
 * @param {*} generator2 
 * @param {*} operation 
 * @param {*} color 
 * @returns 
 */
function composition(generator1, generator2, operation, color) {

    if (operation === "Src") {
        return generator1;
    }
    else if (operation === "Dst") {
        return generator2;
    }
    else if (operation === "Xor") {
        return Xor(generator1, generator2, color);
    }
    else if (operation === "Over") {
        return Over(generator1, generator2, color);
    }
    else if (operation === "In") {
        return In(generator1, generator2, color);
    }
    else if (operation === "Out") {
        return Out(generator1, generator2, color);
    }
    else if (operation === "Atop") {
        return Atop(generator1, generator2, color);
    }
    else if (operation === "DstOver") {
        return Over(generator2, generator1, color);
    }
    else if (operation === "DstIn") {
        return In(generator2, generator1, color);
    }
    else if (operation === "DstOut") {
        return Out(generator2, generator1, color);
    }
    else if (operation === "DstAtop") {
        return Atop(generator2, generator1, color);
    }
    else if (operation === "Multiply" || operation === "Screen" || operation === "SrcDivide" || operation === "DstDivide" || operation === "Add" || operation === "SrcMinus" || operation === "DstMinus") {
        return Operation(generator1, generator2, operation);
    }
    else {
        return (x, y) => color;
    }
}

/**
 * 
 * @param {*} filters 
 * @returns 
 */
// TODO : Rework filters in order to implement the link between multiple filter
function filters(filters) {
    function getfilters(x, y) {
        function getColor(acc, curr) {
            acc = (x, y) => curr(acc(x, y));
            return acc;
        }
        let filter = filters.reduce((acc, curr) => getColor(acc, curr), (x, y) => { return [x, y]; })

        return filter(x, y);
    }
    return getfilters;
}

function smooth(generator,height,width){

    
    function add(color1,color2){
	let red = color1.red+color2.red;
	let green = color1.green+color2.green;
	let blue = color1.blue+color2.blue;
	let alpha = color1.alpha//+color2.alpha;
	return helpers.getColor(red,green,blue,alpha);
    }
    function mul(color1,color2){
	let red = color1.red*color2.red;
	let green = color1.green*color2.green;
	let blue = color1.blue*color2.blue;
	let alpha = color1.alpha//*color2.alpha;
	return helpers.getColor(red,green,blue,alpha);
    }
    function Smooth(x,y){
	let r = Math.random();
	let x_r;
	let y_r;
	if (r < 0.5){
	    x_r = Math.random()+x;
	    y_r = y-Math.random();
	}
	else {
	    let theta = -3.14/2 + Math.random()*3.14*2;
	    x_r = x*Math.cos(theta)-y*Math.sin(theta);
	    y_r = x*Math.sin(theta)+y*Math.cos(theta);
	}
	let norm = Math.sqrt((x-x_r)**2+(y-y_r)**2);
	let color = helpers.getColor(1/norm,1/norm,1/norm,1/norm);
	let new_color = mul(generator(x_r,y_r),color);
	return new_color;//helpers.getColor(Math.random()*generator(x,y).red,Math.random()*generator(x,y).green,Math.random()*generator(x,y).blue,255);
    }
    return Smooth;
}

function setOpacity(generator,factor){

    function opacity(x,y){

	let red = generator(x,y).red;
	let green = generator(x,y).green;
	let blue = generator(x,y).blue;
	let alpha = generator(x,y).alpha * factor;

	return helpers.getColor(red,green,blue,alpha);
    }
    return opacity;
}
    
	
	

exports.canvasToMatrix = canvasToMatrix;
exports.MatrixToCanvas = MatrixToCanvas;
exports.reverseImg = reverseImg;
exports.mirror = mirror;
exports.filters = filters;
exports.composition = composition;
exports.smooth = smooth;
exports.smooth2 = smooth2;
exports.setOpacity = setOpacity;

