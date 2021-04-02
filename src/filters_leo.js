const { createCanvas } = require('canvas');

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


function reverseImg(image,axe,where){

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

exports.canvasToMatrix = canvasToMatrix;
exports.MatrixToCanvas = MatrixToCanvas;
exports.reverseImg = reverseImg;
