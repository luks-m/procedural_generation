const getImage = require('./image.js');


const width = 500, height = 500;
let canvas = document.getElementById("drawing_board");


canvas.width = width;
canvas.height = height;

canvas = getImage.getImage(canvas, width, height);
