const helpers = require('./helpers.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let randGen = (x, y) => helpers.getColor(getRandomInt(255), getRandomInt(255), getRandomInt(255), getRandomInt(255));

//////////////////////////////////////////
////////////// PERLIN NOISE //////////////

function perlinNoiseGenerator(width, height, RESOLUTION = 8, COLOR_SCALE = 255, COLORED = false) {

    let gradients = { };

    let pixelSizeWidth = width / RESOLUTION;
    let pixelSizeHeight = height / RESOLUTION;

    // Create random direction vector
    function randomGradient() {
        let angle = (2 * Math.PI) * Math.random();
        return { x: Math.cos(angle), y: Math.sin(angle) }; // Polar coordinates, Norm = 1
    }


    function dotGridGradient(ix, iy, x, y) {
        // Get gradient from integer coordinate
        if (!gradients[[ ix, iy ]])
            gradients[[ ix, iy ]] = randomGradient();

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

    return (x, y) => {
        let v;
        if (COLORED) {
            v = (compute(x / pixelSizeWidth, y / pixelSizeHeight) + 0.5) * 360;
            [R, G, B] = helpers.hsl2rgb(v);
            return helpers.getColor(R, G, B, 255);
        }
        else {
            let v = (compute(x / pixelSizeWidth, y / pixelSizeHeight) + 1) / 2 * COLOR_SCALE;
            return helpers.getColor(v, v, v, v);
        }
    }
}

//////////////////////////////////////////

//////////////////////////////////////////
///////// FRACTAL BROWNIAN MOTION ////////

function fractalBrownianMotionGenerator(width, height, OCTAVES = 4, PERSISTANCE = 0.5, LACUNARITY = 2,
                                        RESOLUTION = 8, COLOR_SCALE = 255, COLORED = false) {

    let gradients = { };
    let computed = { };
    let noiseMap = { };
    let maxNoiseHeight = Number.MIN_VALUE;
    let minNoiseHeight = Number.MAX_VALUE;

    let pixelSizeWidth = width / RESOLUTION;
    let pixelSizeHeight = height / RESOLUTION;

    // Create random direction vector
    function randomGradient() {
        let angle = (2 * Math.PI) * Math.random();
        return { x: Math.cos(angle), y: Math.sin(angle) }; // Polar coordinates, Norm = 1
    }


    function dotGridGradient(ix, iy, x, y) {
        // Get gradient from integer coordinate
        if (!gradients[[ ix, iy ]])
            gradients[[ ix, iy ]] = randomGradient();

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


    function inverseLerp(w, a0, a1) {
        return (w - a0) / (a1 - a0);
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
        // Check if value has already been computed
        if ([ x, y ] in computed)
            return computed[[x, y]];

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
        computed[[ x, y ]] = value;

        return value;
    }

    function generateNoiseMap() {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {

                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;

                for (let i = 0; i < OCTAVES; i++) {
                    let sampleX = x / pixelSizeWidth * frequency;
                    let sampleY = y / pixelSizeHeight * frequency;
                    let perlinValue = compute(sampleX, sampleY);

                    noiseHeight += perlinValue * amplitude;

                    amplitude *= PERSISTANCE;
                    frequency *= LACUNARITY;
                }

                if (noiseHeight > maxNoiseHeight)
                    maxNoiseHeight = noiseHeight;
                else if (noiseHeight < minNoiseHeight)
                    minNoiseHeight = noiseHeight;

                noiseMap[[ x / pixelSizeWidth, y / pixelSizeHeight ]] = noiseHeight;

            }
        }
    }


    generateNoiseMap();


    return (x, y) => {
        let v = Math.floor(inverseLerp(noiseMap[[ x / pixelSizeWidth, y / pixelSizeHeight ]], minNoiseHeight, maxNoiseHeight) * COLOR_SCALE);
        if (COLORED) {
            [R, G, B] = helpers.hsl2rgb(v);
            return helpers.getColor(R, G, B, 255);
        }
        else {
            return helpers.getColor(v, v, v, v);
        }
    }
}

//////////////////////////////////////////

exports.randGen = randGen;
exports.perlinNoiseGen = perlinNoiseGenerator;
exports.fractionalBrownianMotionGen = fractalBrownianMotionGenerator;