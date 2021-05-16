const filters = require('./../filters.js');
const generators = require('./../generators.js');
const colors = require('./../colors.js');

function test__gaussian_blur() {
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
        const unfilteredPixel = generators.noiseGenerator(
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

        const filteredPixel = filters.gaussianBlur(
            {
                src: unfilteredPixel,
                kernel: kernel,
                kernelSize: 3
            }
        );

        //Tests on the pixels
        test('Test value of pixels', () => {
            expect(filteredPixel(0, 0)).toEqual(colors.createColor(60, 60, 60, 122));
            expect(filteredPixel(31, 45)).toEqual(colors.createColor(39, 39, 39, 122));
            expect(filteredPixel(250, 250)).toEqual(colors.createColor(33, 33, 33, 122));
            expect(filteredPixel(250, 89)).toEqual(colors.createColor(43, 43, 43, 122));
            expect(filteredPixel(114, 250)).toEqual(colors.createColor(94, 94, 94, 122));
        });
    });
}

function test_mirror() {
    describe('Mirror filter Tests', () => {
        const image = generators.tilings.checkerboard({ pixelPerCase: 62, color1: colors.examples.RED, color2: colors.examples.BLUE });
        const width = 250;
        const height = 250;
        test('Wrong parameters', () => {
            const wrongOptions = { src: image, axe: "yx", width: width, height: height };
            const filterToTest = filters.mirror(wrongOptions);
            expect(filterToTest(0, 0)).toEqual(image(0, 0));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width, 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width, 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width, height));
        });

        test('Mirror on x axis', () => {
            const options = { src: image, axe: "x", width: width, height: height };
            const filterToTest = filters.mirror(options);
            expect(filterToTest(0, 0)).toEqual(image(width, 0));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(width - 0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(width - 0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(width - 0.5 * width, 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(width - 0.75 * width, 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(width - 0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width - width, height));
        });

        test('Mirror on y axis', () => {
            const options = { src: image, axe: "y", width: width, height: height };
            const filterToTest = filters.mirror(options);
            expect(filterToTest(0, 0)).toEqual(image(0, height));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, height - 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, height - 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width, height - 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width, height - 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, height - 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width, height - height));
        });

        test('Mirror on xy axis', () => {
            const options = { src: image, axe: "xy", width: width, height: height };
            const filterToTest = filters.mirror(options);
            expect(filterToTest(0, 0)).toEqual(image(width, height));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(width - 0.15 * width, height - 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(width - 0.15 * width, height - 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(width - 0.5 * width, height - 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(width - 0.75 * width, height - 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(width - 0.75 * width, height - 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width - width, height - height));
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
                return (x === width / 2 && y === height / 2) || (x < 0.15 * width && y < 0.15 * height) || (x >= 0.75 * width && y >= 0.75 * height);
            };
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
            const options = { src: image, size: { width: 250, height: 250 }, bulge: { x: 0.25, y: 0.25 }, coef: -0.5 };
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
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(colors.createColor(255, 0, 0, 255));
            expect(filterToTest(width, height)).toEqual(colors.createColor(255, 0, 0, 255));
        });

        test('Test bulge implosion => explosion should be egal to image', () => {
            const optionsFilter = { src: image, size: { width: 250, height: 250 }, bulge: { x: 0.25, y: 0.25 }, coef: -0.5 };
            const filter = filters.bulge(optionsFilter);
            const optionsFilterToTest = { src: filter, size: { width: 250, height: 250 }, bulge: { x: 0.25, y: 0.25 }, coef: 0.98 };
            const filterToTest = filters.bulge(optionsFilterToTest);
            expect(filterToTest(0, 0)).toEqual(image(0, 0));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width, 0.15 * height));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width, 0.75 * height));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width, 0.5 * height));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width, 0.75 * height));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width, 0.15 * height));
            expect(filterToTest(width, height)).toEqual(image(width, height));
        });
    });
}

function test_transform() {

    describe('Transform filter Tests', () => {
        const width = 250;
        const height = 250;
        const image = generators.tilings.voronoiRandom({ width: width, height: height, number: 50 });
        test('Transform used as an image translation', () => {
            const options = { src: image, size: { width: width, height: height }, offset: { x: 25, y: -10 } };
            const filterToTest = filters.transform(options);
            expect(filterToTest(0, 0)).toEqual(image(0 + options.offset.x, 0 + options.offset.y));
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(0.15 * width + options.offset.x, 0.15 * height + options.offset.y));
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(0.15 * width + options.offset.x, 0.75 * height + options.offset.y));
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(0.5 * width + options.offset.x, 0.5 * height + options.offset.y));
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(0.75 * width + options.offset.x, 0.75 * height + options.offset.y));
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(0.75 * width + options.offset.x, 0.15 * height + options.offset.y));
            expect(filterToTest(width, height)).toEqual(image(width + options.offset.x, height + options.offset.y));
        });

        test('Transform used as an image rotation', () => {
            const options = { src: image, size: { width: width, height: height }, angle: 90 };
            const filterToTest = filters.transform(options);

            const cos = Math.cos(options.angle * Math.PI / 180);
            const sin = Math.sin(options.angle * Math.PI / 180);
            function rotate(x, y) {
                // translate point back to origin:
                x -= width / 2;
                y -= height / 2;
                // rotate point
                const xnew = x * cos - y * sin;
                const ynew = x * sin + y * cos;
                // translate point back:
                x = xnew + width / 2;
                y = ynew + height / 2;
                return [x, y];
            }
            let [x, y] = rotate(0, 0);
            expect(filterToTest(0, 0)).toEqual(image(x, y));
            [x, y] = rotate(0.15 * width, 0.15 * height);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = rotate(0.15 * width, 0.75 * height);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = rotate(0.5 * width, 0.5 * height);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(x, y));
            [x, y] = rotate(0.75 * width, 0.75 * height);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = rotate(0.75 * width, 0.15 * height);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = rotate(width, height);
            expect(filterToTest(width, height)).toEqual(image(x, y));
        });

        test('Transform used as an image scaling', () => {
            const options = { src: image, size: { width: width, height: height }, scale: { x: 0.5, y: 0.5 } };
            const filterToTest = filters.transform(options);

            const scaleX = 1 / options.scale.x;
            const scaleY = 1 / options.scale.y;
            function scale(x, y) {
                x = (x - width / 2) * scaleX + width / 2;
                y = (y - height / 2) * scaleY + height / 2;
                return [x, y];
            }
            let [x, y] = scale(0, 0);
            expect(filterToTest(0, 0)).toEqual(image(x, y));
            [x, y] = scale(0.15 * width, 0.15 * height);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = scale(0.15 * width, 0.75 * height);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = scale(0.5 * width, 0.5 * height);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(x, y));
            [x, y] = scale(0.75 * width, 0.75 * height);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = scale(0.75 * width, 0.15 * height);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = scale(width, height);
            expect(filterToTest(width, height)).toEqual(image(x, y));
        });
    });
}

function test_pixelate() {

    describe('Pixelate filter Tests', () => {
        const width = 250;
        const height = 250;
        const image = generators.tilings.voronoiRandom({ width: width, height: height, number: 50 });
        test('Pixelate with normal size of pixel should return the source image', () => {
            const options = { src: image, size: { x: 1, y: 1 } };
            const filterToTest = filters.pixelate(options);

            let [x, y] = [0, 0];
            expect(filterToTest(0, 0)).toEqual(image(x, y));
            [x, y] = [Math.floor(0.15 * width), Math.floor(0.15 * height)];
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = [Math.floor(0.15 * width), Math.floor(0.75 * height)];
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = [Math.floor(0.5 * width), Math.floor(0.5 * height)];
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(x, y));
            [x, y] = [Math.floor(0.75 * width), Math.floor(0.75 * height)];
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = [Math.floor(0.75 * width), Math.floor(0.15 * height)];
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = [width, height];
            expect(filterToTest(width, height)).toEqual(image(x, y));
        });

        test('Pixelate with a differente size of pixel in x and y', () => {
            const options = { src: image, size: { x: 400, y: 2 }, };
            const filterToTest = filters.pixelate(options);

            function rightPixel(x, y) {
                // pixel = new pixel size * ratio of x by new pixel size
                x = options.size.x * Math.floor(x / options.size.x);
                y = options.size.y * Math.floor(y / options.size.y);
                return [x, y];
            }
            let [x, y] = rightPixel(0, 0);
            expect(filterToTest(0, 0)).toEqual(image(x, y));
            [x, y] = rightPixel(0.15 * width, 0.15 * height);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = rightPixel(0.15 * width, 0.75 * height);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = rightPixel(0.5 * width, 0.5 * height);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(x, y));
            [x, y] = rightPixel(0.75 * width, 0.75 * height);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = rightPixel(0.75 * width, 0.15 * height);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = rightPixel(width, height);
            expect(filterToTest(width, height)).toEqual(image(x, y));
        });
    });
}

function test_limit() {

    describe('Limit filter Tests', () => {
        const image = generators.tilings.checkerboard({ pixelPerCase: 62, color1: colors.examples.RED, color2: colors.examples.BLUE });
        const width = 250;
        const height = 250;
        test('limit to the current size of the image', () => {
            const options = { src: image, xlim: { min: 0, max: width }, ylim: { min: 0, max: height } };
            const filterToTest = filters.limit(options);
            let pixelColor = image(0, 0);
            expect(filterToTest(0, 0)).toEqual(pixelColor);

            pixelColor = image(0.15 * width, 0.15 * height);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(pixelColor);

            pixelColor = image(0.15 * width, 0.75 * height);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(pixelColor);

            pixelColor = image(0.5 * width, 0.5 * height);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(pixelColor);

            pixelColor = image(0.75 * width, 0.75 * height);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(pixelColor);

            pixelColor = image(0.75 * width, 0.15 * height);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(pixelColor);

            pixelColor = image(width, height);
            expect(filterToTest(width, height)).toEqual(pixelColor);
        });

        test('limit to half the current size of the image', () => {
            const options = { src: image, xlim: { min: 0, max: width / 2 }, ylim: { min: 0, max: height } };
            const filterToTest = filters.limit(options);
            let pixelColor = image(0, 0);
            expect(filterToTest(0, 0)).toEqual(pixelColor);

            pixelColor = image(0.15 * width, 0.15 * height);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(pixelColor);

            pixelColor = image(0.15 * width, 0.75 * height);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(pixelColor);

            pixelColor = image(0.5 * width, 0.5 * height);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(pixelColor);

            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(colors.examples.TRANSPARENT);
            expect(filterToTest(width, height)).toEqual(colors.examples.TRANSPARENT);
        });
    });
}

function test_negative() {

    describe('Negative filter Tests', () => {
        const image = generators.tilings.checkerboard({ pixelPerCase: 62, color1: colors.examples.RED, color2: colors.examples.BLUE });
        const width = 250;
        const height = 250;
        test('Correct negative colors', () => {
            const options = { src: image };
            const filterToTest = filters.negative(options);

            let pixelColor = image(0, 0);
            expect(filterToTest(0, 0)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));

            pixelColor = image(0.15 * width, 0.15 * height);
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));

            pixelColor = image(0.15 * width, 0.75 * height);
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));

            pixelColor = image(0.5 * width, 0.5 * height);
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));

            pixelColor = image(0.75 * width, 0.75 * height);
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));

            pixelColor = image(0.75 * width, 0.15 * height);
            expect(filterToTest(0.75 * width, 0.15 * height)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));

            pixelColor = image(width, height);
            expect(filterToTest(width, height)).toEqual(colors.createColor(255 - pixelColor.red, 255 - pixelColor.green, 255 - pixelColor.blue, pixelColor.alpha));
        });
    });
}

function test__setOpacity() {
    describe('Opacity changer tests', () => {

        const unfilteredPixel = generators.noiseGenerator(
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

        test('Test of adding a value to the opacity', () => {
            const filteredPixel = filters.setOpacity(
                {
                    src: unfilteredPixel,
                    coef: 1,
                    opacity: 20
                }
            );
            expect(filteredPixel(0, 0).alpha).toEqual((unfilteredPixel(0, 0).alpha + 20) % 256);
            expect(filteredPixel(0, 0).red).toEqual(unfilteredPixel(0, 0).red);
            expect(filteredPixel(0, 0).green).toEqual(unfilteredPixel(0, 0).green);
            expect(filteredPixel(0, 0).blue).toEqual(unfilteredPixel(0, 0).blue);
            expect(filteredPixel(50, 89).alpha).toEqual((unfilteredPixel(50, 89).alpha + 20) % 256);
        });

        test('Test of multiplying by a coefficient', () => {
            const filteredPixel = filters.setOpacity(
                {
                    src: unfilteredPixel,
                    coef: 2,
                    opacity: 0
                }
            );
            expect(filteredPixel(0, 0).alpha).toEqual((unfilteredPixel(0, 0).alpha * 2) % 256);
            expect(filteredPixel(0, 0).red).toEqual(unfilteredPixel(0, 0).red);
            expect(filteredPixel(0, 0).green).toEqual(unfilteredPixel(0, 0).green);
            expect(filteredPixel(0, 0).blue).toEqual(unfilteredPixel(0, 0).blue);
            expect(filteredPixel(50, 89).alpha).toEqual((unfilteredPixel(50, 89).alpha * 2) % 256);
        });

        test('Test of multiplying by a coefficient', () => {
            const filteredPixel = filters.setOpacity(
                {
                    src: unfilteredPixel,
                    coef: 2,
                    opacity: 50
                }
            );
            expect(filteredPixel(0, 0).alpha).toEqual((unfilteredPixel(0, 0).alpha * 2 + 50) % 256);
            expect(filteredPixel(0, 0).red).toEqual(unfilteredPixel(0, 0).red);
            expect(filteredPixel(0, 0).green).toEqual(unfilteredPixel(0, 0).green);
            expect(filteredPixel(0, 0).blue).toEqual(unfilteredPixel(0, 0).blue);
            expect(filteredPixel(50, 89).alpha).toEqual((unfilteredPixel(50, 89).alpha * 2 + 50) % 256);
        });
    });
}

function test__changeRGBAColor() {
    describe('Color changer tests', () => {
        const unfilteredPixel = generators.noiseGenerator(
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

        test('Test of changeRGBAColor without changes', () => {
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                })(0, 0)).toEqual(unfilteredPixel(0, 0));
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                })(250, 250)).toEqual(unfilteredPixel(250, 250));
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                })(0, 0)).toEqual(unfilteredPixel(0, 0));
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                })(89, 158)).toEqual(unfilteredPixel(89, 158));
        });

        test('Test of changeRGBAColor with 3 changes over 4', () => {
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                    red: 126,
                    blue: 158,
                    alpha: 255
                })(0, 0)).toEqual(colors.createColor(126, unfilteredPixel(0, 0).green, 158, 255));
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                    red: 126,
                    blue: 158,
                    alpha: 255
                })(54, 89)).toEqual(colors.createColor(126, unfilteredPixel(54, 89).green, 158, 255));
            expect(filters.changeRGBAColor(
                {
                    src: unfilteredPixel,
                    green: 187,
                    blue: 158,
                    alpha: 255
                })(54, 89)).toEqual(colors.createColor(unfilteredPixel(54, 89).red, 187, 158, 255));
        });
    });
}

function test__blackWhite() {
    describe('Black and White filter tests', () => {
        const unfilteredPixel = generators.noiseGenerator(
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

        const filteredPixel = filters.blackWhite(
            {
                src: unfilteredPixel,
            }
        );

        test('Test of property of black and White : R,G,B are the same for one pixel', () => {
            expect(filteredPixel(0, 0).red).toEqual(filteredPixel(0, 0).green);
            expect(filteredPixel(0, 0).red).toEqual(filteredPixel(0, 0).blue);

            expect(filteredPixel(89, 165).red).toEqual(filteredPixel(89, 165).green);
            expect(filteredPixel(89, 165).red).toEqual(filteredPixel(89, 165).blue);
        });

        test('Test of unchanged opacity', () => {
            expect(filteredPixel(0, 0).alpha).toEqual(unfilteredPixel(0, 0).alpha);
            expect(filteredPixel(250, 154).alpha).toEqual(unfilteredPixel(250, 154).alpha);
            expect(filteredPixel(148, 186).alpha).toEqual(unfilteredPixel(148, 186).alpha);
            expect(filteredPixel(43, 250).alpha).toEqual(unfilteredPixel(43, 250).alpha);
        });

        test('Test of the expected value', () => {
            const average_value = (unfilteredPixel(0, 0).red + unfilteredPixel(0, 0).green + unfilteredPixel(0, 0).blue) / 3;
            expect(filteredPixel(0, 0).red).toEqual(average_value);
        });
    });
}

function test__repeat() {
    describe('Repeat filter tests', () => {

        const unfilteredPixel = generators.noiseGenerator(
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

        test('Test of repeat on square image', () => {
            const filteredPixel = filters.repeat(
                {
                    src: unfilteredPixel,
                    width: 250,
                    height: 250,
                    size: { x: 125, y: 125 }
                }
            );

            expect(filteredPixel(0, 0)).toEqual(unfilteredPixel(0, 0));
            expect(filteredPixel(1, 1)).toEqual(unfilteredPixel(2, 2));
            expect(filteredPixel(240, 240)).toEqual(unfilteredPixel(230, 230));
            expect(filteredPixel(56, 124)).toEqual(unfilteredPixel(112, 248));
            expect(filteredPixel(145, 236)).toEqual(unfilteredPixel(40, 222));
        });

        test('Test of repeat on non-square image', () => {
            const filteredPixel = filters.repeat(
                {
                    src: unfilteredPixel,
                    width: 200,
                    height: 150,
                    size: { x: 80, y: 80 }
                }
            );

            expect(filteredPixel(0, 0)).toEqual(unfilteredPixel(0, 0));
            expect(filteredPixel(1, 1)).toEqual(unfilteredPixel(2, 1));
            expect(filteredPixel(80, 80)).toEqual(unfilteredPixel(0, 0));
            expect(filteredPixel(64, 80)).toEqual(unfilteredPixel(160, 0));
            expect(filteredPixel(56, 48)).toEqual(unfilteredPixel(140, 90));
        });
    });
}

function test__anaglyphe() {
    describe('Analgyphe 3D filter tests', () => {
        const unfilteredPixel = generators.noiseGenerator(
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

        const filteredPixel = filters.anaglyphe(
            {
                src: unfilteredPixel,
                dx: 20,
                dy: 20
            }
        );

        test('Test of anaglyphe (3D) filter', () => {
            expect(filteredPixel(0, 0)).toEqual(colors.createColor(173, 173, 173, 254));
            expect(filteredPixel(250, 250)).toEqual(colors.createColor(143, 47, 47, 254));
            expect(filteredPixel(58, 69)).toEqual(colors.createColor(93, 128, 128, 254));
            expect(filteredPixel(250, 150)).toEqual(colors.createColor(70, 103, 103, 254));
            expect(filteredPixel(154, 15)).toEqual(colors.createColor(191, 161, 161, 254));
        });
    });
}

function test__composition() {
    describe('Tests of composition filters', () => {
        const unfilteredPixel1 = generators.noiseGenerator(
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

        const unfilteredPixel2 = generators.tilings.checkerboard(
            {
                pixelPerCase: 50,
                color1: colors.examples.INDIGO,
                color2: colors.examples.PURPLE,
            }
        );

        test('Test of operation composition', () => {
            const filteredPixel = filters.composition.operation(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                    op: (c1, c2) => c1 * c2 + c2
                }
            );

            expect(filteredPixel(0, 0).red).toEqual((unfilteredPixel1(0, 0).red * unfilteredPixel2(0, 0).red + unfilteredPixel2(0, 0).red) % 256);
            expect(filteredPixel(250, 250).green).toEqual((unfilteredPixel1(250, 250).green * unfilteredPixel2(250, 250).green + unfilteredPixel2(250, 250).green) % 256);
            expect(filteredPixel(125, 14).blue).toEqual((unfilteredPixel1(125, 14).blue * unfilteredPixel2(125, 14).blue + unfilteredPixel2(125, 14).blue) % 256);
            expect(filteredPixel(100, 236).alpha).toEqual((unfilteredPixel1(100, 236).alpha * unfilteredPixel2(100, 236).alpha + unfilteredPixel2(100, 236).alpha) % 256);
        });

        test('Test of multiply composition', () => {
            const filteredPixel = filters.composition.multiply(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            expect(filteredPixel(0, 0).red).toEqual(Math.floor(unfilteredPixel1(0, 0).red * unfilteredPixel2(0, 0).red / 255) % 256);
            expect(filteredPixel(124, 197).green).toEqual(Math.floor(unfilteredPixel1(124, 197).green * unfilteredPixel2(124, 197).green / 255) % 256);
            expect(filteredPixel(10, 250).blue).toEqual(Math.floor(unfilteredPixel1(10, 250).blue * unfilteredPixel2(10, 250).blue / 255) % 256);
            expect(filteredPixel(100, 0).alpha).toEqual(Math.floor(unfilteredPixel1(100, 0).alpha * unfilteredPixel2(100, 0).alpha / 255) % 256);
        });

        test('Test of screen composition', () => {
            const filteredPixel = filters.composition.screen(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            expect(filteredPixel(0, 0).red).toEqual(Math.floor((1 - (1 - unfilteredPixel1(0, 0).red / 255) * (1 - unfilteredPixel2(0, 0).red / 255)) * 255) % 256);
            expect(filteredPixel(124, 197).green).toEqual(Math.floor((1 - (1 - unfilteredPixel1(124, 197).green / 255) * (1 - unfilteredPixel2(124, 197).green / 255)) * 255) % 256);
            expect(filteredPixel(10, 250).blue).toEqual(Math.floor((1 - (1 - unfilteredPixel1(10, 250).blue / 255) * (1 - unfilteredPixel2(10, 250).blue / 255)) * 255) % 256);
            expect(filteredPixel(100, 0).alpha).toEqual(Math.floor((1 - (1 - unfilteredPixel1(100, 0).alpha / 255) * (1 - unfilteredPixel2(100, 0).alpha / 255)) * 255) % 256);
        });

        test('Test of divide composition', () => {
            const filteredPixel = filters.composition.divide(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            expect(filteredPixel(0, 0).red).toEqual(Math.floor((unfilteredPixel2(0, 0).red + 1) / (unfilteredPixel1(0, 0).red + 1) * 255) % 256);
            expect(filteredPixel(124, 197).green).toEqual(Math.floor((unfilteredPixel2(124, 197).green + 1) / (unfilteredPixel1(124, 197).green + 1) * 255) % 256);
            expect(filteredPixel(10, 250).blue).toEqual(Math.floor((unfilteredPixel2(10, 250).blue + 1) / (unfilteredPixel1(10, 250).blue + 1) * 255) % 256);
            expect(filteredPixel(100, 0).alpha).toEqual(Math.floor((unfilteredPixel2(100, 0).alpha + 1) / (unfilteredPixel1(100, 0).alpha + 1) * 255) % 256);
        });

        test('Test of add composition', () => {
            const filteredPixel = filters.composition.add(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            expect(filteredPixel(0, 0).red).toEqual(Math.floor(unfilteredPixel1(0, 0).red + unfilteredPixel2(0, 0).red) % 256);
            expect(filteredPixel(124, 197).green).toEqual(Math.floor(unfilteredPixel1(124, 197).green + unfilteredPixel2(124, 197).green) % 256);
            expect(filteredPixel(10, 250).blue).toEqual(Math.floor(unfilteredPixel1(10, 250).blue + unfilteredPixel2(10, 250).blue) % 256);
            expect(filteredPixel(100, 0).alpha).toEqual(Math.floor(unfilteredPixel1(100, 0).alpha + unfilteredPixel2(100, 0).alpha) % 256);
        });

        test('Test of minus composition', () => {
            const filteredPixel = filters.composition.minus(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            expect(filteredPixel(0, 0).red).toEqual(0);
            expect(filteredPixel(124, 197).green).toEqual(Math.floor(unfilteredPixel2(124, 197).green - unfilteredPixel1(124, 197).green) % 256);
            expect(filteredPixel(10, 250).blue).toEqual(Math.floor(unfilteredPixel2(10, 250).blue - unfilteredPixel1(10, 250).blue) % 256);
            expect(filteredPixel(100, 0).alpha).toEqual(Math.floor(unfilteredPixel2(100, 0).alpha - unfilteredPixel1(100, 0).alpha) % 256);
        });

        test('Test of over composition', () => {
            const filteredPixel = filters.composition.over(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            expect(filteredPixel(0, 0)).toEqual(unfilteredPixel1(0, 0));
            expect(filteredPixel(250, 250)).toEqual(unfilteredPixel1(250, 250));
            expect(filteredPixel(50, 110)).toEqual(unfilteredPixel1(50, 110));
            expect(filteredPixel(56, 106)).toEqual(unfilteredPixel1(56, 106));
            expect(filteredPixel(212, 257)).toEqual(unfilteredPixel1(212, 257));
        });

        test('Test of insrc composition', () => {
            const filteredPixel = filters.composition.inSrc(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );

            function rightResult(x, y) {
                const colorSrc = unfilteredPixel1(x, y);
                const colorDst = unfilteredPixel2(x, y);
                return colors.createColor(colorSrc.red, colorSrc.green, colorSrc.blue, colorDst.alpha);
            }
            expect(filteredPixel(0, 0)).toEqual(rightResult(0, 0));
            expect(filteredPixel(250, 250)).toEqual(rightResult(250, 250));
            expect(filteredPixel(50, 110)).toEqual(rightResult(50, 110));
            expect(filteredPixel(56, 106)).toEqual(rightResult(56, 106));
            expect(filteredPixel(212, 257)).toEqual(rightResult(212, 257));
        });

        test('Test of atop composition', () => {
            const filteredPixel = filters.composition.atop(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );
            
            function rightResult(x, y) {
                const colorSrc = unfilteredPixel1(x, y);
                const colorDst = unfilteredPixel2(x, y);
                if (colorSrc.alpha > 0 && colorDst.alpha > 0)
                    return colors.createColor(colorDst.red, colorDst.green, colorDst.blue, colorSrc.alpha);
                if (colorSrc.alpha === 0)
                    return colors.examples.TRANSPARENT;
                return colorSrc;
            }
            expect(filteredPixel(0, 0)).toEqual(rightResult(0, 0));
            expect(filteredPixel(250, 250)).toEqual(rightResult(250, 250));
            expect(filteredPixel(50, 110)).toEqual(rightResult(50, 110));
            expect(filteredPixel(56, 106)).toEqual(rightResult(56, 106));
            expect(filteredPixel(212, 257)).toEqual(rightResult(212, 257));
        });

        test('Test of out composition', () => {
            const filteredPixel = filters.composition.out(
                {
                    src: unfilteredPixel1,
                    dst: unfilteredPixel2,
                }
            );
            function rightResult(x, y) {
                const colorSrc = unfilteredPixel1(x, y);
                const colorDst = unfilteredPixel2(x, y);
                return colors.createColor(colorSrc.red, colorSrc.green, colorSrc.blue, 255 - colorDst.alpha);
            }
            expect(filteredPixel(0, 0)).toEqual(rightResult(0, 0));
            expect(filteredPixel(250, 250)).toEqual(rightResult(250, 250));
            expect(filteredPixel(50, 110)).toEqual(rightResult(50, 110));
            expect(filteredPixel(56, 106)).toEqual(rightResult(56, 106));
            expect(filteredPixel(212, 257)).toEqual(rightResult(212, 257));
        });
    });
}

test__gaussian_blur();
test__setOpacity();
test__changeRGBAColor();
test__blackWhite();
test_mirror();
test_clear();
test_bulge();
test_transform();
test_pixelate();
test_limit();
test_negative();
test__repeat();
test__anaglyphe();
test__composition();
