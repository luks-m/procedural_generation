const helpers = require('./helpers.js');

// A filter that fixes the opacity of an 'image' to 'opacity'
function opacityChanger(image, opacity) {
    function opacityIntern(x, y) {
	let colorPixel = image(x,y);
	colorPixel.alpha = opacity;
	return colorPixel;
    }
    return opacityIntern;
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
		line[j] = image(x - kernelSize/2 + i, y - kernelSize/2 + j);
		tab[i] = line;
	    }
	}
	return tab;
    }
    
    function blurIntern(x,y) {
	if (x > kernelSize/2 && x < width-kernelSize/2 &&
	    y > kernelSize && y < height-kernelSize/2) {
	    let copy = copyFunction(image, x, y);
	    let results = convolution(copy, kernel);
	   
	    return helpers.getColor(results[0], results[1], results[2], results[3]);
	}
	else
	    return image(x,y);
    }
    return blurIntern;
}

exports.opacityChanger = opacityChanger;
exports.gaussianBlur = gaussianBlur;
