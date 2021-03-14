const fs = require('fs');
const { createCanvas, createImageData } = require('canvas');


let gradients = { };


// Create random direction vector
function randomGradient(ix, iy) {
    let angle = (2 * Math.PI) * Math.random();
    //let angle = 2920 * Math.sin(ix * 21942 + iy * 171324 + 8912) * Math.cos(ix * 23157 * iy * 217832 + 9758);
    return { x: Math.cos(angle), y: Math.sin(angle) }; // Polar coordinates, Norm = 1
}


function dotGridGradient(ix, iy, x, y) {
    // Get gradient from integer coordinate
    if (!gradients[[ ix, iy ]])
        gradients[[ ix, iy ]] = randomGradient(ix, iy);

    // Compute the distance vector
    let dx = x - ix;
    let dy = y - iy;

    // Compute the dot-product
    return (dx * gradients[[ ix, iy ]].x + dy * gradients[[ ix, iy ]].y);
}


// Use this for to linearly interpolate
function lerp(w) {
    return w;
}


// Use this cubic interpolation instead, for a smooth appearance
function smoothstep(w) {
    return (3 - w * 2) * w * w;
}


// Use for an even smoother result with a second derivative equal to zero on boundaries
function smootherstep(w) {
    return ((w * (w * 6 - 15) + 10) * w * w * w);
}


function interpolate(w, a0, a1) {
    return (a1 - a0) * smootherstep(w) + a0
}


// Compute Perlin noise at coordinates x, y
function compute(x, y) {
    // Determine grid cell coordinates
    let x0 = Math.floor(x);
    let x1 = x0 + 1;
    let y0 = Math.floor(y);
    let y1 = y0 + 1;

    // Determine interpolation weights
    let sx = x - x0;
    let sy = y - y0;

    // Interpolate between grid point gradients
    let n0 = dotGridGradient(x0, y0, x, y);
    let n1 = dotGridGradient(x1, y0, x, y);
    let ix0 = interpolate(sx, n0, n1);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    let ix1 = interpolate(sx, n0, n1);

    let value = interpolate(sy, ix0, ix1);

    return value;
}


function perlinNoiseGenerator(width, height, GRID_SIZE = 16, RESOLUTION = 128, COLOR_SCALE = 255, COLORED = false) {
    let canvas = createCanvas(width, height);
    let context = canvas.getContext("2d");

    let pixel_size_width = canvas.width / RESOLUTION;
    let pixel_size_height = canvas.height / RESOLUTION;

    for (let y = 0; y < GRID_SIZE; y += GRID_SIZE / RESOLUTION) {
        for (let x = 0; x < GRID_SIZE; x += GRID_SIZE / RESOLUTION) {
            let v;
            if (COLORED) {
                v = parseInt(compute(x, y) * COLOR_SCALE);
                context.fillStyle = 'hsl('+v+',50%,50%)';
            } else {
                v = parseInt((compute(x, y) + 1)/2 * COLOR_SCALE);
                context.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
            }
            context.fillRect(x * (canvas.width / GRID_SIZE), y * (canvas.height / GRID_SIZE), pixel_size_width, pixel_size_height);
        }
    }

    let buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`${COLORED ? "colored" : "B&W"} - ${width}x${height}x${RESOLUTION} - ${GRID_SIZE}.png`, buffer);
}

perlinNoiseGenerator(256, 256, 8, 256, 255, false);