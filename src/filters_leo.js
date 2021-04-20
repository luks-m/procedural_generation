const helpers = require('./helpers.js');
const genColor = require('./colors.js');

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

        if (!genColor.compareColor(generator1(x, y), color) && genColor.compareColor(generator2(x, y), color)) {
            return generator1(x, y);
        }
        else if (genColor.compareColor(generator1(x, y), color) && !genColor.compareColor(generator2(x, y), color)) {
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

        if (!genColor.compareColor(generator1(x, y), color)) {
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

        if (!genColor.compareColor(generator1(x, y), color) && !genColor.compareColor(generator2(x, y), color)) {
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

        if (!genColor.compareColor(generator1(x, y), color) && genColor.compareColor(generator2(x, y), color)) {
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

        if (!genColor.compareColor(generator1(x, y), color) && !genColor.compareColor(generator2(x, y), color)) {
            return generator1(x, y);
        }
        else if (!genColor.compareColor(generator2(x, y), color)) {
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
        return genColor.createColor(red, green, blue, alpha);
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
	return genColor.createColor(red,green,blue,alpha);
    }
    function mul(color1,color2){
	let red = color1.red*color2.red;
	let green = color1.green*color2.green;
	let blue = color1.blue*color2.blue;
	let alpha = color1.alpha//*color2.alpha;
	return genColor.createColor(red,green,blue,alpha);
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
	let color = genColor.createColor(1/norm,1/norm,1/norm,1/norm);
	let new_color = mul(generator(x_r,y_r),color);
	return new_color;//genColor.createColor(Math.random()*generator(x,y).red,Math.random()*generator(x,y).green,Math.random()*generator(x,y).blue,255);
    }
    return Smooth;
}

function setOpacity(generator,factor){

    function opacity(x,y){

	let red = generator(x,y).red;
	let green = generator(x,y).green;
	let blue = generator(x,y).blue;
	let alpha = generator(x,y).alpha * factor;

	return genColor.createColor(red,green,blue,alpha);
    }
    return opacity;
}

function translate(options){

    return (x,y)=>options.generator(x+options.dx,y+options.dy);
}

function takeColor(options){

    let red = 0;
    let green = 0;
    let blue = 0;

    function takeColorGenerator(x,y){
	
	let color = options.generator(x,y);

	if (options.red){
	    red = color.red;
	}
	if (options.green){
	    green = color.green;
	}
	if (options.blue){
	    blue = color.blue;
	}
	return genColor.createColor(red,green,blue,255);
    }
    return takeColorGenerator;
}

function BlackWhite(options){

    let color = options.generator;

    function filterBW(x,y){

	let red = color(x,y).red;
	let green = color(x,y).green;
	let blue = color(x,y).blue;

	let value = (red+green+blue)/3

	return genColor.createColor(value,value,value,255);
    }
    return filterBW;
}

function repeat(options){

    let color = options.generator;
    let size = options.size;
    let x_scale = options.width/size;
    let y_scale = options.height/size;
    return (x,y)=>color((x*x_scale)%(size*x_scale),(y*y_scale)%(size*y_scale));
}
	
function anaglyphe(options){

    let origin = (x,y)=>{return options.generator(x,y)};
    let redImage = takeColor({generator:origin,red:true,green:false,blue:false});
    let cyanImage = takeColor({generator:origin,red:false,green:true,blue:true});
    let dxRedImage = translate({generator:redImage,dx:options.dx,dy:0});
    let dxCyanImage = translate({generator:cyanImage,dx:-options.dx,dy:0});
    let alphaRed = setOpacity(dxRedImage,0.5);
    let alphaCyan = setOpacity(dxCyanImage,0.5);
    let effect_3d = composition(alphaCyan,alphaRed,"Add");
    return effect_3d;
}

    
    
exports.mirror = mirror;
exports.filters = filters;
exports.composition = composition;
exports.smooth = smooth;
exports.setOpacity = setOpacity;
exports.translate = translate;
exports.takeColor = takeColor;
exports.BlackWhite = BlackWhite;
exports.anaglyphe = anaglyphe;
exports.repeat = repeat;
