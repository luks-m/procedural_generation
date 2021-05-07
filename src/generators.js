
const noiseGenerators = require('./noiseGenerators.js');
const tilingGenerators = require('./tilingGenerators.js');
const colorMapGenerator = require('./colorMapGenerator.js');


/**
 * @typedef {Object} noiseDescriptor
 * @property {function} noise - Noise generator
 * @property {Object} noiseOptions - Set of parameters to configure the noise
 */

/**
 * @typedef {Object} fractalNoiseDescriptor
 * @property {function} fractal - Fractal Noise generator
 * @property {Object} fractalOptions - Set of parameters to configure the fractal noise
 */

/**
 * Generic Noise Generator (White, Perlin, Worley) & Fractal Generator (FBM, Turbulence & Ridged)
 * @param {(noiseDescriptor|fractalNoiseDescriptor)} options - Set of parameters to configure the noise
 * @returns {function} - Noise generator function according to given parameters
 */
function noiseGenerator(options) {
    const width = options.noiseOptions.width;
    const height = options.noiseOptions.height;
    if (typeof(width) !== "number" || typeof(height) !== "number")
        throw Error(`TypeError: Please provide valid width and height values.`);

    return options.noise(width, height, options.noiseOptions);
}

exports.tilings = tilingGenerators;
exports.noise = noiseGenerators;
exports.colorMap = colorMapGenerator;
exports.noiseGenerator = noiseGenerator;