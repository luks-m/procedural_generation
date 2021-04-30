const helpers = require('./helpers.js');
const colors = require('./colors.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function singleColorRandomGenerator(color) {
    return (x, y) => colors.createColor(getRandomInt(255), getRandomInt(255), getRandomInt(255), getRandomInt(255));
}


//////////////////////////////////////////
////////////// PERLIN NOISE //////////////

/**
 * @typedef {Object} perlinDescriptor
 * @property {number} [seed=42] - Random generator's seed
 * @property {('value'|'gradient'|'simplex')} [variant='simplex] - Variant of Perlin Noise to use
 * @property {number} [scale=8] - Scale of the image (can be assimilated with a zoom)
 * @property {boolean} [colored=false] - Put to true to have a colored image, else it will be B&W
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * Perlin Noise Generator
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @param {perlinDescriptor} options - Set of optional parameters to configure the Perlin noise generation
 * @returns {(function(number, number): number)
 * |(function(number, number): {red: number, green: number, blue: number, alpha: number})}
 * RGBA quadruplet for coordinates (x, y), or the noise value for these coordinates if "get_noise" set to true
 */
function perlinNoiseGenerator(width, height, options) {
    const SEED        =   helpers.optionalParameter(options.seed, 42);
    const VARIANT       =   helpers.optionalParameter(options.variant, "simplex");
    const SCALE       =   helpers.optionalParameter(options.scale, 8);
    const COLORED     =   helpers.optionalParameter(options.colored, false);
    const GET_NOISE   =   helpers.optionalParameter(options.get_noise, false);


    const random = helpers.makeRandom(SEED);


    let gradients = {};

    let pixelSizeWidth = width / SCALE;
    let pixelSizeHeight = height / SCALE;


    let compute = loadNoiseType();


    /**
     * Returns the type of distance to compute according to user's input
     * @returns {function} - Function to use to compute the noise value
     */
    function loadNoiseType() {
        if (VARIANT === 'value')
            return valueNoise();
        else if (VARIANT === 'gradient')
            return gradientNoise();
        else if (VARIANT === 'simplex')
            return simplexNoise();
        else
            throw Error(`${VARIANT} is not a valid noise type. Valid noise types are 'value', 'gradient' and 'simplex'.`);
    }


    /**
     * Used for an even smoother result with a second derivative equal to zero on boundaries
     * @param {number} x - Must be equal to or between 0 and 1
     * @returns {number} - Polynomial evaluation at x
     */
    function smootherStep(x) {
        return ((x * (x * 6 - 15) + 10) * x * x * x);
    }


    /**
     * Returns the interpolation of x between a0 and a1 using Ken Perlin's smootherStep
     * @param x - Value to interpolate
     * @param a0 - Lower bound
     * @param a1 - Upper bound
     * @returns {number} - Interpolated value
     */
    function interpolate(x, a0, a1) {
        return (a1 - a0) * smootherStep(x) + a0;
    }

    /**
     * Tools to compute value noise
     * @returns {function} - Function returning a noise value for coordinates (x, y) according to a value noise
     */
    function valueNoise() {

        /**
         * Returns a random value in range ]-1, 1[
         * @returns {number} - Random value
         */
        function randomValue() {
            return random();
        }

        /**
         * Computes the dot product of the distance and gradient vectors
         * @param {number} ix - Integer x coordinate to get gradient from
         * @param {number} iy - Integer y coordinate to get gradient from
         * @returns {number} - A value in range ]-1, 1[
         */
        function dotGridValue(ix, iy) {
            // Get value from integer coordinate
            if (!gradients[[ix, iy]])
                gradients[[ix, iy]] = randomValue();

            // Compute the dot-product
            return gradients[[ix, iy]];
        }

        /**
         * Compute the noise value for value noise
         * @param {number} x - x coordinate to compute the value from
         * @param {number} y - y coordinate to compute the value from
         * @returns {number} - The value noise value
         */
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
            let n0 = dotGridValue(x0, y0);
            let n1 = dotGridValue(x1, y0);
            let ix0 = interpolate(sx, n0, n1);
            n0 = dotGridValue(x0, y1);
            n1 = dotGridValue(x1, y1);
            let ix1 = interpolate(sx, n0, n1);

            let value = interpolate(sy, ix0, ix1);

            return value;
        }


        return computeValue;
    }

    /**
     * Tools to compute gradient noise
     * @returns {function} - Function returning a noise value for coordinates (x, y) according to a gradient noise
     */
    function gradientNoise() {

        /**
         * Returns a random 2D normalized vector
         * @returns {{x: number, y: number}} - Random vector
         */
        function randomGradient() {
            let angle = (2 * Math.PI) * random();
            return {x: Math.cos(angle), y: Math.sin(angle)}; // Polar coordinates, Norm = 1
        }


        /**
         * Computes the dot product of the distance and gradient vectors
         * @param {number} ix - Integer x coordinate to get gradient
         * @param {number} iy - Integer y coordinate to get gradient
         * @param {number} x - Input x coordinate
         * @param {number} y - Input y coordinate
         * @returns {number} - Value in range [-1, 1]
         */
        function dotGridGradient(ix, iy, x, y) {
            // Get gradient from integer coordinate
            if (!gradients[[ix, iy]])
                gradients[[ix, iy]] = randomGradient();

            // Compute the distance vector
            let dx = x - ix;
            let dy = y - iy;

            // Compute the dot-product (changeRange used to broaden spectrum)
            return helpers.changeRange(dx * gradients[[ix, iy]].x + dy * gradients[[ix, iy]].y, -0.7, 0.7, -1, 1);
        }


        /**
         * Compute the noise value for gradient noise
         * @param {number} x - x coordinate to compute the value from
         * @param {number} y - y coordinate to compute the value from
         * @returns {number} - The gradient noise value
         */
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


    /**
     * Tools to compute simplex noise
     * @returns {function} - Function returning a noise value for coordinates (x, y) according to a simplex noise
     */
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


        /**
         * Computes the dot product with (x, y)
         * @param {number} hash - hash code gotten with the permutation table
         * @param {number} x - Input x coordinate
         * @param {number} y - Input y coordinate
         * @returns {number} - the dot product with (x,y)
         */
        function dotGridGradient(hash, x, y) {
            let h = hash & 7;      // Convert low 3 bits of hash code
            let u = h < 4 ? x : y;  // into 8 simple gradient directions,
            let v = h < 4 ? y : x;  // and compute the dot product with (x,y).
            return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
        }


        /**
         * Returns skewed coordinate in 2D simplex grid
         * @param {number} x - Input x coordinate
         * @param {number} y - Input y coordinate
         * @returns {number[]} - Skewed (x, y) coordinates
         */
        function skew(x, y) {
            let s = (x + y) * F2; // 2D Hairy factor
            return [x + s, y + s];
        }


        /**
         * Returns the unskewed displacement vector
         * @param {number} x - Input x coordinate
         * @param {number} y - Input y coordinate
         * @param {number} ixSkewed - Skewed unit hypercube cell the input x coordinate lie
         * @param {number} iySkewed - Skewed unit hypercube cell the input y coordinate lie
         * @returns {number[]} - Unskewed displacement vector
         */
        function getUnskewedDisplacementVector(x, y, ixSkewed, iySkewed) {
            let us = (ixSkewed + iySkewed) * G2;
            return [x - ixSkewed + us, y - iySkewed + us];

        }


        /**
         * Similar to the interpolation between corners in the 2D simplex grid
         * @param {number} x - x coordinate
         * @param {number} y - y coordinate
         * @returns {number} - Contribution of the corner
         */
        function falloff(x, y) {
            return r - x * x - y * y;
        }

        /**
         * Compute the simplex value for simplex noise
         * @param {number} x - x coordinate to compute the value from
         * @param {number} y - y coordinate to compute the value from
         * @returns {number} - The simplex noise value
         */
        function computeSimplex(x, y) {
            // Coordinate Skewing

            // Skew the input space to determine which simplex cell we're in
            let [xSkewed, ySkewed] = skew(x, y);
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
            let [xUnskewed, yUnskewed] = getUnskewedDisplacementVector(x, y, ixSkewed, iySkewed);

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
            let ii = (SEED + ixSkewed) % 256;
            let jj = (SEED + iySkewed) % 256;

            let n0, n1, n2; // Noise contributions from each of the three corners

            // Calculate the contribution from the three corners
            let f0 = falloff(xUnskewed, yUnskewed);
            n0 = Math.max(0, f0) ** 4 * dotGridGradient(permutation[ii + permutation[jj]], xUnskewed, yUnskewed);

            // We add the largest coordinate
            let f1 = falloff(x1, y1);
            n1 = Math.max(0, f1) ** 4 * dotGridGradient(permutation[ii + xi + permutation[jj + yi]], x1, y1);

            // Then we add the second largest coordinate
            let f2 = falloff(x2, y2);
            n2 = Math.max(0, f2) ** 4 * dotGridGradient(permutation[ii + 1 + permutation[jj + 1]], x2, y2);

            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            let scaleFactor = 2916 * Math.sqrt(2) / 125;
            return scaleFactor * (n0 + n1 + n2);
        }


        return computeSimplex;
    }


    /**
     * Returns the noise value at given coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @returns {number} - noise value between -1 and 1
     */
    function getNoiseHeight(x, y) {
        return compute(x / pixelSizeWidth, y / pixelSizeHeight);
    }


    /**
     * Returns a RGBA pixel according to a coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @returns {{red: number, green: number, blue: number, alpha: number}} - a RGBA pixel according to a Perlin Noise
     */
    function getPixelColor(x, y) {
        let v = getNoiseHeight(x, y);
        if (COLORED) {
            v = (v + 0.5) * 360;
            let [R, G, B] = helpers.hsl2rgb(v);
            return colors.createColor(R, G, B, 255);
        } else {
            v = (v + 1) / 2 * 255;
            return colors.createColor(v, v, v, 255);
        }
    }


    if (GET_NOISE)
        return getNoiseHeight;
    else
        return getPixelColor;
}


//////////////////////////////////////////

//////////////////////////////////////////
////////////// FRACTAL NOISE /////////////

/**
 * @typedef {Object} fbmDescriptor
 * @property {('perlin'|'worley')} [noiseGen='perlin'] - Noise generator to compute the noise with
 * @property {number} [noiseSeed=42] - Noise generator seed
 * @property {*[]} [argsList=[ ]] - Optional arguments for the noise generator, starting at the third argument of the noise generator function
 * @property {number} [octaves=2|4] - Number of frequency octaves to generate the noise with
 * @property {number} [persistence=0.5] - A multiplier that determines how quickly the amplitude increases for each successive octave.
 * @property {number} [lacunarity=2] - A multiplier that determines how quickly the frequency increases for each successive octave.
 * @property {number} [initial_amplitude=1] - Initial amplitude for the first octave
 * @property {number} [initial_frequency=1] - Initial frequency for the first octave
 * @property {boolean} [colored=false] - Put to true to have a colored image, else it will be B&W
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * @typedef {Object} turbulenceDescriptor
 * @property {('perlin'|'worley')} [noiseGen='perlin'] - Noise generator to compute the noise with
 * @property {number} [noiseSeed=42] - Noise generator seed
 * @property {*[]} [argsList=[ ]] - Optional arguments for the noise generator, starting at the third argument of the noise generator function
 * @property {number} [octaves=2|4] - Number of frequency octaves to generate the noise with
 * @property {number} [persistence=0.5] - A multiplier that determines how quickly the amplitude increases for each successive octave.
 * @property {number} [lacunarity=2] - A multiplier that determines how quickly the frequency increases for each successive octave.
 * @property {number} [initial_amplitude=1] - Initial amplitude for the first octave
 * @property {number} [initial_frequency=1] - Initial frequency for the first octave
 * @property {boolean} [colored=false] - Put to true to have a colored image, else it will be B&W
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * @typedef {Object} ridgedMultifractalDescriptor
 * @property {('perlin'|'worley')} [noiseGen='perlin'] - Noise generator to compute the noise with
 * @property {number} [noiseSeed=42] - Noise generator seed
 * @property {*[]} [argsList=[ ]] - Optional arguments for the noise generator, starting at the third argument of the noise generator function
 * @property {number} [octaves=2|4] - Number of frequency octaves to generate the noise with
 * @property {number} [persistence=0.5] - A multiplier that determines how quickly the amplitude increases for each successive octave.
 * @property {number} [lacunarity=2] - A multiplier that determines how quickly the frequency increases for each successive octave.
 * @property {number} [initial_amplitude=1] - Initial amplitude for the first octave
 * @property {number} [initial_frequency=1] - Initial frequency for the first octave
 * @property {boolean} [colored=false] - Put to true to have a colored image, else it will be B&W
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * @typedef {Object} fractalDescriptor
 * @property {('fbm'|'turbulence'|'ridged')} fractal - Type of fractal noise to compute
 * @property {fractalBrownianMotionGenerator|turbulenceDescriptor|ridgedMultifractalDescriptor} fractalOptions - Parameters for the fractal noise generator
 */

/**
 * Fractal Noise Generator
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @param {fractalDescriptor} options - Set of parameters to configure the fractal noise generation
 * @returns {(function(number, number): number)
 * |(function(number, number): {red: number, green: number, blue: number, alpha: number})}
 * RGBA quadruplet for coordinates (x, y), or the noise value for these coordinates if "get_noise" set to true
 */
function fractalNoiseGenerator(width, height, options) {

    const fractalGen  =   helpers.optionalParameter(options.fractal, 'fbm');
    const noiseGen    =   helpers.optionalParameter(options.fractalOptions.noiseGen, 'perlin');
    const noiseSeed   =   helpers.optionalParameter(options.fractalOptions.noiseSeed, 42);
    const argsList    =   helpers.optionalParameter(options.fractalOptions.argsList, [ ]);
    const OCTAVES     =   helpers.optionalParameter(options.fractalOptions.octaves, noiseGen === 'worley' ? 2 : 4);
    const PERSISTENCE =   helpers.optionalParameter(options.fractalOptions.persistence, 0.5);
    const LACUNARITY  =   helpers.optionalParameter(options.fractalOptions.lacunarity, 2);
    const INITIAL_AMPLITUDE   =   helpers.optionalParameter(options.fractalOptions.initial_amplitude, 1);
    const INITIAL_FREQUENCY   =   helpers.optionalParameter(options.fractalOptions.initial_frequency, 1);
    const COLORED             =   helpers.optionalParameter(options.fractalOptions.colored, false);
    const GET_NOISE   =   helpers.optionalParameter(options.fractalOptions.get_noise,false);


    let maxNoiseHeight;
    let minNoiseHeight;
    let initial_noiseHeight;
    const octaveNoiseTransformation = loadArgFractalGen();


    let octaveGenerator = getOctaveGenerator();


    // Return the type of distance to compute according to user's input
    function loadArgFractalGen() {
        if (fractalGen === 'fbm') {
            maxNoiseHeight = 1;
            minNoiseHeight = -1;
            initial_noiseHeight = 0;
            return (noiseValue, amplitude) => noiseValue * amplitude;
        }
        else if (fractalGen === 'turbulence') {
            maxNoiseHeight = 1;
            minNoiseHeight = 0;
            initial_noiseHeight = 0;
            return (noiseValue, amplitude) => Math.abs(noiseValue) * amplitude;
        }
        else if (fractalGen === 'ridged') {
            let visualClarityOffset = noiseGen === 'worley' ? OCTAVES / 10 : 0;

            maxNoiseHeight = -0.5 + visualClarityOffset;
            minNoiseHeight = -1;
            initial_noiseHeight = -1;
            return (noiseValue, amplitude) => (1 - Math.abs(noiseValue)) ** 2 * amplitude;
        }
        else
            throw Error(`${fractalGen} is not a fractal generator. Valid fractal generator are 'fbm', 'turbulence' and 'ridged`);
    }


    /**
     * Returns a list of generator to use for each octave according to user's input
     * @returns {function[]} - Array of generators for each of the octave
     */
    function getOctaveGenerator() {
        if (noiseGen === 'worley')
            return Array.from({length: OCTAVES}, (v, i) => worleyNoiseGenerator(width * (LACUNARITY ** i), height * (LACUNARITY ** i), {...argsList, seed: i + noiseSeed, get_noise: true}));
        else if (noiseGen === 'perlin')
            return Array.from({length: OCTAVES}, () => perlinNoiseGenerator(width, height, {...argsList, seed: noiseSeed, get_noise: true}));
        else
            throw Error(`${noiseGen} is not a valid noise generator. Valid noise generators are 'worley' and 'perlin'`);
    }


    /**
     * Returns the noise value at given coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @returns {number} - noise value between -1 and 1
     */
    function getNoiseHeight(x, y) {
        let amplitude = INITIAL_AMPLITUDE;
        let frequency = INITIAL_FREQUENCY;


        /**
         * Returns the noise value at given octave
         * @param {number} i - ith octave to compute the noise value from
         * @returns {number} - The noise value at the ith octave
         */
        function getOctaveValue(i) {
            let sampleX = x * frequency;
            let sampleY = y * frequency;

            let noiseValue = octaveGenerator[i](sampleX, sampleY);

            amplitude *= PERSISTENCE;
            frequency *= LACUNARITY;

            return octaveNoiseTransformation(noiseValue, amplitude);
        }


        let noiseHeight = Array.from({length: OCTAVES}, (v, i) => getOctaveValue(i)).reduce((prev, curr) => prev + curr, initial_noiseHeight);

        if (noiseHeight > maxNoiseHeight)
            maxNoiseHeight = noiseHeight;
        else if (noiseHeight < minNoiseHeight)
            minNoiseHeight = noiseHeight;

        return noiseHeight;
    }


    /**
     * Returns a RGBA pixel according to a coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @returns {{red: number, green: number, blue: number, alpha: number}} - a RGBA pixel according to a Perlin Noise
     */
    function getPixelColor(x, y) {
        let v = getNoiseHeight(x, y);
        if (COLORED) {
            let R = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 20, 87);
            let G = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 45, 182);
            let B = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 70, 255);

            return colors.createColor(R, G, B, 255);
        } else {
            v = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 0, 255);
            return colors.createColor(v, v, v, 255);
        }
    }

    if (GET_NOISE)
        return (x, y) => helpers.changeRange(getNoiseHeight(x, y), minNoiseHeight, maxNoiseHeight, -1, 1);
    else
        return getPixelColor;
}

//////////////////////////////////////////


//////////////////////////////////////////
////////////// WORLEY NOISE //////////////

/**
 * @typedef {Object} worleyDescriptor
 * @property {number} [seed=42] - Noise generator seed
 * @property {('f1'|'f2'|'f2 - f1')} [type='f2 - f1'] - Type of distance to feature points to use
 * @property {('euclidean'|'manhattan'|'chebyshev')} distance - Distance formula to use
 * @property {boolean} [three_dimensions=false] - Put to true to compute in a 3D space, else 2D
 * @property {boolean} [colored=false] - Put to true to have a colored image, else it will be B&W
 * @property {number} [number_of_points=width/3] - Number of feature points
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * Worley Noise Generator
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @param {worleyDescriptor} options - Set of optional parameters to configure the Worley noise generation
 * @returns {(function(number, number): number)
 * |(function(number, number): {red: number, green: number, blue: number, alpha: number})}
 * RGBA quadruplet for coordinates (x, y), or the noise value for these coordinates if "get_noise" set to true
 */
function worleyNoiseGenerator(width, height, options) {
    const SEED                =   helpers.optionalParameter(options.seed, 42);
    const TYPE                =   helpers.optionalParameter(options.type, 'f2 - f1');
    const DISTANCE            =   helpers.optionalParameter(options.distance, 'euclidean');
    const THREE_DIMENSIONS    =   helpers.optionalParameter(options.three_dimensions, false);
    const COLORED             =   helpers.optionalParameter(options.colored, false);
    const NUMBER_OF_POINTS    =   helpers.optionalParameter(options.number_of_points, width / 3);
    const GET_NOISE           =   helpers.optionalParameter(options.get_noise, false);


    let featurePoints = [ ];
    let distances = [ ];

    let random = helpers.makeRandom(SEED);

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


    function getInt(max) {
        return Math.floor(helpers.changeRange(random(), -1, 1, 0, 1) * Math.floor(max));
    }


    // Randomly distribute feature points in a 3D volume
    function generateFeaturePoints() {
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            featurePoints.push({x: getInt(width), y: getInt(height), z: getInt(width)});
    }


    // Return the nth nearest distance between a point (x, y) and all feature points
    function getNthNearestDistance(n, x, y) {
        if (distances[[x, y]])
            return distances[[x, y]][n - 1];

        let _distances = [];

        // Get distances from the given location to each seed points
        for (let i = 0; i < NUMBER_OF_POINTS; i++)
            _distances[i] = distanceDimension(x, featurePoints[i].x, y, featurePoints[i].y, 0, featurePoints[i].z);

        _distances.sort((d1, d2) => {
            return d1 - d2
        });

        distances[[x, y]] = _distances.slice(0, 2); // Save only th first two distances, as these are the only one which may be useful
        return _distances[n - 1];
    }


    // Return a RGBA pixel according to a coordinate
    function getPixelColor(x, y) {
        let distance = getDist(x, y);
        if (COLORED) {
            let R = helpers.changeRange(distance, 0, width / 6, 20, 74);
            let G = helpers.changeRange(distance, 0, width / 6, 45, 154);
            let B = helpers.changeRange(distance, 0, width / 6, 70, 216);

            return colors.createColor(R, G, B, 255);
        } else {
            let noiseValue = helpers.changeRange(distance, 0, width / 7, 0, 255);

            return colors.createColor(noiseValue, noiseValue, noiseValue, 255);
        }
    }

    generateFeaturePoints();

    if (GET_NOISE)
        return (x, y) => helpers.changeRange(getDist(x, y), 0, width / 7, -2, 2);
    return getPixelColor;
}


//////////////////////////////////////////

//////////////////////////////////////////
///////// DOMAIN WARPING FRACTAL /////////
/**
 * @typedef {Object} domainWarpingDescriptor
 * @property {fractalDescriptor} fractalGen - Fractal generator to use and its parameters
 * @property {number} [qMultiplier=4] - A multiplier for the first level distortion
 * @property {number} [rMultiplier=10] - A multiplier for the second level distortion
 * @property {boolean} [colored=false] - Put to true to have a colored image, else it will be B&W
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * Domain Warping Fractal Noise Generator
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @param {domainWarpingDescriptor} options - Set of parameters to configure the Domain Warping Fractal noise generation
 * @returns {(function(number, number): number)
 * |(function(number, number): {red: number, green: number, blue: number, alpha: number})}
 * RGBA quadruplet for coordinates (x, y), or the noise value for these coordinates if "get_noise" set to true
 */
function domainWarpingFractalGenerator(width, height, options) {

    const noiseGen    =   helpers.optionalParameter(options.fractalGen.fractalOptions.noiseGen, "perlin");
    const noiseSeed   =   helpers.optionalParameter(options.fractalGen.fractalOptions.noiseSeed, 42);
    const argsList    =   helpers.optionalParameter(options.fractalGen.fractalOptions.argsList, [ ]);
    const qMultiplier =   helpers.optionalParameter(options.qMultiplier, 4);
    const rMultiplier =   helpers.optionalParameter(options.rMultiplier, 4);
    const OCTAVES     =   helpers.optionalParameter(options.fractalGen.fractalOptions.octaves, 2);
    const PERSISTENCE =   helpers.optionalParameter(options.fractalGen.fractalOptions.persistence, 0.5);
    const LACUNARITY  =   helpers.optionalParameter(options.fractalGen.fractalOptions.lacunarity, 2);
    const INITIAL_AMPLITUDE   =   helpers.optionalParameter(options.fractalGen.fractalOptions.initial_amplitude, 1);
    const INITIAL_FREQUENCY   =   helpers.optionalParameter(options.fractalGen.fractalOptions.initial_frequency, 1);
    const COLORED             =   helpers.optionalParameter(options.colored, false);
    const GET_NOISE = helpers.optionalParameter(options.get_noise,false);


    let maxNoiseHeight = 1;
    let minNoiseHeight = -1;

    let fractal = fractalNoiseGenerator(width, height,
        {
            fractal: options.fractalGen.fractal,
            fractalOptions: {
                noiseGen: noiseGen,
                noiseSeed: noiseSeed,
                argsList: argsList,
                octaves: OCTAVES,
                persistence: PERSISTENCE,
                lacunarity: LACUNARITY,
                initial_amplitude: INITIAL_AMPLITUDE,
                initial_frequency: INITIAL_FREQUENCY,
                colored: false,
                get_noise: true
            }
        }
    );


    /**
     * Returns the noise value at given coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @returns {number} - noise value between -1 and 1
     */
    function getNoiseHeight(x, y) {
        // Offsets gotten from https://iquilezles.org/www/articles/warp/warp.htm
        let q =
            [
                fractal(x, y),
                fractal(x + 5.2, y + 1.3)
            ];

        let r =
            [
                fractal(x + qMultiplier * q[0] + 1.7, y + qMultiplier * q[0] + 9.2),
                fractal(x + qMultiplier * q[0] + 8.3, y + qMultiplier * q[0] + 2.8)
            ];

        return fractal(x + rMultiplier * r[0], y + rMultiplier * r[1]);
        //return fbmGenerator(x + 80*q[0], y + 80*q[1]);
    }


    /**
     * Returns a RGBA pixel according to a coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @returns {{red: number, green: number, blue: number, alpha: number}} - a RGBA pixel according to a Perlin Noise
     */
    function getPixelColor(x, y) {
        let v = getNoiseHeight(x, y);
        if (COLORED) {
            let R = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 20, 87);
            let G = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 45, 182);
            let B = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 70, 255);

            return colors.createColor(R, G, B, 255);
        } else {
            v = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 0, 255);
            return colors.createColor(v, v, v, 255);
        }
    }

    if (GET_NOISE)
        return (x, y) => helpers.changeRange(getNoiseHeight(x, y), minNoiseHeight, maxNoiseHeight, -1, 1);
    else
        return getPixelColor;
}

//////////////////////////////////////////

//////////////////////////////////////////
///////////// NOISE GENERATORS ///////////


const noiseGenerators =
    {
        whiteNoise  : singleColorRandomGenerator,
        perlinNoise : perlinNoiseGenerator,
        worleyNoise : worleyNoiseGenerator
    };


//////////////////////////////////////////

//////////////////////////////////////////
////////////// NOISE FRACTALS ////////////


const noiseFractals =
    {
        fractal     : fractalNoiseGenerator,
        warp        : domainWarpingFractalGenerator
    };


//////////////////////////////////////////


exports.noiseGenerators = noiseGenerators;
exports.noiseFractals   = noiseFractals;
