const filters = require('./../filters.js');
const generators = require('./../generators.js');
const colors = require('./../colors.js');

function test_gaussian_blur() {

    describe('Gaussian Blur tests', () => {
            test('Test of even kernel size', () => {
                expect(() => filters.createKernel(
                {
                    kernelSize : 10,
                    sigma : 1.5
                }
                )).toThrow(Error);
            });
	
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
                kernelSize: 3,
                sigma: 1.5
            });

        const filtered_pixel = filters.gaussianBlur(
            {
                src: unfiltered_pixel,
                kernel: kernel,
                kernelSize: 3
            });

        //Tests on the pixels
        test('Test value of pixels', () => {
            expect(filtered_pixel(0,0)).toEqual(colors.createColor(60,60,60,122));
            expect(filtered_pixel(31, 45)).toEqual(colors.createColor(39,39,39,122));
            expect(filtered_pixel(250,250)).toEqual(colors.createColor(33,33,33,122));
            expect(filtered_pixel(250,89)).toEqual(colors.createColor(43,43,43,122));
            expect(filtered_pixel(114,250)).toEqual(colors.createColor(94,94,94,122));
        });
    });
}

test_gaussian_blur();
