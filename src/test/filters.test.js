const filters = require('./../filters.js');
const generators = require('./../generators.js');
const colors = require('./../colors.js');

function test_gaussian_blur() {

    describe('Gaussian Blur tests', () => {
        test('Test of even kernel size', () => {
            expect(() => filters.createKernel(
                {
                    kernelSize: 10,
                    sigma: 1.5
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
            expect(filtered_pixel(0, 0)).toEqual(colors.createColor(60, 60, 60, 122));
            expect(filtered_pixel(31, 45)).toEqual(colors.createColor(39, 39, 39, 122));
            expect(filtered_pixel(250, 250)).toEqual(colors.createColor(33, 33, 33, 122));
            expect(filtered_pixel(250, 89)).toEqual(colors.createColor(43, 43, 43, 122));
            expect(filtered_pixel(114, 250)).toEqual(colors.createColor(94, 94, 94, 122));
        });
    });
}

function test_mirror() {
    describe('Mirror filter Tests', () => {
        const image = generators.tilings.checkerboard({pixelPerCase: 62, color1: colors.examples.RED, color2: colors.examples.BLUE});
        const width = 250;
        const height = 250;
        test('Wrong parameters', () => {
            const wrongOptions = {src: image, axe: "yx", width: width, height: height};
            const filterToTest = filters.mirror(wrongOptions);
            expect(filterToTest(0, 0)).toEqual(image(0,0));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width, 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width, 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width, height));
        });

        test('Mirror on x axis', () => {
            const options = { src: image, axe: "x", width: width, height: height};
            const filterToTest = filters.mirror(options);
            expect(filterToTest(0, 0)).toEqual(image(width , 0));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(width  - 0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(width  - 0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(width  - 0.5 * width, 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(width  - 0.75 * width, 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(width  - 0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width  - width, height));
        });

        test('Mirror on y axis', () => {
            const options = { src: image, axe: "y", width: width, height: height};
            const filterToTest = filters.mirror(options);
            expect(filterToTest(0, 0)).toEqual(image(0, height ));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, height  - 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, height  - 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width, height  - 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width, height  - 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, height  - 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width, height  - height));
        });

        test('Mirror on xy axis', () => {
            const options = { src: image, axe: "xy", width: width, height: height};
            const filterToTest = filters.mirror(options);
            expect(filterToTest(0, 0)).toEqual(image(width, height));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(width - 0.15 * width, height  - 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(width - 0.15 * width, height  - 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(width  - 0.5 * width, height  - 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(width  - 0.75 * width, height  - 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(width  - 0.75 * width, height  - 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width  - width, height  - height));
        });
    });
}
function test_clear() {
    describe('Clear filter Tests', () => {
        const image = generators.tilings.checkerboard({ pixelPerCase: 62, color1: colors.examples.RED, color2: colors.examples.BLUE });
        const width = 250;
        const height = 250;
        test('Should return a transparent image', () => {
            const options = { src: image };
            const filterToTest = filters.clear(options);
            expect(filterToTest(0, 0)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(width, height)).toEqual(colors.examples.TRANSPARENT);
        });

        test('Should return an image with transparent color only for certain value', () => {
            const toClear = (x, y) => {
                return (x === width/2 && y === height/2) || (x < 0.15 * width && y < 0.15 * height) || (x >= 0.75 * width && y >= 0.75 * height);
            }
            const options = { src: image, toClear: toClear };
            const filterToTest = filters.clear(options);
            expect(filterToTest(0, 0)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(colors.examples.TRANSPARENT);
        });
    });
}
function test_bulge() {

    describe('Bulge filter effect Tests', () => {
        const image = generators.tilings.checkerboard({ pixelPerCase: 62, color1: colors.examples.RED, color2: colors.examples.BLUE });
        const width = 250;
        const height = 250;
        test('Test bulge default value', () => {
            const options = { src: image };
            const filterToTest = filters.bulge(options);
            expect(filterToTest(0, 0)).toEqual(image(0, 0));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width, 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width, 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width, height));
        });

        test('Test bulge with implosion coef', () => {
            const options = { src: image, size: {width: 250, height: 250}, bulge: {x: 0.25, y: 0.25}, coef : -0.5};
            const filterToTest = filters.bulge(options);
            expect(filterToTest(0, 0)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(colors.createColor(0, 0, 255, 255));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(colors.createColor(0, 0, 255, 255));
            expect(filterToTest(width, height)).toEqual(colors.createColor(255, 0, 0, 255));
        });

        test('Test bulge with explosion coef', () => {
            const options = { src: image, size: { width: 250, height: 250 }, bulge: { x: 0.25, y: 0.25 }, coef: 0.5 };
            const filterToTest = filters.bulge(options);
            expect(filterToTest(0, 0)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(colors.createColor(0, 0, 255, 255));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(colors.createColor(0, 0, 255, 255));
            expect(filterToTest(width, height)).toEqual(colors.createColor(255, 0, 0, 255));
        });
    });
}
function test_transform() {

    describe('txt', () => {
        test('txt', () => {
            expect().toThrow(Error);
        });

        test('txt', () => {
            expect().toEqual(colors.createColor(60, 60, 60, 122));
            expect().toEqual(colors.createColor(39, 39, 39, 122));
            expect().toEqual(colors.createColor(33, 33, 33, 122));
        });
    });
}
function test_pixelate() {

    describe('txt', () => {
        test('txt', () => {
            expect().toThrow(Error);
        });

        test('txt', () => {
            expect().toEqual(colors.createColor(60, 60, 60, 122));
            expect().toEqual(colors.createColor(39, 39, 39, 122));
            expect().toEqual(colors.createColor(33, 33, 33, 122));
        });
    });
}
function test_limit() {

    describe('txt', () => {
        test('txt', () => {
            expect().toThrow(Error);
        });

        test('txt', () => {
            expect().toEqual(colors.createColor(60, 60, 60, 122));
            expect().toEqual(colors.createColor(39, 39, 39, 122));
            expect().toEqual(colors.createColor(33, 33, 33, 122));
        });
    });
}
function test_negative() {

    describe('txt', () => {
        test('txt', () => {
            expect().toThrow(Error);
        });

        test('txt', () => {
            expect().toEqual(colors.createColor(60, 60, 60, 122));
            expect().toEqual(colors.createColor(39, 39, 39, 122));
            expect().toEqual(colors.createColor(33, 33, 33, 122));
        });
    });
}


test_gaussian_blur();
test_mirror();
test_clear();
// test_bulge();
// test_transform();
// test_pixelate();
// test_limit();
// test_negative();
