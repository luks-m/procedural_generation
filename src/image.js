const helpers = require('./helpers.js');

const generators = require('./generators.js');
const generatorsLucas = require('./generators_lucas.js');

const filtersLucas = require('./filters_lucas.js');

function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            let pixelColor = getPixelColor(x, y);
            image.data[n] = pixelColor.red;
            image.data[n + 1] = pixelColor.green;
            image.data[n + 2] = pixelColor.blue;
            image.data[n + 3] = pixelColor.alpha;
        }
    }
    context.putImageData(image, 0, 0);
    return canvas;
}

function getImage(canvas, width, height) {

    let pixel;
    
    ///////////////////// Generators : /////////////////////

    // Checkerboard
    pixel = generatorsLucas.makeCheckerboard(width, height, 50,
							  helpers.getColor(255,0,0,255),
							  helpers.getColor(0,255,0,255));

    // Perlin Noise
    //pixel = generators.perlinNoiseGen(width, height);

    // Fractional Brownian Motion
    //pixel = generators.fractionalBrownianMotionGen(width, height, 8, undefined, undefined, 1);

    // Worley Noise
    //pixel = generators.worleyNoiseGen(width, height, true, true,undefined, 255, 255, 255);

    //Cellular Noise
    //pixel = generators.cellularNoiseGen(width, height, false, false,undefined, 255, 255, 255);

    
    ///////////////////// Filters : /////////////////////

    //Opacity Changer with value
    pixel = filtersLucas.opacityChanger(pixel, 100);

    canvas = imageGeneration(canvas, width, height, pixel);

    return canvas;
}

exports.getImage = getImage;
