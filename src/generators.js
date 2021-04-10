const helpers = require('./helpers.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const randGen = (x, y) => helpers.getColor(getRandomInt(255), getRandomInt(255), getRandomInt(255), getRandomInt(255));


//////////////////////////////////////////
////////////// PERLIN NOISE //////////////


function perlinNoiseGenerator(width, height, NOISE, RESOLUTION, COLOR_SCALE, COLORED, GET_NOISE) {

    NOISE       =   helpers.optionalParameter(NOISE, "simplex");
    RESOLUTION  =   helpers.optionalParameter(RESOLUTION, 8);
    COLOR_SCALE =   helpers.optionalParameter(COLOR_SCALE, 255);
    COLORED     =   helpers.optionalParameter(COLORED, false);
    GET_NOISE   =   helpers.optionalParameter(GET_NOISE, false);

    let gradients = { };

    let pixelSizeWidth = width / RESOLUTION;
    let pixelSizeHeight = height / RESOLUTION;


    let compute = loadNoiseType();


    // Return the type of distance to compute according to user's input
    function loadNoiseType() {
        if (NOISE === 'value')
            return valueNoise();
        else if (NOISE === 'gradient')
            return gradientNoise();
        else if (NOISE === 'simplex')
            return simplexNoise();
        else
            throw Error(`${NOISE} is not a valid noise type. Valid noise types are 'value', 'gradient' and 'simplex'.`);
    }


    // Use for an even smoother result with a second derivative equal to zero on boundaries
    function smootherStep(w) {
        return ((w * (w * 6 - 15) + 10) * w * w * w);
    }


    // Return the interpolation of w between a0 and a1 using Ken Perlin's smootherStep
    function interpolate(w, a0, a1) {
        return (a1 - a0) * smootherStep(w) + a0
    }


    function valueNoise() {
        function randomValue() {
            return helpers.changeRange(Math.random(), 0, 1, -1, 1);
        }

        // Computes the dot product of the distance and gradient vectors
        function dotGridValue(ix, iy) {
            // Get value from integer coordinate
            if (!gradients[[ix, iy]])
                gradients[[ix, iy]] = randomValue();

            // Compute the dot-product
            return gradients[[ix, iy]];
        }

        function computeValue(x, y) {
            // Determine grid cell coordinates
            let x0 = Math.floor(x);
            let x1 = x0 + 1;
            let y0 = Math.floor(y);
            let y1 = y0 + 1;

            // Determine interpolation weights
            let sx = x - x0;
            let sy = y - y0;

            // Interpolate between grid point gradients
            let n0 = dotGridValue(x0, y0, x, y);
            let n1 = dotGridValue(x1, y0, x, y);
            let ix0 = interpolate(sx, n0, n1);
            n0 = dotGridValue(x0, y1, x, y);
            n1 = dotGridValue(x1, y1, x, y);
            let ix1 = interpolate(sx, n0, n1);

            let value = interpolate(sy, ix0, ix1);

            return value;
        }


        return computeValue;
    }


    function gradientNoise() {
        // Create random direction vector
        function randomGradient() {
            let angle = (2 * Math.PI) * Math.random();
            return {x: Math.cos(angle), y: Math.sin(angle)}; // Polar coordinates, Norm = 1
        }


        // Computes the dot product of the distance and gradient vectors
        function dotGridGradient(ix, iy, x, y) {
            // Get gradient from integer coordinate
            if (!gradients[[ix, iy]])
                gradients[[ix, iy]] = randomGradient();

            // Compute the distance vector
            let dx = x - ix;
            let dy = y - iy;

            // Compute the dot-product
            return helpers.changeRange(dx * gradients[[ix, iy]].x + dy * gradients[[ix, iy]].y, -0.7, 0.7, -1, 1);
        }


        // Compute Perlin noise at coordinates x, y
        function computeGradient(x, y) {
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


        return computeGradient;
    }


    function simplexNoise() {
        let r = 0.5;

        // Skewing factors for 2D simplex grid
        let F2 = (Math.sqrt(3) - 1) / 2; // triangle to square
        let G2 = (3 - Math.sqrt(3)) / 6; // square to triangle

        const permutation = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36,
            103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0,
            26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56,
            87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
            77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55,
            46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132,
            187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109,
            198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126,
            255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183,
            170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
            172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112,
            104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162,
            241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106,
            157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
            93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];


        function dotGridGradient(hash, x, y) {
            let h = hash & 7;      // Convert low 3 bits of hash code
            let u = h < 4 ? x : y;  // into 8 simple gradient directions,
            let v = h < 4 ? y : x;  // and compute the dot product with (x,y).
            return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
        }


        function skew(x, y) {
            let s = (x + y) * F2; // 2D Hairy factor
            return [ x + s, y + s ];
        }


        function getUnskewedDisplacementVector(x, y, ixSkewed, iySkewed) {
            let us = (ixSkewed + iySkewed) * G2;
            return [ x - ixSkewed + us, y - iySkewed + us ];

        }


        function falloff(x, y) {
            return r - x * x - y * y;
        }


        function computeSimplex(x, y) {
            // Coordinate Skewing

            // Skew the input space to determine which simplex cell we're in
            let [ xSkewed, ySkewed ]  = skew(x, y);
            let ixSkewed = Math.floor(xSkewed);
            let iySkewed = Math.floor(ySkewed);

            // Simplicial subdivision

            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we're in
            let xi, yi; // Offsets for second (middle) corner of simplex in (i, j) coords
            if (xSkewed - ixSkewed > ySkewed - iySkewed) {
                // The x internal coordinate is the largest, so it is added first, then followed by the y internal coordinate
                xi = 1;
                yi = 0;
            } else {
                // The y internal coordinate is the largest, so it is added first, then followed by the x internal coordinate
                xi = 0;
                yi = 1;
            }

            // Gradient selection

            // Unskew the cell origin back to (x, y) space
            // The x, y distances from the cell origin
            let [ xUnskewed, yUnskewed ] = getUnskewedDisplacementVector(x, y, ixSkewed, iySkewed);

            // Adding (1,0) to unskewed coordinates implies adding (1 - G2, -G2) to input coordinates
            // Adding (0,1) to unskewed coordinates implies adding (-G2, 1 - G2) to input coordinates
            // Offsets with the first largest coordinate added
            let x1 = xUnskewed - xi + G2;
            let y1 = yUnskewed - yi + G2;

            // Offsets with the second largest coordinate added
            let x2 = xUnskewed - 1 + 2 * G2;
            let y2 = yUnskewed - 1 + 2 * G2;

            // Kernel summation

            // Majors the indices to 256, so as not to exceed the size of the array of permutations.
            let ii = ixSkewed % 256;
            let jj = iySkewed % 256;

            let n0, n1, n2; // Noise contributions from each of the three corners

            // Calculate the contribution from the three corners
            let f0 = falloff(xUnskewed, yUnskewed);
            n0 = Math.max(0, f0) ** 4 * dotGridGradient(permutation[ii + permutation[jj]], xUnskewed, yUnskewed);

            // We add the largest coordinate
            let f1 = falloff(x1, y1);
            n1 = Math.max(0, f1) ** 4 * dotGridGradient(permutation[ii + xi + permutation[jj + yi]], x1, y1)

            // Then we add the second largest coordinate
            let f2 = falloff(x2, y2);
            n2 = Math.max(0, f2) ** 4 * dotGridGradient(permutation[ii + 1 + permutation[jj + 1]], x2, y2)

            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            let scaleFactor = 2916 * Math.sqrt(2) / 125;
            return scaleFactor * (n0 + n1 + n2);
        }


        return computeSimplex;
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

function fractalBrownianMotionGenerator(width, height, noiseGen, argsList, OCTAVES, PERSISTENCE, LACUNARITY, INITIAL_AMPLIUTUDE, INITIAL_FREQUENCY, COLORED,GET_NOISE) {

    argsList    =   helpers.optionalParameter(argsList, [ ]);
    OCTAVES     =   helpers.optionalParameter(OCTAVES, 4);
    PERSISTENCE =   helpers.optionalParameter(PERSISTENCE, 0.5);
    LACUNARITY  =   helpers.optionalParameter(LACUNARITY, 2);
    INITIAL_AMPLIUTUDE  =   helpers.optionalParameter(INITIAL_AMPLIUTUDE, 1);
    INITIAL_FREQUENCY   =   helpers.optionalParameter(INITIAL_FREQUENCY, 1);
    COLORED             =   helpers.optionalParameter(COLORED, true);
    GET_NOISE = helpers.optionalParameter(GET_NOISE,false);

    // Return a list of generator to use for each octave
    // according to user's input
    function getOctaveGenerator() {
        if (noiseGen === "worley")
            return Array.from({length: OCTAVES}, (v, i) => worleyNoiseGenerator(width * (LACUNARITY ** i), height * (LACUNARITY ** i), ...argsList,...Array(worleyNoiseGenerator.length - argsList.length - 3), true));
        else
            return Array.from({length: OCTAVES}, () => perlinNoiseGenerator(width, height, ...argsList, ...Array(perlinNoiseGenerator.length - argsList.length - 3), true));
    }


    let maxNoiseHeight = 1;
    let minNoiseHeight = -1;


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
        let v = getNoiseHeight(x, y);
        //if (v > 0.5) console.log(v);
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

    if (GET_NOISE)
	    return getNoiseHeight;
    else
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
    let distances = [ ];

    let getDist = loadArgType();
    let distanceFormula = loadArgDistance();
    let distanceDimension = THREE_DIMENSIONS ? distanceFormula.three_dim : distanceFormula.two_dim;


    // Return the type of distance to compute according to user's input
    function loadArgType() {
        if (TYPE === 'f1')
            return (x, y) => getNthNearestDistance(1, x, y);
        else if (TYPE === 'f2 - f1')
            return (x, y) => getNthNearestDistance(2, x, y) - getNthNearestDistance(1, x, y);
        else if (TYPE === 'f2')
            return (x, y) => getNthNearestDistance(2, x, y);
        else
            throw Error(`${TYPE} is not a valid distance type. Valid distance types are 'f1', 'f2' and 'f2 - f1'`);
    }


    // Return the distance formula to use according to user's input
    function loadArgDistance() {
        if (DISTANCE === 'euclidean')
            return getDistanceEuclidean();
        else if (DISTANCE === 'manhattan')
            return getDistanceManhattan();
        else if (DISTANCE === 'chebyshev')
            return getDistanceChebyshev();
        else
            throw Error(`${DISTANCE} is not a valid distance formula. Distance formulas are 'euclidean', 'manhattan' and 'chebyshev'`);
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
        if (distances[[ n, x, y ]])
            return distances[[ n, x, y ]];

        let _distances = [ ];

        // Get distances from the given location to each seed points
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            _distances[i] = distanceDimension(x, featurePoints[i].x, y, featurePoints[i].y, 0, featurePoints[i].z);

        _distances.sort((d1, d2) => { return d1 - d2 });

        distances[[ n, x, y ]] = _distances[n - 1];
        return _distances[n - 1];
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
        return (x, y) => helpers.changeRange(getDist(x, y), 0, width / 4, -2, 2);
    return getPixelColor;
}


//////////////////////////////////////////


//////////////////////////////////////////

exports.randGen = randGen;
exports.perlinNoiseGen = perlinNoiseGenerator;
exports.fractionalBrownianMotionGen = fractalBrownianMotionGenerator;
exports.worleyNoiseGen = worleyNoiseGenerator;
