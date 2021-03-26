const fs = require('fs');
const { createCanvas } = require('canvas');

const getImage = require('./image.js');


const width = 500, height = 500;
let canvas = createCanvas(width, height);

canvas = getImage.getImage(canvas, width, height);

let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./canvas.png', buffer);
