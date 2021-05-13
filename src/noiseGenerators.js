const helpers = require('./helpers.js');
const colors = require('./colors.js');

/**
 * @typedef {Object} whiteNoiseDescriptor
 * @property {number} [seed=42] - Random generator's seed
 * @property {boolean} [get_noise=false] - Returns a noise value in [-1, 1]
 */

/**
 * White Noise Generator
 * @param {whiteNoiseDescriptor} options - Set of optional parameters to configure the White noise generation
 * @returns {function(): {red, green, blue, alpha}}
 */
function singleColorRandomGenerator(options) {
    options = {
        seed: 42,
        get_noise: false,
        ...options
    };

    const random = helpers.makeRandom(options.seed);
    if (options.get_noise)
        return () => random();
    return () => colors.createColor((random() + 1) / 2 * 255, (random() + 1) / 2 * 255, (random() + 1) / 2 * 255, 255);
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
    options = {
        seed: 42,
        variant: "simplex",
        scale: 8,
        colored: false,
        get_noise: false,
        ...options
    };

    let gradients = {}; // Cache

    const pixelSizeWidth = width / options.scale;
    const pixelSizeHeight = height / options.scale;

    const random = helpers.makeRandom(options.seed);

    /**
     * Returns the type of distance to compute according to user's input
     * @returns {function} - Function to use to compute the noise value
     */
    function loadNoiseType(variant, seed) {
        if (variant === 'value')
            return valueNoise(random);
        else if (variant === 'gradient')
            return gradientNoise(random);
        else if (variant === 'simplex')
            return simplexNoise(seed);
        else
            throw Error(`${variant} is not a valid noise type. Valid noise types are 'value', 'gradient' and 'simplex'.`);
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
     * @param {function} randomValue - Function returning a random value in range ]-1, 1[
     * @returns {function} - Function returning a noise value for coordinates (x, y) according to a value noise
     */
    function valueNoise(randomValue) {

        /**
         * Computes the dot product of the distance and gradient vectors
         * @param {number} ix - Integer x coordinate to get gradient from
         * @param {number} iy - Integer y coordinate to get gradient from
         * @param {function} randomValue - Function returning a random value in range ]-1, 1[
         * @returns {number} - A value in range ]-1, 1[
         */
        function dotGridValue(ix, iy, randomValue) {
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
         * @param {function} randomValue - Function returning a random value in range ]-1, 1[
         * @returns {number} - The value noise value
         */
        function computeValue(x, y, randomValue) {
            // Determine grid cell coordinates
            const x0 = Math.floor(x);
            const x1 = x0 + 1;
            const y0 = Math.floor(y);
            const y1 = y0 + 1;

            // Determine interpolation weights
            const sx = x - x0;
            const sy = y - y0;

            // Interpolate between grid point gradients
            return interpolate(sy,
                interpolate(sx, dotGridValue(x0, y0, randomValue), dotGridValue(x1, y0, randomValue)),
                interpolate(sx, dotGridValue(x0, y1, randomValue), dotGridValue(x1, y1, randomValue)));
        }


        return (x, y) => computeValue(x, y, randomValue);
    }

    /**
     * Tools to compute gradient noise
     * @param {function} randomValue - Function returning a random value in range ]-1, 1[
     * @returns {function} - Function returning a noise value for coordinates (x, y) according to a gradient noise
     */
    function gradientNoise(randomValue) {

        /**
         * Returns a random 2D normalized vector
         * @param {function} randomValue - Function returning a random value in range ]-1, 1[
         * @returns {{x: number, y: number}} - Random vector
         */
        function randomGradient(randomValue) {
            const angle = (2 * Math.PI) * randomValue();
            return {x: Math.cos(angle), y: Math.sin(angle)}; // Polar coordinates, Norm = 1
        }


        /**
         * Computes the dot product of the distance and gradient vectors
         * @param {number} ix - Integer x coordinate to get gradient
         * @param {number} iy - Integer y coordinate to get gradient
         * @param {number} x - Input x coordinate
         * @param {number} y - Input y coordinate
         * @param {function} randomValue - Function returning a random value in range ]-1, 1[
         * @returns {number} - Value in range [-1, 1]
         */
        function dotGridGradient(ix, iy, x, y, randomValue) {
            // Get gradient from integer coordinate
            if (!gradients[[ix, iy]])
                gradients[[ix, iy]] = randomGradient(randomValue);

            // Compute the distance vector
            const dx = x - ix;
            const dy = y - iy;

            // Compute the dot-product (changeRange used to broaden spectrum)
            return helpers.changeRange(dx * gradients[[ix, iy]].x + dy * gradients[[ix, iy]].y, -0.7, 0.7, -1, 1);
        }


        /**
         * Compute the noise value for gradient noise
         * @param {number} x - x coordinate to compute the value from
         * @param {number} y - y coordinate to compute the value from
         * @param {function} randomValue - Function returning a random value in range ]-1, 1[
         * @returns {number} - The gradient noise value
         */
        function computeGradient(x, y, randomValue) {
            // Determine grid cell coordinates
            const x0 = Math.floor(x);
            const x1 = x0 + 1;
            const y0 = Math.floor(y);
            const y1 = y0 + 1;

            // Determine interpolation weights
            const sx = x - x0;
            const sy = y - y0;

            // Interpolate between grid point gradients
            return interpolate(sy,
                interpolate(sx, dotGridGradient(x0, y0, x, y, randomValue), dotGridGradient(x1, y0, x, y, randomValue)),
                interpolate(sx, dotGridGradient(x0, y1, x, y, randomValue), dotGridGradient(x1, y1, x, y, randomValue)));
        }


        return (x, y) => computeGradient(x, y, randomValue);
    }


    /**
     * Tools to compute simplex noise
     * @param {number} seed - Random generator's seed
     * @returns {function} - Function returning a noise value for coordinates (x, y) according to a simplex noise
     */
    function simplexNoise(seed) {
        const r = 0.5;

        // Skewing factors for 2D simplex grid
        const F2 = (Math.sqrt(3) - 1) / 2; // triangle to square
        const G2 = (3 - Math.sqrt(3)) / 6; // square to triangle

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
            const h = hash & 7;      // Convert low 3 bits of hash code
            const u = h < 4 ? x : y;  // into 8 simple gradient directions,
            const v = h < 4 ? y : x;  // and compute the dot product with (x,y).
            return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
        }


        /**
         * Returns skewed coordinate in 2D simplex grid
         * @param {number} x - Input x coordinate
         * @param {number} y - Input y coordinate
         * @returns {number[]} - Skewed (x, y) coordinates
         */
        function skew(x, y) {
            const s = (x + y) * F2; // 2D Hairy factor
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
            const us = (ixSkewed + iySkewed) * G2;
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
         * @param {number} seed - Random generator's seed
         * @returns {number} - The simplex noise value
         */
        function computeSimplex(x, y, seed) {
            // Coordinate Skewing

            // Skew the input space to determine which simplex cell we're in
            const [xSkewed, ySkewed] = skew(x, y);
            const ixSkewed = Math.floor(xSkewed);
            const iySkewed = Math.floor(ySkewed);

            // Simplicial subdivision

            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we're in.
            // Either the x internal coordinate is the largest, so it is added first, then followed by the y internal coordinate
            // Or the y internal coordinate is the largest, so it is added first, then followed by the x internal coordinate
            const [xi, yi] = [[0, 1], [1, 0]][+(xSkewed - ixSkewed > ySkewed - iySkewed)]; // Offsets for second (middle) corner of simplex in (i, j) coords

            // Gradient selection

            // Unskew the cell origin back to (x, y) space
            // The x, y distances from the cell origin
            const [xUnskewed, yUnskewed] = getUnskewedDisplacementVector(x, y, ixSkewed, iySkewed);

            // Adding (1,0) to unskewed coordinates implies adding (1 - G2, -G2) to input coordinates
            // Adding (0,1) to unskewed coordinates implies adding (-G2, 1 - G2) to input coordinates
            // Offsets with the first largest coordinate added
            const x1 = xUnskewed - xi + G2;
            const y1 = yUnskewed - yi + G2;

            // Offsets with the second largest coordinate added
            const x2 = xUnskewed - 1 + 2 * G2;
            const y2 = yUnskewed - 1 + 2 * G2;

            // Kernel summation

            // Majors the indices to 256, so as not to exceed the size of the array of permutations.
            const ii = (seed + ixSkewed) % 256;
            const jj = (seed + iySkewed) % 256;

            // Noise contributions from each of the three corners

            // Calculate the contribution from the three corners
            const f0 = falloff(xUnskewed, yUnskewed);
            const n0 = Math.max(0, f0) ** 4 * dotGridGradient(permutation[ii + permutation[jj]], xUnskewed, yUnskewed);

            // We add the largest coordinate
            const f1 = falloff(x1, y1);
            const n1 = Math.max(0, f1) ** 4 * dotGridGradient(permutation[ii + xi + permutation[jj + yi]], x1, y1);

            // Then we add the second largest coordinate
            const f2 = falloff(x2, y2);
            const n2 = Math.max(0, f2) ** 4 * dotGridGradient(permutation[ii + 1 + permutation[jj + 1]], x2, y2);

            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            const scaleFactor = 2916 * Math.sqrt(2) / 125;
            return scaleFactor * (n0 + n1 + n2);
        }


        return (x, y) => computeSimplex(x, y, seed);
    }


    /**
     * Returns the noise value at given coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @param {number} pixelSizeWidth - Width size of a pixel
     * @param {number} pixelSizeHeight - Height size of a pixel
     * @param {function} compute - Function returning a noise value for coordinates (x, y) according to a noise variant
     * @returns {number} - noise value between -1 and 1
     */
    function getNoiseHeight(x, y, pixelSizeWidth, pixelSizeHeight, compute) {
        return compute(x / pixelSizeWidth, y / pixelSizeHeight);
    }


    /**
     * Returns a RGBA pixel according to a coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @param {number} pixelSizeWidth - Width size of a pixel
     * @param {number} pixelSizeHeight - Height size of a pixel
     * @param {function} compute - Function returning a noise value for coordinates (x, y) according to a noise variant
     * @param {boolean} colored - Boolean specifying if the RGBA output should be colored
     * @returns {{red: number, green: number, blue: number, alpha: number}} - a RGBA pixel according to a Perlin Noise
     */
    function getPixelColor(x, y, pixelSizeWidth, pixelSizeHeight , compute, colored) {
        if (colored) {
            const v = (getNoiseHeight(x, y, pixelSizeWidth, pixelSizeHeight, compute) + 0.5) * 360;
            return colors.hsl2rgb(v);
        } else {
            const v = (getNoiseHeight(x, y, pixelSizeWidth, pixelSizeHeight, compute) + 1) / 2 * 255;
            return colors.createColor(v, v, v, 255);
        }
    }


    if (options.get_noise)
        return (x, y) => {
            const compute = loadNoiseType(options.variant, options.seed);
            return getNoiseHeight(x, y, pixelSizeWidth, pixelSizeHeight, compute);
        };
    else
        return (x, y) => {
            const compute = loadNoiseType(options.variant, options.seed);
            return getPixelColor(x, y, pixelSizeWidth, pixelSizeHeight, compute, options.colored);
        };
}


//////////////////////////////////////////

//////////////////////////////////////////
////////////// FRACTAL NOISE /////////////

/**
 * @typedef {Object} fractalOptionsDescriptor
 * @property {('perlin'|'worley')} [noiseGen='perlin'] - Noise generator to compute the noise with
 * @property {number} [noiseSeed=42] - Noise generator seed
 * @property {*[]} [argsList=[ ]] - Optional arguments for the noise generator, starting at the third argument of the noise generator function
 * @property {number} [octaves=2] - Number of frequency octaves to generate the noise with
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
 * @property {fractalOptionsDescriptor} fractalOptions - Parameters for the fractal noise generator
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
    options = {
        fractal: typeof(options.fractal) === 'undefined' ? 'fbm' : options.fractal,
        fractalOptions: {
            noiseGen: 'perlin',
            noiseSeed: 42,
            argsList: [],
            octaves: 2,
            persistence: 0.5,
            lacunarity: 2,
            initial_amplitude: 1,
            initial_frequency: 1,
            colored: false,
            get_noise: false,
            ...options.fractalOptions
        }
    };

    const noiseSeed = options.fractalOptions.noiseSeed;
    const argsList = options.fractalOptions.argsList;
    const OCTAVES = options.fractalOptions.octaves;
    const PERSISTENCE = options.fractalOptions.persistence;
    const LACUNARITY = options.fractalOptions.lacunarity;
    const INITIAL_AMPLITUDE = options.fractalOptions.initial_amplitude;
    const INITIAL_FREQUENCY = options.fractalOptions.initial_frequency;
    const COLORED = options.fractalOptions.colored;
    const GET_NOISE = options.fractalOptions.get_noise;


    let maxNoiseHeight;
    let minNoiseHeight;
    const [initial_noiseHeight, octaveNoiseTransformation] = loadArgFractalGen(options.fractal, options.fractalOptions.noiseGen);


    const octaveGenerator = getOctaveGenerator(options.fractalOptions.noiseGen);


    /**
     * Return the type of distance to compute according to user's input
     * @param {('fbm'|'turbulence'|'ridged')} fractalGen - Type of fractal noise to compute
     * @param {('perlin'|'worley')} noiseGen - Noise generator to compute the noise with
     * @returns {(number|(function({number}, {number})))[]}
     */
    function loadArgFractalGen(fractalGen, noiseGen) {
        if (fractalGen === 'fbm') {
            maxNoiseHeight = 1;
            minNoiseHeight = -1;
            return [0, (noiseValue, amplitude) => noiseValue * amplitude];
        } else if (fractalGen === 'turbulence') {
            maxNoiseHeight = 1;
            minNoiseHeight = 0;
            return [0, (noiseValue, amplitude) => Math.abs(noiseValue) * amplitude];
        } else if (fractalGen === 'ridged') {
            const visualClarityOffset = noiseGen === 'worley' ? OCTAVES / 10 : 0;

            maxNoiseHeight = -0.5 + visualClarityOffset;
            minNoiseHeight = -1;
            return [-1, (noiseValue, amplitude) => (1 - Math.abs(noiseValue)) ** 2 * amplitude];
        } else
            throw Error(`${fractalGen} is not a fractal generator. Valid fractal generator are 'fbm', 'turbulence' and 'ridged`);
    }


    /**
     * Returns a list of generator to use for each octave according to user's input
     * @param {('perlin'|'worley')} noiseGen - Noise generator to compute the noise with
     * @returns {function[]} - Array of generators for each of the octave
     */
    function getOctaveGenerator(noiseGen) {
        if (noiseGen === 'worley')
            return Array.from({length: OCTAVES}, (v, i) => worleyNoiseGenerator(width * (LACUNARITY ** i), height * (LACUNARITY ** i), {
                ...argsList,
                seed: i + noiseSeed,
                get_noise: true
            }));
        else if (noiseGen === 'perlin')
            return Array.from({length: OCTAVES}, () => perlinNoiseGenerator(width, height, {
                ...argsList,
                seed: noiseSeed,
                get_noise: true
            }));
        else if (noiseGen === 'white')
            return Array.from({length: OCTAVES}, () => singleColorRandomGenerator({
                seed: noiseSeed,
                get_noise: true
            }));
        else
            throw Error(`${noiseGen} is not a valid noise generator. Valid noise generators are 'worley' and 'perlin'`);
    }


    /**
     * Returns the noise value at given coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @param {function[]} octaveGenerator - Array of generators for each of the octave
     * @param {number} initial_noiseHeight - Initial noise height for the summation of octaves
     * @param {function({number}, {number})} octaveNoiseTransformation - Transformation to apply to the noise value and frequency
     * @param {number} octaves - Number of frequency octaves to generate the noise with
     * @param {number} persistence - A multiplier that determines how quickly the amplitude increases for each successive octave
     * @param {number} lacunarity - A multiplier that determines how quickly the frequency increases for each successive octave
     * @param {number} initial_amplitude - Initial amplitude for the first octave
     * @param {number} initial_frequency - Initial frequency for the first octave
     * @returns {number} - noise value between -1 and 1
     */
    function getNoiseHeight(x, y, octaveGenerator, initial_noiseHeight, octaveNoiseTransformation,
                            octaves, persistence, lacunarity, initial_amplitude, initial_frequency) {

        /**
         * Returns the noise value at given octave
         * @param {number} i - ith octave to compute the noise value from
         * @param {number} amplitude - Amplitude of the octave
         * @param {number} frequency - Frequency of the octave
         * @returns {number} - The noise value at the ith octave
         */
        function getOctaveValue(i, amplitude, frequency) {
            const sampleX = x * frequency;
            const sampleY = y * frequency;

            const noiseValue = octaveGenerator[i](sampleX, sampleY);

            return octaveNoiseTransformation(noiseValue, amplitude);
        }

        const noiseHeight = Array.from({length: octaves},
            (v, i) =>
                getOctaveValue(i, initial_amplitude * persistence ** (i + 1), initial_frequency * lacunarity ** i))
            .reduce((prev, curr) => prev + curr, initial_noiseHeight);

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
     * @param {function[]} octaveGenerator - Array of generators for each of the octave
     * @param {number} initial_noiseHeight - Initial noise height for the summation of octaves
     * @param {function({number}, {number})} octaveNoiseTransformation - Transformation to apply to the noise value and frequency
     * @param {number} octaves - Number of frequency octaves to generate the noise with
     * @param {number} persistence - A multiplier that determines how quickly the amplitude increases for each successive octave
     * @param {number} lacunarity - A multiplier that determines how quickly the frequency increases for each successive octave
     * @param {number} initial_amplitude - Initial amplitude for the first octave
     * @param {number} initial_frequency - Initial frequency for the first octave
     * @param {boolean} colored - Put to true to have a colored image, else it will be B&W
     * @returns {{red: number, green: number, blue: number, alpha: number}} - a RGBA pixel according to a Perlin Noise
     */
    function getPixelColor(x, y, octaveGenerator, initial_noiseHeight, octaveNoiseTransformation,
                           octaves, persistence, lacunarity, initial_amplitude, initial_frequency, colored) {
        const v = getNoiseHeight(x, y, octaveGenerator, initial_noiseHeight, octaveNoiseTransformation,
            octaves, persistence, lacunarity, initial_amplitude, initial_frequency);
        if (colored) {
            const R = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 20, 87);
            const G = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 45, 182);
            const B = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 70, 255);

            return colors.createColor(R, G, B, 255);
        } else {
            const v_rgb = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 0, 255);
            return colors.createColor(v_rgb, v_rgb, v_rgb, 255);
        }
    }

    if (GET_NOISE)
        return (x, y) => helpers.changeRange(getNoiseHeight(x, y, octaveGenerator, initial_noiseHeight, octaveNoiseTransformation,
            OCTAVES, PERSISTENCE, LACUNARITY, INITIAL_AMPLITUDE, INITIAL_FREQUENCY), minNoiseHeight, maxNoiseHeight, -1, 1);
    else
        return (x, y) => getPixelColor(x, y, octaveGenerator, initial_noiseHeight, octaveNoiseTransformation,
            OCTAVES, PERSISTENCE, LACUNARITY, INITIAL_AMPLITUDE, INITIAL_FREQUENCY, COLORED);
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
    options = {
        seed: 42,
        type: "f2 - f1",
        distance: "euclidean",
        three_dimensions: false,
        colored: false,
        number_of_points: width / 3,
        get_noise: false,
        ...options
    };

    const random = helpers.makeRandom(options.seed);

    const featurePoints = generateFeaturePoints(random, options.number_of_points);
    let distances = {}; // cache

    const distanceFormulas = loadArgDistance(options.distance);
    const distanceDimension = options.three_dimensions ? distanceFormulas.three_dim : distanceFormulas.two_dim;
    const getDist = loadArgType(options.type)(distanceDimension, options.number_of_points, featurePoints);

    /**
     * Get the type of distance to compute according to user's input
     * @param {('f1'|'f2'|'f2 - f1')} type - Type of distance to feature points to use
     * @returns {function(((function({number}, {number}, {number}, {number}): {number})
     * |(function({number}, {number}, {number}, {number}, {number}, {number}): {number})), {number}, {x: {number}, y: {number}, z: {number}}[])
     * : function({number}, {number}): {number}} - Distance expression to use
     */
    function loadArgType(type) {
        if (type === 'f1')
            return (distanceEval, number_of_points, featurePoints) => (x, y) => getNthNearestDistance(1, x, y, distanceEval, number_of_points, featurePoints);
        else if (type === 'f2 - f1')
            return (distanceEval, number_of_points, featurePoints) => (x, y) => getNthNearestDistance(2, x, y, distanceEval, number_of_points, featurePoints) - getNthNearestDistance(1, x, y, distanceEval, number_of_points, featurePoints);
        else if (type === 'f2')
            return (distanceEval, number_of_points, featurePoints) => (x, y) => getNthNearestDistance(2, x, y, distanceEval, number_of_points, featurePoints);
        else
            throw Error(`${type} is not a valid distance type. Valid distance types are 'f1', 'f2' and 'f2 - f1'`);
    }


    /**
     * Get the distance formula to use according to user's input
     * @param {('euclidean'|'manhattan'|'chebyshev')} distance - Distance formula to use
     * @returns {{two_dim: (function({number}, {number}, {number}, {number}): {number}),
     * three_dim: (function({number}, {number}, {number}, {number}, {number}, {number}): {number})}} - Distance formula to use
     */
    function loadArgDistance(distance) {
        if (distance === 'euclidean')
            return getDistanceEuclidean();
        else if (distance === 'manhattan')
            return getDistanceManhattan();
        else if (distance === 'chebyshev')
            return getDistanceChebyshev();
        else
            throw Error(`${distance} is not a valid distance formula. Distance formulas are 'euclidean', 'manhattan' and 'chebyshev'`);
    }


    /**
     * Tools to compute Chebyshev distances
     * @returns {{two_dim: (function(number, number, number, number): number),
     * three_dim: (function(number, number, number, number, number, number): number)}} - Two and Three dimensions formulas
     */
    function getDistanceChebyshev() {


        /**
         * Chebyshev distance between two points in a 2D plan
         * @param x1 - x coordinate of the first point
         * @param x2 - x coordinate of the second point
         * @param y1 - y coordinate of the first point
         * @param y2 - y coordinate of the second point
         * @returns {number} - Distances between the points
         */
        function getDistance2D(x1, x2, y1, y2) {
            const a = Math.abs(x1 - x2);
            const b = Math.abs(y1 - y2);

            return Math.max(a, b);
        }


        /**
         * Chebyshev distance between two points in a 3D volume
         * @param x1 - x coordinate of the first point
         * @param x2 - x coordinate of the second point
         * @param y1 - y coordinate of the first point
         * @param y2 - y coordinate of the second point
         * @param z1 - z coordinate of the first point
         * @param z2 - z coordinate of the second point
         * @returns {number} - Distances between the points
         */
        function getDistance3D(x1, x2, y1, y2, z1, z2) {
            const a = Math.abs(x1 - x2);
            const b = Math.abs(y1 - y2);
            const c = Math.abs(z1 - z2);

            return Math.max(a, b, c);
        }

        return {
            two_dim: getDistance2D,
            three_dim: getDistance3D
        };

    }


    /**
     * Tools to compute Manhattan distances
     * @returns {{two_dim: (function(number, number, number, number): number),
     * three_dim: (function(number, number, number, number, number, number): number)}} - Two and Three dimensions formulas
     */
    function getDistanceManhattan() {


        /**
         * Manhattan distance between two points in a 2D plan
         * @param x1 - x coordinate of the first point
         * @param x2 - x coordinate of the second point
         * @param y1 - y coordinate of the first point
         * @param y2 - y coordinate of the second point
         * @returns {number} - Distances between the points
         */
        function getDistance2D(x1, x2, y1, y2) {
            const a = Math.abs(x1 - x2);
            const b = Math.abs(y1 - y2);

            return a + b;
        }


        /**
         * Manhattan distance between two points in a 3D volume
         * @param x1 - x coordinate of the first point
         * @param x2 - x coordinate of the second point
         * @param y1 - y coordinate of the first point
         * @param y2 - y coordinate of the second point
         * @param z1 - z coordinate of the first point
         * @param z2 - z coordinate of the second point
         * @returns {number} - Distances between the points
         */
        function getDistance3D(x1, x2, y1, y2, z1, z2) {
            const a = Math.abs(x1 - x2);
            const b = Math.abs(y1 - y2);
            const c = Math.abs(z1 - z2);

            return a + b + c;
        }

        return {
            two_dim: getDistance2D,
            three_dim: getDistance3D
        };

    }


    /**
     * Tools to compute Euclidean distances
     * @returns {{two_dim: (function(number, number, number, number): number),
     * three_dim: (function(number, number, number, number, number, number): number)}} - Two and Three dimensions formulas
     */
    function getDistanceEuclidean() {


        /**
         * Euclidean distance between two points in a 2D plan
         * @param x1 - x coordinate of the first point
         * @param x2 - x coordinate of the second point
         * @param y1 - y coordinate of the first point
         * @param y2 - y coordinate of the second point
         * @returns {number} - Distances between the points
         */
        function getDistance2D(x1, x2, y1, y2) {
            const a = x1 - x2;
            const b = y1 - y2;

            return Math.sqrt(a * a + b * b);
        }


        /**
         * Euclidean distance between two points in a 3D volume
         * @param x1 - x coordinate of the first point
         * @param x2 - x coordinate of the second point
         * @param y1 - y coordinate of the first point
         * @param y2 - y coordinate of the second point
         * @param z1 - z coordinate of the first point
         * @param z2 - z coordinate of the second point
         * @returns {number} - Distances between the points
         */
        function getDistance3D(x1, x2, y1, y2, z1, z2) {
            const a = x1 - x2;
            const b = y1 - y2;
            const c = z1 - z2;

            return Math.sqrt(a * a + b * b + c * c);
        }

        return {
            two_dim: getDistance2D,
            three_dim: getDistance3D
        };
    }


    /**
     * Get a random positive integer
     * @param {number} max - Maximum value
     * @param {function} randomValue - Function returning a random value in range ]-1, 1[
     * @returns {number} - A random positive integer in range [0, max[
     */
    function getInt(max, randomValue) {
        return Math.floor(helpers.changeRange(randomValue(), -1, 1, 0, 1) * Math.floor(max));
    }


    /**
     * Randomly distribute feature points in a 3D volume
     * @param {function} randomValue - Function returning a random value in range ]-1, 1[
     * @param {number} number_of_points - Number of feature points
     * @returns {{x: number, y: number, z: number}[]} - Feature points coordinate in 3D space
     */
    function generateFeaturePoints(randomValue, number_of_points) {
        return Array.from({length: number_of_points + 1}, () => {
            return {x: getInt(width, randomValue), y: getInt(height, randomValue), z: getInt(width, randomValue)};
        });
    }


    /**
     * Get the nth nearest distance between a point (x, y) and all feature points
     * @param {number} n - nth nearest distance to get (superior or equal to 1)
     * @param {number} x - x coordinate of the point
     * @param {number} y - y coordinate of the point
     * @param {((function({number}, {number}, {number}, {number}): {number})
     * |(function({number}, {number}, {number}, {number}, {number}, {number}): {number}))} distanceEval - Function to evaluate distance to feature points
     * @param {number} number_of_points - Number of feature points
     * @param {{x: {number}, y: {number}, z: {number}}[]} featurePoints - Feature points coordinate in 3D space
     * @returns {{number}} - The distance between the point and the nth nearest feature point
     */
    function getNthNearestDistance(n, x, y, distanceEval, number_of_points, featurePoints) {
        if (distances[[x, y]])
            return distances[[x, y]][n - 1];

        // Get distances from the given location to each seed points
        const _distances = Array.from({length: number_of_points + 1},
            (v, i) => distanceEval(x, featurePoints[i].x, y, featurePoints[i].y, 0, featurePoints[i].z))
            .sort((d1, d2) => {
                return d1 - d2;
            });


        distances[[x, y]] = _distances.slice(0, 2); // Save only the first two distances, as these are the only one which may be useful
        return _distances[n - 1];
    }


    /**
     * Returns a RGBA pixel according to a coordinate
     * @param {number} x - x coordinate to compute the noise from
     * @param {number} y - y coordinate to compute the noise from
     * @param {function({number}, {number}): {number}} getDist - Distance expression to use
     * @param {boolean} colored - Put to true to have a colored image, else it will be B&W
     * @returns {{red: number, green: number, blue: number, alpha: number}} - a RGBA pixel according to a Perlin Noise
     */
    function getPixelColor(x, y, getDist, colored) {
        const distance = getDist(x, y);
        if (colored) {
            const R = helpers.changeRange(distance, 0, width / 6, 20, 74);
            const G = helpers.changeRange(distance, 0, width / 6, 45, 154);
            const B = helpers.changeRange(distance, 0, width / 6, 70, 216);

            return colors.createColor(R, G, B, 255);
        } else {
            const noiseValue = helpers.changeRange(distance, 0, width / 7, 0, 255);

            return colors.createColor(noiseValue, noiseValue, noiseValue, 255);
        }
    }


    if (options.get_noise)
        return (x, y) => helpers.changeRange(getDist(x, y), 0, width / 7, -2, 2);
    return (x, y) => getPixelColor(x, y, getDist, options.colored);
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

    if (typeof (options.fractalGen) === 'undefined')
        options.fractalGen = {fractalOptions: {}};
    options = {
        qMultiplier: 4,
        rMultiplier: 4,
        colored: false,
        get_noise: false,
        ...options
    };
    const qMultiplier = options.qMultiplier;
    const rMultiplier = options.rMultiplier;
    const COLORED = options.colored;
    const GET_NOISE = options.get_noise;


    const maxNoiseHeight = 1;
    const minNoiseHeight = -1;

    const fractal = fractalNoiseGenerator(width, height,
        {
            fractal: options.fractalGen.fractal,
            fractalOptions: {
                ...options.fractalGen.fractalOptions,
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
        const q =
            [
                fractal(x, y),
                fractal(x + 5.2, y + 1.3)
            ];

        const r =
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
        const v = getNoiseHeight(x, y);
        if (COLORED) {
            const R = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 20, 87);
            const G = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 45, 182);
            const B = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 70, 255);

            return colors.createColor(R, G, B, 255);
        } else {
            const v_rgb = helpers.changeRange(v, minNoiseHeight, maxNoiseHeight, 0, 255);
            return colors.createColor(v_rgb, v_rgb, v_rgb, 255);
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
        whiteNoise: singleColorRandomGenerator,
        perlinNoise: perlinNoiseGenerator,
        worleyNoise: worleyNoiseGenerator
    };


//////////////////////////////////////////

//////////////////////////////////////////
////////////// NOISE FRACTALS ////////////


const noiseFractals =
    {
        fractal: fractalNoiseGenerator,
        warp: domainWarpingFractalGenerator
    };


//////////////////////////////////////////


exports.noiseGenerators = noiseGenerators;
exports.noiseFractals = noiseFractals;
