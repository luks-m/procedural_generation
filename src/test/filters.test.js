const filters = require('./../filters.js');
const generators = require('./../generators.js');
const colors = require('./../colors.js');

function test_gaussian_blur() {

    describe('Gaussian Blur tests', () => {
        /*
            test('Test of even kernel size', () => {
                expect(filters.createKernel(
                {
                    kernelSize : 10,
                    sigma : 1.5
                }
                )).toThrow(Error);
            });
        */
        //Initialization of the unfiltered andfiltered pixel
        const unfiltered_pixel = generators.noiseGenerator(
            {
                noise: generators.noise.noiseGenerators.perlinNoise,
                noiseOptions: {
                    width: 250,
                    height: 250,
                    seed: 1338,
                    variant: 'simplex'
                }
            }
        );

        const kernel = filters.createKernel(
            {
                kernelSize: 5,
                sigma: 1.5
            });

        const filtered_pixel = filters.gaussianBlur(
            {
                src: unfiltered_pixel,
                kernel: kernel,
                kernelSize: 5
            });

        //Tests on the pixels
        test('Test value of pixels', () => {
            //expect(filtered_pixel(0,0)).toEqual(colors.createColor(,,,));
            expect(filtered_pixel(31, 45)).toEqual(colors.createColor(64, 64, 64, 211));
            //expect(filtered_pixel(200,250)).toEqual(colors.createColor(,,,));
            //expect(filtered_pixel(211,89)).toEqual(colors.createColor(,,,));
            //expect(filtered_pixel(250,126)).toEqual(colors.createColor(,,,));
        });
    });
}

test_gaussian_blur();
