const helpers = require('./helpers.js');
const colors = require('./colors.js');

/*
 * A filter that fixes the opacity of an 'image' to 'opacity'
 */
function opacityChanger(options) {
    function opacityIntern(x, y) {
	return colors.createColor(options.image(x,y).red, options.image(x,y).green, options.image(x,y).blue, options.opacity);
    }
    return opacityIntern;
}

/*
 * Returns the scalar product of the vectors v1 and v2
 * 
 */
function scalarProduct(options) {
    return options.v1.reduce((acc, array, index) =>
		     [acc[0] + array.red*options.v2[index],
		      acc[1] + array.green*options.v2[index],
		      acc[2] + array.blue*options.v2[index],
		      acc[3] + array.alpha*options.v2[index]]
		     , [0,0,0,0]);		
}

/*
 * Returns the scalar product of two matrixes matrix1 and matrix2
 */
function convolution(options) {
    return options.matrix1.reduce((acc, line, index) =>
				  [acc[0] + scalarProduct({v1: line, v2:options.matrix2[index]})[0],
				   acc[1] + scalarProduct({v1: line, v2:options.matrix2[index]})[1],
				   acc[2] + scalarProduct({v1: line, v2:options.matrix2[index]})[2],
				   acc[3] + scalarProduct({v1: line, v2:options.matrix2[index]})[3]],
				   [0,0,0,0]);
				 }

/*
 * Returns the kernel with size kernelSize for Gaussian Blur
 */
function createKernel(options) {
    return [...Array(options.kernelSize)].map(
	(line, x) => [...Array(options.kernelSize)].map(
	    (value, y) => Math.exp(((x-(options.kernelSize-1)/2)**2 + (y-(options.kernelSize-1)/2)**2)/(-2*(options.sigma**2)))/(2*Math.PI*(options.sigma**2))));
}

/*
 * Copy the image around the pixel (x, y)
 * image : image to be copied
 * x,y : cooridnates of the pixel at the center
 * kernelSize : size of the copy around the pixel (x,y)
 */
function copyFunction(options) {
    return [...Array(options.kernelSize)].map(
	(line, i) => [...Array(options.kernelSize)].map(
	    (value, j) => options.image(options.x - options.kernelSize/2 + j, options.y - options.kernelSize/2 + i)));
}

/*
 * Returns the blurred image with Gaussian blur
 * options 
 *    image : image to be blurred
 *    width, height : dimension of the image
 *    kernel : kernel of Gaussian Blur
 *    kernelSize : dimension of the Gaussian kernel
 */
function gaussianBlur(options) {
    function blurIntern(x,y) {
	const results = convolution(
	    {
		matrix1 : copyFunction(
		    {
			image : options.image,
			x : x,
			y : y,
			kernelSize : options.kernelSize
		    }),
		matrix2 : options.kernel
	    });
	return colors.createColor(results[0], results[1], results[2], results[3]);
    }
    return blurIntern;
}
exports.opacityChanger = opacityChanger;
exports.gaussianBlur = gaussianBlur;
exports.createKernel = createKernel;
