const fs = require('fs');
const { createCanvas, createImageData } = require('canvas');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const width = 350, height = 250;
let canvas = createCanvas(width, height);
let context = canvas.getContext('2d');
let image = createImageData(width, height);
let n = 0; // Index inside the image array
for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++, n += 4) {
        image.data[n]   = getRandomInt(256);
        image.data[n+1] = getRandomInt(256);
        image.data[n+2] = getRandomInt(256);
        image.data[n+3] = 255;
    }
}
context.putImageData(image, 0, 0);
let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('test.png', buffer);

function regular_generator(width,height,color){
    let canvas = createCanvas(width, height);
    let context = canvas.getContext('2d');
    let image = createImageData(width, height);
    let n = 0; // Index inside the image array
    for (let y = 0; y < canvas.height; y++) {
	for (let x = 0; x < canvas.width; x++, n += 4) {
            image.data[n]   = color[0];
            image.data[n+1] = color[1];
            image.data[n+2] = color[2];
            image.data[n+3] = color[3];
	}
    }
    context.putImageData(image, 0, 0);
    let buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('test.png', buffer);
}
    
