const helpers = require('./helpers.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const randGen = (x, y) => helpers.getColor(getRandomInt(255), getRandomInt(255), getRandomInt(255), getRandomInt(255));


//////////////////////////////////////////
////////////// PERLIN NOISE //////////////


function perlinNoiseGenerator(width, height, RESOLUTION, COLOR_SCALE, COLORED, GET_NOISE) {

    RESOLUTION  =   helpers.optionalParameter(RESOLUTION, 8);
    COLOR_SCALE =   helpers.optionalParameter(COLOR_SCALE, 255);
    COLORED     =   helpers.optionalParameter(COLORED, false);
    GET_NOISE   =   helpers.optionalParameter(GET_NOISE, false);

    let gradients = { };

    let pixelSizeWidth = width / RESOLUTION;
    let pixelSizeHeight = height / RESOLUTION;

    // Create random direction vector
    function randomGradient() {
        let angle = (2 * Math.PI) * Math.random();
        return { x: Math.cos(angle), y: Math.sin(angle) }; // Polar coordinates, Norm = 1
    }


    // Computes the dot product of the distance and gradient vectors
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


    // Use for an even smoother result with a second derivative equal to zero on boundaries
    function smootherStep(w) {
        return ((w * (w * 6 - 15) + 10) * w * w * w);
    }


    // Return the interpolation of w between a0 and a1 using Ken Perlin's smootherStep
    function interpolate(w, a0, a1) {
        return (a1 - a0) * smootherStep(w) + a0
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


    // Return the noise value at given coordinate
    function getNoiseHeight(x, y) {
        return compute(x / pixelSizeWidth, y / pixelSizeHeight);
    }


    // Return a RGBA pixel according to a coordinate
    function getPixelColor(x, y) {
        let v = getNoiseHeight(x, y);
        if (COLORED) {
            v = (v + 0.5) * 360;
            [R, G, B] = helpers.hsl2rgb(v);
            return helpers.getColor(R, G, B, 255);
        }
        else {
            v = (v + 1) / 2 * COLOR_SCALE;
            return helpers.getColor(v, v, v, 255);
        }
    }


    if (GET_NOISE)
        return getNoiseHeight;
    else
        return getPixelColor;
}


//////////////////////////////////////////

//////////////////////////////////////////
///////// FRACTAL BROWNIAN MOTION ////////

function fractalBrownianMotionGenerator(width, height, noiseGen, argsList, OCTAVES, PERSISTENCE, LACUNARITY, INITIAL_AMPLIUTUDE, INITIAL_FREQUENCY, COLORED) {

    argsList    =   helpers.optionalParameter(argsList, [ ]);
    OCTAVES     =   helpers.optionalParameter(OCTAVES, 4);
    PERSISTENCE =   helpers.optionalParameter(PERSISTENCE, 0.5);
    LACUNARITY  =   helpers.optionalParameter(LACUNARITY, 2);
    INITIAL_AMPLIUTUDE  =   helpers.optionalParameter(INITIAL_AMPLIUTUDE, 1);
    INITIAL_FREQUENCY   =   helpers.optionalParameter(INITIAL_FREQUENCY, 1);
    COLORED             =   helpers.optionalParameter(COLORED, true);


    // Return a list of generator to use for each octave
    // according to user's input
    function getOctaveGenerator() {
        if (noiseGen === "worley")
            return Array.from({length: OCTAVES}, (v, i) => worleyNoiseGenerator(width * (LACUNARITY ** i), height * (LACUNARITY ** i), ...argsList,...Array(worleyNoiseGenerator.length - argsList.length - 3), true));
        else
            return Array.from({length: OCTAVES}, () => perlinNoiseGenerator(width, height, ...argsList, ...Array(perlinNoiseGenerator.length - argsList.length - 3), true));
    }


    let maxNoiseHeight = 0.2;
    let minNoiseHeight = -0.2;


    let octaveGenerator = getOctaveGenerator();


    // Return the noise value at given coordinate
    function getNoiseHeight(x, y) {
        let amplitude = INITIAL_AMPLIUTUDE;
        let frequency = INITIAL_FREQUENCY;


        // Return the noise value at given octave
        function getOctaveValue(i) {
            let sampleX = x * frequency;
            let sampleY = y * frequency;

            let noiseValue = octaveGenerator[i](sampleX, sampleY);

            amplitude *= PERSISTENCE;
            frequency *= LACUNARITY;

            return noiseValue * amplitude;
        }


        let noiseHeight = Array.from({length: OCTAVES}, (v, i) => getOctaveValue(i)).reduce((prev, curr) => prev + curr, 0);

        if (noiseHeight > maxNoiseHeight)
            maxNoiseHeight = noiseHeight;
        else if (noiseHeight < minNoiseHeight)
            minNoiseHeight = noiseHeight;

        return noiseHeight;
    }


    // Return a RGBA pixel according to a coordinate
    function getPixelColor(x, y) {
        let v = getNoiseHeight(x, y)
        if (COLORED) {
            let R = helpers.changeRange(v, minNoiseHeight, 1.5 * maxNoiseHeight, 0, 255);
            let G = helpers.changeRange(v, minNoiseHeight, 1/2 * maxNoiseHeight, 255, 0);
            let B = helpers.changeRange(v, minNoiseHeight, 2 * maxNoiseHeight, 255, 0);

            return helpers.getColor(R, G, B, 255);
        } else {
            v = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 0, 255);
            return helpers.getColor(v, v, v, 255);
        }
    }


    return getPixelColor;
}

//////////////////////////////////////////


//////////////////////////////////////////
////////////// WORLEY NOISE //////////////


function worleyNoiseGenerator(width, height, TYPE, DISTANCE, THREE_DIMENSIONS, COLORED, NUMBER_OF_POINTS, RED_SCALE, GREEN_SCALE, BLUE_SCALE, GET_NOISE) {

    TYPE                =   helpers.optionalParameter(TYPE, 'f2 - f1');
    DISTANCE            =   helpers.optionalParameter(DISTANCE, 'euclidean')
    THREE_DIMENSIONS    =   helpers.optionalParameter(THREE_DIMENSIONS, false);
    COLORED             =   helpers.optionalParameter(COLORED, false);
    NUMBER_OF_POINTS    =   helpers.optionalParameter(NUMBER_OF_POINTS, width / 3);
    RED_SCALE           =   helpers.optionalParameter(RED_SCALE, 255);
    GREEN_SCALE         =   helpers.optionalParameter(GREEN_SCALE, 255);
    BLUE_SCALE          =   helpers.optionalParameter(BLUE_SCALE, 255);
    GET_NOISE           =   helpers.optionalParameter(GET_NOISE, false);


    let featurePoints = [ ];
    let getDist = loadArgType();
    let distanceFormula = loadArgDistance();
    let distanceDimension = THREE_DIMENSIONS ? distanceFormula.three_dim : distanceFormula.two_dim;


    // Return the type of distance to compute according to user's input
    function loadArgType() {
        if (TYPE === 'f1')
            return (x, y) => getNthNearestDistance(1, x, y);
        else
            return (x, y) => getNthNearestDistance(2, x, y) - getNthNearestDistance(1, x, y);
    }


    // Return the distance formula to use according to user's input
    function loadArgDistance() {
        if (DISTANCE === 'euclidean')
            return getDistanceEuclidean();
        else if (DISTANCE === 'manhattan')
            return getDistanceManhattan();
        else
            return getDistanceChebyshev();
    }


    // Tools to compute Chebyshev distances
    function getDistanceChebyshev() {


        // Returns the Chebyshev distance between two points in a 2D plan
        function getDistance2D(x1, x2, y1, y2) {
            let a = Math.abs(x1 - x2);
            let b = Math.abs(y1 - y2);

            return Math.max(a, b);
        }


        // Returns the Chebyshev distance between two points in a 3D volume
        function getDistance3D(x1, x2, y1, y2, z1, z2) {
            let a = Math.abs(x1 - x2);
            let b = Math.abs(y1 - y2);
            let c = Math.abs(z1 - z2);

            return Math.max(a, b, c);
        }

        return {
            two_dim: getDistance2D,
            three_dim: getDistance3D
        };

    }


    // Tools to compute Manhattan distances
    function getDistanceManhattan() {


        // Returns the Manhattan distance between two points in a 2D plan
        function getDistance2D(x1, x2, y1, y2) {
            let a = Math.abs(x1 - x2);
            let b = Math.abs(y1 - y2);

            return a + b;
        }


        // Returns the Manhattan distance between two points in a 3D volume
        function getDistance3D(x1, x2, y1, y2, z1, z2) {
            let a = Math.abs(x1 - x2);
            let b = Math.abs(y1 - y2);
            let c = Math.abs(z1 - z2);

            return a + b + c;
        }

        return {
            two_dim: getDistance2D,
            three_dim: getDistance3D
        };

    }


    // Tools to compute euclidean distances
    function getDistanceEuclidean() {


        // Returns the euclidean distance between two points in a 2D plan
        function getDistance2D(x1, x2, y1, y2) {
            let a = x1 - x2;
            let b = y1 - y2;

            return Math.sqrt(a * a + b * b);
        }


        // Returns the euclidean distance between two points in a 3D volume
        function getDistance3D(x1, x2, y1, y2, z1, z2) {
            let a = x1 - x2;
            let b = y1 - y2;
            let c = z1 - z2;

            return Math.sqrt(a * a + b * b + c * c);
        }

        return {
            two_dim: getDistance2D,
            three_dim: getDistance3D
        };
    }


    // Randomly distribute feature points in a 3D volume
    function generateFeaturePoints() {
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            featurePoints.push({ x: getRandomInt(width), y: getRandomInt(height), z: getRandomInt(width) });
    }


    // Return the nth nearest distance between a point (x, y) and all feature points
    function getNthNearestDistance(n, x, y) {
        let distances = [ ];

        // Get distances from the given location to each seed points
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            distances[i] = distanceDimension(x, featurePoints[i].x, y, featurePoints[i].y, 0, featurePoints[i].z);

        distances.sort((d1, d2) => { return d1 - d2 });
        return distances[n - 1];
    }


    // Return a RGBA pixel according to a coordinate
    function getPixelColor(x, y) {
        let distance = getDist(x, y);
        if (COLORED) {
            let R = helpers.changeRange(distance, 0, 1.5 * width, 0, RED_SCALE);
            let G = helpers.changeRange(distance, 0, width / 2, GREEN_SCALE, 0);
            let B = helpers.changeRange(distance, 0, 2 * width, BLUE_SCALE, 0);

            return helpers.getColor(R, G, B, 255);
        }
        else {
            let noiseValue = helpers.changeRange(distance, 0, width / 4, 0, 255);

            return helpers.getColor(noiseValue, noiseValue, noiseValue, 255);
        }
    }

    generateFeaturePoints();

    if (GET_NOISE)
        return (x, y) => helpers.changeRange(getDist(x, y), 0, width / 4, -0.5, 0.5);
    return getPixelColor;
}


//////////////////////////////////////////


//////////////////////////////////////////

exports.randGen = randGen;
exports.perlinNoiseGen = perlinNoiseGenerator;
exports.fractionalBrownianMotionGen = fractalBrownianMotionGenerator;
exports.worleyNoiseGen = worleyNoiseGenerator;