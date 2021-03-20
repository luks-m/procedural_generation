const fs = require('fs');
const { createCanvas, createImageData } = require('canvas');
const helpers = require('./helpers.js');
const generators = require('./generators.js');
const generatorsLucas = require('./generators_lucas.js');

const filtersLucas = require('./filters_lucas.js');


function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = createImageData(width, height);

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


const width = 500, height = 500;

const checkerboard = generatorsLucas.makeCheckerboard(width, height, 50,
						       helpers.getColor(255,0,0,255),
						       helpers.getColor(0,255,0,255));

const opacityChanger = filtersLucas.opacityChanger;

//const perlin = generators.perlinNoiseGen(width, height)
const fbm = generators.fractionalBrownianMotionGen(width, height, 8, undefined, undefined, 1);


let canvas = createCanvas(width, height);
canvas = imageGeneration(canvas, width, height, fbm);
let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./canvas.png', buffer);
