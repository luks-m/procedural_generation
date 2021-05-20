
const noiseGenerators = require('./noiseGenerators.js');
const tilingGenerators = require('./tilingGenerators.js');
const colorMapGenerator = require('./colorMapGenerator.js');

/**
 * Currification of a FilterDescriptor object
 * @type {function(Function): function({}): function(number): function(FiltersDescriptor): FiltersDescriptor} filter: options: index: otherFilters
 * @param {Function} filter a filter function
 * @param {{}} options Set of options to pass to the filter function
 * @param {number} index Index of the filter function (determine the order to apply the different filter)
 * @param {FiltersDescriptor} otherFilters Adding othersFilters to this FiltersDescriptors
 */
function filtersDescriptorHelper(filter) {
    return (options = {}) => {
        return (index) => {
            return (otherFilters = {}) => {
                const _filters = {...otherFilters};
                _filters[index] = {filter: filter, filter_options: options};
                return _filters;
            };
        };
    };
}

/**
 * Currification of an ImageDescriptor object
 * @type {function(Function): function({}): function(FiltersDescriptor): ImageDescriptor} generator: options: filters
 * @param {Function} generator a generator function
 * @param {{}} options Set of options to pass to the generator function
 * @param {FiltersDescriptor} filters Adding the filters related with this image to this FiltersDescriptors
 */
function imageDescriptorHelper(generator) {
    return (options) => {
        return (filters=undefined) => {
            return {
                img: generator,
                options: options,
                filters: filters
            };
        };
    };
}

/**
 * @typedef {Object} FiltersDescriptor
 * @property {{filter: Function, filter_options: {}}} number - Number assuring the order to apply a filter
 */

/**
 * @typedef {Object} ImageDescriptor
 * @property {Function} img - Function representing an image
 * @property {{}} options - Set of parameters to configure the img function (Optional)
 * @property {FiltersDescriptor} filters - Set of filters to apply to the image (Optional)
 */

/**
 * @typedef {Object} Linker
 * @property {Function} composition - Function to apply a composition of two images
 * @property {{}} options - Set of parameters to configure the composition function
 */

/**
 * @typedef {Object} Descriptor
 * @property {ImageDescriptor} src - ImageDescriptor representing a source image
 * @property {Linker} linker - Linker containing a linker function used to link src and dst (Optional)
 * @property {Descriptor} dst - Descriptor representing the destination image to link with the source image (Optional)
 * @property {FiltersDescriptor} filters - Set of filters to apply to the resulting image (Optional)
 */

/**
 * Generate a generator depending on at least one image function
 * Can be used to apply multiple generator, linker and filters in order to create a generator
 * @param {Descriptor} descriptor 
 * @returns {function} - The generator function according to the given parameters
 */
function generate(descriptor) {
    const _descriptor = {
        src: { img: tilingGenerators.solid, options: {}, filters: undefined },
        linker: undefined,
        dst: undefined,
        filters: undefined,
        ...descriptor
    };
    let generator = _descriptor.src.img(_descriptor.src.options);
    
    function apply(dictionary, generator) {
        return Object.values(dictionary).reduce((accumulator, value) => {
            return value.filter({...value.filter_options, src: accumulator});
        }, generator);
    }
    // Apply filters to src if they are descibed in _descriptor.src.filters
    if (_descriptor.src.filters !== undefined) {
        generator = apply(_descriptor.src.filters, generator);
    }
    // generate the dst image if a linker between src and dst is described and if dst is defined
    if (_descriptor.dst !== undefined && _descriptor.linker !== undefined) {
        generator = _descriptor.linker.composition({ ..._descriptor.linker.options, src: generator, dst: generate(_descriptor.dst) });
    }
    // Apply filters to the result if they are descibed in _descriptor.filters
    if (_descriptor.filters !== undefined) {
        generator = apply(_descriptor.filters, generator);
    }
    return generator;
}

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
exports.generate = generate;
exports.filtersDescriptorHelper = filtersDescriptorHelper;
exports.imageDescriptorHelper = imageDescriptorHelper;