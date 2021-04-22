const helpers = require('./helpers.js');
const colors = require('./colors.js');

// A filter that fixes the opacity of an 'image' to 'opacity'
function opacityChanger(image, opacity) {
    function opacityIntern(x, y) {
	let colorPixel = image(x,y);
	colorPixel.alpha = opacity;
	return colorPixel;
    }
    return opacityIntern;
}

// Returns the kernel with size kernelSize for Gaussian Blur
function createKernel(kernelSize, sigma) {
    let kernel = [];
    let sum = 0;
    for (let x = 0; x < kernelSize; x++) {
	let line = [];
	for (let y = 0; y < kernelSize; y++) {
	    line[y] = 1/(sigma**2 * 2 * Math.PI)*Math.exp(-0.5*((x-kernelSize/2)/sigma)**2 + ((y-kernelSize/2)/sigma)**2);
	    sum += line[y]
	}
	    kernel[x] = line;
    }
    for (let x = 0; x < kernelSize; x++) {
	for (let y = 0; y < kernelSize; y++) {
	    kernel[x][y] /= sum
	}
    }
    return kernel;
}

// Returns the blurred image with Gaussian blur
function gaussianBlur(image, width, height, kernel, kernelSize) {
    //function isAccessible(x,y) {
    //return x > 0 && y > 0 && x < width && y < height;
    //}

    function scalarProduct(v1, v2) {
	return v1.reduce((acc, array, index) =>
	    [acc[0] + array.red*v2[index],
	     acc[1] + array.green*v2[index],
	     acc[2] + array.blue*v2[index],
	     acc[3] + array.alpha*v2[index]]
	    , [0,0,0,0]);		
    }
    
    function convolution(matrix1, matrix2) {
	return matrix1.reduce((acc, line, index) =>
			      [acc[0] + scalarProduct(line, matrix2[index])[0],
			       acc[1] + scalarProduct(line, matrix2[index])[1],
			       acc[2] + scalarProduct(line, matrix2[index])[2],
			       acc[3] + scalarProduct(line, matrix2[index])[3]],
			      [0,0,0,0]);
    }
    
    function copyFunction(image, x, y) {
	let tab = [];
	for (let i = 0; i < kernelSize; i++) {
	    let line = [];
	    for (let j = 0; j < kernelSize; j++) {
		line[j] = image(x - kernelSize/2 + j, y - kernelSize/2 + i);
		tab[i] = line;
	    }
	}
	return tab;
    }
    
    function blurIntern(x,y) {
	if (x > kernelSize/2 && x < width-kernelSize/2 &&
	    y > kernelSize/2 && y < height-kernelSize/2) {
	    let copy = copyFunction(image, x, y);
	    let results = convolution(copy, kernel);
	   
	    return colors.createColor(results[0], results[1], results[2], results[3]);
	}
	else
	    return image(x,y);
    }
    return blurIntern;
}

exports.opacityChanger = opacityChanger;
exports.gaussianBlur = gaussianBlur;
exports.createKernel = createKernel;
