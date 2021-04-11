const { createCanvas } = require('canvas');
const helpers = require('./helpers.js');

function canvasToMatrix(canvas,height,width) {

    let context = canvas.getContext("2d");
    let image = context.getImageData(0,0,height,width);
    let redMatrix = [];
    let greenMatrix = [];
    let blueMatrix = [];
    let opacityMatrix = [];

    let n = 0;
    for (let y = 0; y < height; y++) {
	redMatrix.push([]);
	blueMatrix.push([]);
	greenMatrix.push([]);
	opacityMatrix.push([]);
        for (let x = 0; x < width; x++, n += 4) {
            redMatrix[y].push(image.data[n]);
            greenMatrix[y].push(image.data[n + 1]);
            blueMatrix[y].push(image.data[n + 2]);
            opacityMatrix[y].push(image.data[n + 3]);
        }
    }

    return {red:redMatrix,green:greenMatrix,blue:blueMatrix,opacity:opacityMatrix};
}

function MatrixToCanvas(matrix,height,width) {

    let canvas = createCanvas(height,width);
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height)

    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            
            image.data[n] = matrix["red"][y][x];
            image.data[n + 1] = matrix["green"][y][x];
            image.data[n + 2] = matrix["blue"][y][x];
            image.data[n + 3] = matrix["opacity"][y][x];
        }
    }
  
    context.putImageData(image, 0, 0);
    return canvas;
}

function scalarProduct(arr1,arr2){

    if (arr1.length ===0 || arr2.length===0){
	return 0 ;
    }
    const somme = (accumulator , currentValue) => accumulator+currentValue;
    let indice = 0;
    function prod(x){
	let res = x*arr2[indice];
	indice+=1;
	return res;
    }
    return arr1.map(x => x=prod(x)).reduce(somme)  ;
}

function norm(A){
    return Math.sqrt(productScalar(A,A));
}



function multiply(A,B){
    let M = A.map((x) => B.map((y) => scalarProduct(x,y)));
    return M;
}


function reverseImg_old(image,axe,where){

    let length = image["red"].length;
    let width = image["red"][0].length;
    let redM ;
    let greenM;
    let blueM;
    let opacityM;

    
    
    redM = image["red"].map((x,i) => image["red"][image["red"].length-1-i].map((y) => y));
    greenM = image["green"].map((x,i) => image["green"][image["green"].length-1-i].map((y) => y));
    blueM = image["blue"].map((x,i) => image["blue"][image["blue"].length-1-i].map((y) => y));
    opacityM = image["opacity"].map((x,i) => image["opacity"][image["opacity"].length-1-i].map((y) => y));
    return {red:redM , green:greenM , blue:blueM , opacity:opacityM };
}


function reverseImg(generator,axe,height,width){

    if ( axe === "x"){
	return (x,y) => generator(width-x,y);
    }
    if ( axe === "y"){
	return (x,y) => generator(x,height-y);
    }
    if ( axe === "xy"){
	return (x,y) => generator(width-x,height-y);
    }
}

function Xor(generator1,generator2,color){

    function xor(x,y){

	if ( ! helpers.compareColor(generator1(x,y),color) && helpers.compareColor(generator2(x,y),color)){
	    return generator1(x,y);
	}
	else if ( helpers.compareColor(generator1(x,y),color) && !helpers.compareColor(generator2(x,y),color)){
	    return generator2(x,y);
	}
	return color;
    }
    return xor;
}

function Over(generator1,generator2,color){

    function over(x,y){

	if ( ! helpers.compareColor(generator1(x,y),color)){
	    return generator1(x,y);
	}
	return generator2(x,y);
    }
    return over;
}

function In(generator1,generator2,color){
    
    function inte(x,y){

	if ( ! helpers.compareColor(generator1(x,y),color) && ! helpers.compareColor(generator2(x,y),color)){
	    return generator1(x,y);
	}
	return color;
    }
    return inte;
}

function Out(generator1,generator2,color){
    
    function out(x,y){

	if ( ! helpers.compareColor(generator1(x,y),color) && helpers.compareColor(generator2(x,y),color)){
	    return generator1(x,y);
	}
	return color;
    }
    return out;
}

function Atop(generator1,generator2,color){
    
    function atop(x,y){

	if ( ! helpers.compareColor(generator1(x,y),color) && ! helpers.compareColor(generator2(x,y),color)){
	    return generator1(x,y);
	}
	else if (! helpers.compareColor(generator2(x,y),color)){
	    return generator2(x,y);
	}
	return color;
    }
    return atop;
}

function Operation(generator1,generator2,operation){

    if (operation==="Multiply"){
	function op(a,b){ return ((a/255)*(b/255)*255);};
    }
    else if (operation==="Screen"){
	function op(a,b){return (1-(1-a/255)*(1-b/255))*255;};
    }
    else if (operation==="SrcDivide"){
	function op(a,b){return ((((b+1)/(a+1))*255));};
    }
    else if (operation==="DstDivide"){
	function op(a,b){return ((((a+1)/(b+1))*255));};
    }
    else if (operation==="Add"){
	function op(a,b){return (a+b);};
    }
    else if (operation==="SrcMinus"){
	function op(a,b){if (a > b){ return 0;};return (b-a);};
    }
    else if (operation==="DstMinus"){
	function op(a,b){if (b > a){ return 0;} ; return (a-b);};
    }

    function Op(x,y){
	let red = op(generator1(x,y).red,generator2(x,y).red)
	let green = op(generator1(x,y).green,generator2(x,y).green)
	let blue = op(generator1(x,y).blue,generator2(x,y).blue)
	let alpha = op(generator1(x,y).alpha,generator2(x,y).alpha)
	return helpers.getColor(red,green,blue,alpha);
    }
    return Op;
}


function composition(generator1,generator2,operation,color){

    if (operation==="Src"){
	return generator1;
    }
    else if (operation==="Dst"){
	return generator2;
    }
    else if (operation==="Xor"){
	return Xor(generator1,generator2,color);
    }
    else if (operation==="Over"){
	return Over(generator1,generator2,color);
    }
    else if (operation==="In"){
	return In(generator1,generator2,color);
    }
    else if (operation==="Out"){
	return Out(generator1,generator2,color);
    }
    else if (operation==="Atop"){
	return Atop(generator1,generator2,color);
    }
    else if (operation==="DstOver"){
	return Over(generator2,generator1,color);
    }
    else if (operation==="DstIn"){
	return In(generator2,generator1,color);
    }
    else if (operation==="DstOut"){
	return Out(generator2,generator1,color);
    }
    else if (operation==="DstAtop"){
	return Atop(generator2,generator1,color);
    }
    else if (operation==="Multiply" || operation==="Screen" || operation==="SrcDivide" || operation==="DstDivide" || operation==="Add" || operation==="SrcMinus" || operation==="DstMinus"){
	return Operation(generator1,generator2,operation);
    }
    else {
	return (x,y) => color;
    }
}

    

function filters(filters){

    function getfilters(x,y){
	function getColor(acc,curr){
            acc = (x,y) => curr(acc(x,y));
            return acc;
	}
	let filter = filters.reduce((acc,curr) => getColor(acc,curr),(x,y)=>{return [x,y];})
	
	return filter(x,y);
	
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
	let x_r = Math.random()*width
	let y_r = Math.random()*height
	let theta = -1*3.14/2+Math.random()*2*3.14;
	let new_x = x_r*Math.cos(theta);
	let new_y = y_r*Math.sin(theta);
	let norm = Math.sqrt((x-new_x)**2+(y-new_y)**2);
	let color = helpers.getColor(norm,norm,norm,norm);
	let new_color = mul(generator(new_x,new_y),color);
	return helpers.getColor(Math.random()*generator(x,y).red,Math.random()*generator(x,y).green,Math.random()*generator(x,y).blue,255);
    }
    return Smooth;
}

exports.canvasToMatrix = canvasToMatrix;
exports.MatrixToCanvas = MatrixToCanvas;
exports.reverseImg = reverseImg;
exports.filters = filters;
exports.composition = composition;
exports.smooth = smooth
