function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function imageGeneration(canvas, width = canvas.width, height = canvas.height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);
    canvas.width = width;
    canvas.height = height;
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
let canvas = document.getElementById('drawing_board');
imageGeneration(canvas, width, height, (x, y) => { return {red: getRandomInt(255), green: getRandomInt(255), blue: getRandomInt(255), alpha: getRandomInt(255)};});