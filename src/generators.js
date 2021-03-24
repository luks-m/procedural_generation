const helpers = require('./helpers.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let randGen = (x, y) => helpers.getColor(getRandomInt(255), getRandomInt(255), getRandomInt(255), getRandomInt(255));


//////////////////////////////////////////
////////////// PERLIN NOISE //////////////


function perlinNoiseGenerator(width, height, RESOLUTION, COLOR_SCALE, COLORED) {

    RESOLUTION  =   helpers.optionalParameter(RESOLUTION, 8);
    COLOR_SCALE =   helpers.optionalParameter(COLOR_SCALE, 255);
    COLORED     =   helpers.optionalParameter(COLORED, false);

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


function fractalBrownianMotionGenerator(width, height,
                                        OCTAVES, PERSISTANCE, LACUNARITY, RESOLUTION, COLOR_SCALE, COLORED) {

    OCTAVES     =   helpers.optionalParameter(OCTAVES, 4);
    PERSISTANCE =   helpers.optionalParameter(PERSISTANCE, 0.5);
    LACUNARITY  =   helpers.optionalParameter(LACUNARITY, 2);
    RESOLUTION  =   helpers.optionalParameter(RESOLUTION, 8);
    COLOR_SCALE =   helpers.optionalParameter(COLOR_SCALE, 255);
    COLORED     =   helpers.optionalParameter(COLORED, false);


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

//////////////////////////////////////////
////////////// WORLEY NOISE //////////////


function worleyNoiseGenerator(width, height, THREE_DIMENSIONS, COLORED, NUMBER_OF_POINTS, RED_SCALE, GREEN_SCALE, BLUE_SCALE) {

    THREE_DIMENSIONS    =   helpers.optionalParameter(THREE_DIMENSIONS, true);
    COLORED             =   helpers.optionalParameter(COLORED, true);
    NUMBER_OF_POINTS    =   helpers.optionalParameter(NUMBER_OF_POINTS, width / 10);
    RED_SCALE           =   helpers.optionalParameter(RED_SCALE, 255);
    GREEN_SCALE         =   helpers.optionalParameter(GREEN_SCALE, 255);
    BLUE_SCALE          =   helpers.optionalParameter(BLUE_SCALE, 255);


    let points = [ ];
    let getDist = THREE_DIMENSIONS ? getDistance3D : getDistance2D;

    // Randomly distribute feature points in a 3D volume
    function generateFeaturePoints() {
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            points.push({ x: getRandomInt(width), y: getRandomInt(height), z: getRandomInt(width) });
    }


    // Returns the distance between two points in a 2D plan
    function getDistance2D(x1, x2, y1, y2) {
        let a = x1 - x2;
        let b = y1 - y2;

        return Math.sqrt(a * a + b * b);
    }


    // Returns the distance between two points in a 3D volume
    function getDistance3D(x1, x2, y1, y2, z1, z2) {
        let a = x1 - x2;
        let b = y1 - y2;
        let c = z1 - z2;

        return Math.sqrt(a * a + b * b + c * c);
    }


    // Return the nth nearest distance between a point (x, y) and all feature points
    function getNthNearestDistance(n, x, y) {
        let distances = [ ];

        // Get distances from the given location to each seed points
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            distances[i] = getDist(x, points[i].x, y, points[i].y, 0, points[i].z);

        distances.sort((d1, d2) => { return d1 - d2 });
        return distances[n - 1];
    }


    // Convert a value from one range to another
    function changeRange(n, min_old, max_old, min_new, max_new) {
        if (n > max_old)
            return max_new;
        if (n < min_old)
            return min_new;
        return ((n - min_old) / (max_old - min_old)) * (max_new - min_new) + min_new;
    }


    function compute(x, y) {
        if (COLORED) {
            let R = changeRange(getNthNearestDistance(1, x, y), 0, 1.5 * width, 0, RED_SCALE);
            let G = changeRange(getNthNearestDistance(2, x, y), 0, width / 2, GREEN_SCALE, 0);
            let B = changeRange(getNthNearestDistance(3, x, y), 0, 2 * width, BLUE_SCALE, 0);

            return helpers.getColor(R, G, B, 255);

        }
        else {
            let noiseValue = changeRange(getNthNearestDistance(1, x, y), 0, width / 2, 255, 0);

            return helpers.getColor(noiseValue, noiseValue, noiseValue, 255);
        }
    }

    generateFeaturePoints();

    return (x, y) => compute(x, y);
}


//////////////////////////////////////////

//////////////////////////////////////////
///////////// CELLULAR NOISE /////////////
// TODO: This is a literal duplicate of Worley Noise, hench could be shortened

function cellularNoiseGenerator(width, height, THREE_DIMENSIONS, COLORED, NUMBER_OF_POINTS, RED_SCALE, GREEN_SCALE, BLUE_SCALE) {

    THREE_DIMENSIONS    =   helpers.optionalParameter(THREE_DIMENSIONS, true);
    COLORED             =   helpers.optionalParameter(COLORED, true);
    NUMBER_OF_POINTS    =   helpers.optionalParameter(NUMBER_OF_POINTS, width / 10);
    RED_SCALE           =   helpers.optionalParameter(RED_SCALE, 255);
    GREEN_SCALE         =   helpers.optionalParameter(GREEN_SCALE, 255);
    BLUE_SCALE          =   helpers.optionalParameter(BLUE_SCALE, 255);


    let points = [ ];
    let getDist = THREE_DIMENSIONS ? getDistance3D : getDistance2D;

    // Randomly distribute feature points in a 3D volume
    function generateFeaturePoints() {
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            points.push({ x: getRandomInt(width), y: getRandomInt(height), z: getRandomInt(width) });
    }


    // Returns the distance between two points in a 2D plan
    function getDistance2D(x1, x2, y1, y2) {
        let a = x1 - x2;
        let b = y1 - y2;

        return Math.sqrt(a * a + b * b);
    }


    // Returns the distance between two points in a 3D volume
    function getDistance3D(x1, x2, y1, y2, z1, z2) {
        let a = x1 - x2;
        let b = y1 - y2;
        let c = z1 - z2;

        return Math.sqrt(a * a + b * b + c * c);
    }


    // Return the nth nearest distance between a point (x, y) and all feature points
    function getNthNearestDistance(n, x, y) {
        let distances = [ ];

        // Get distances from the given location to each seed points
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            distances[i] = getDist(x, points[i].x, y, points[i].y, 0, points[i].z);

        distances.sort((d1, d2) => { return d1 - d2 });
        return distances[n - 1];
    }


    // Convert a value from one range to another
    function changeRange(n, min_old, max_old, min_new, max_new) {
        if (n > max_old)
            return max_new;
        if (n < min_old)
            return min_new;
        return ((n - min_old) / (max_old - min_old)) * (max_new - min_new) + min_new;
    }


    function compute(x, y) {
        if (COLORED) {
            let d1 = getNthNearestDistance(1, x, y);
            let d2 = getNthNearestDistance(2, x, y);
            let d3 = getNthNearestDistance(3, x, y);
            let d4 = getNthNearestDistance(4, x, y);

            let R = changeRange(d2 - d1, 0, 1.5 * width, RED_SCALE, 0);
            let G = changeRange(d3 - d2, 0, width / 2, GREEN_SCALE, 0);
            let B = changeRange(d4 - d3, 0, 2 * width, BLUE_SCALE, 0);

            return helpers.getColor(R, G, B, 255);

        }
        else {
            let noiseValue = changeRange(getNthNearestDistance(2, x, y) - getNthNearestDistance(1, x, y), 0, width / 4, 0, 255);
            return helpers.getColor(noiseValue, noiseValue, noiseValue, 255);
        }
    }

    generateFeaturePoints();

    return (x, y) => compute(x, y);
}


//////////////////////////////////////////

exports.randGen = randGen;
exports.perlinNoiseGen = perlinNoiseGenerator;
exports.fractionalBrownianMotionGen = fractalBrownianMotionGenerator;
exports.worleyNoiseGen = worleyNoiseGenerator;
exports.cellularNoiseGen = cellularNoiseGenerator;