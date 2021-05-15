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
            }
	);

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
        const image = generators.tilings.voronoiRandom({width: width, height: height, number: 50});
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
                x -= width/2;
                y -= height/2;
                // rotate point
                const xnew = x * cos - y * sin;
                const ynew = x * sin + y * cos;
                // translate point back:
                x = xnew + width/2;
                y = ynew + height/2;
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
                x = (x - width/2) * scaleX + width/2;
                y = (y - height/2) * scaleY + height/2;
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
            const options = { src: image, size: { x: 1, y: 1 }, };
            const filterToTest = filters.pixelate(options);

            let [x, y] = [0, 0];
            expect(filterToTest(0, 0)).toEqual(image(x, y));
            [x, y] = [0.15 * width, 0.15 * height];
            expect(filterToTest(0.15 * width, 0.15 * height)).toEqual(image(x, y));
            [x, y] = [0.15 * width, 0.75 * height];
            expect(filterToTest(0.15 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = [0.5 * width, 0.5 * height];
            expect(filterToTest(0.5 * width, 0.5 * height)).toEqual(image(x, y));
            [x, y] = [0.75 * width, 0.75 * height];
            expect(filterToTest(0.75 * width, 0.75 * height)).toEqual(image(x, y));
            [x, y] = [0.75 * width, 0.15 * height];
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
                y = options.size.y * Math.floor(y / options.size.y)
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
            const options = { src: image, xlim: {min: 0, max: width}, ylim: {min: 0, max: height} };
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
            const options = { src: image, xlim: { min: 0, max: width/2 }, ylim: { min: 0, max: height } };
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
	
	test('Test of adding a value to the opacity', () => {
	    const filtered_pixel = filters.setOpacity(
		{
		    src : unfiltered_pixel,
		    coef : 1,
		    opacity : 20
		}
	    );
	    expect(filtered_pixel(0,0).alpha).toEqual((unfiltered_pixel(0,0).alpha + 20) % 256);
	    expect(filtered_pixel(0,0).red).toEqual(unfiltered_pixel(0,0).red);
	    expect(filtered_pixel(0,0).green).toEqual(unfiltered_pixel(0,0).green);
	    expect(filtered_pixel(0,0).blue).toEqual(unfiltered_pixel(0,0).blue);
	    expect(filtered_pixel(50,89).alpha).toEqual((unfiltered_pixel(50,89).alpha + 20) % 256);
	});	

	test('Test of multiplying by a coefficient', () => {
	    const filtered_pixel = filters.setOpacity(
		{
		    src : unfiltered_pixel,
		    coef : 2,
		    opacity : 0
		}
	    );
	    expect(filtered_pixel(0,0).alpha).toEqual((unfiltered_pixel(0,0).alpha*2) % 256);
	    expect(filtered_pixel(0,0).red).toEqual(unfiltered_pixel(0,0).red);
	    expect(filtered_pixel(0,0).green).toEqual(unfiltered_pixel(0,0).green);
	    expect(filtered_pixel(0,0).blue).toEqual(unfiltered_pixel(0,0).blue);
	    expect(filtered_pixel(50,89).alpha).toEqual((unfiltered_pixel(50,89).alpha*2) % 256);
	});

	test('Test of multiplying by a coefficient', () => {
	    const filtered_pixel = filters.setOpacity(
		{
		    src : unfiltered_pixel,
		    coef : 2,
		    opacity : 50
		}
	    );
	    expect(filtered_pixel(0,0).alpha).toEqual((unfiltered_pixel(0,0).alpha*2+50) % 256);
	    expect(filtered_pixel(0,0).red).toEqual(unfiltered_pixel(0,0).red);
	    expect(filtered_pixel(0,0).green).toEqual(unfiltered_pixel(0,0).green);
	    expect(filtered_pixel(0,0).blue).toEqual(unfiltered_pixel(0,0).blue);
	    expect(filtered_pixel(50,89).alpha).toEqual((unfiltered_pixel(50,89).alpha*2+50) % 256);
	});
    });
}

function test__changeRGBAColor() {
    describe('Color changer tests', () => {
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
	
	test('Test of changeRGBAColor without changes', () => {
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		})(0,0)).toEqual(unfiltered_pixel(0,0));
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		})(250,250)).toEqual(unfiltered_pixel(250,250));
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		})(0,0)).toEqual(unfiltered_pixel(0,0));
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		})(89,158)).toEqual(unfiltered_pixel(89,158));
	});

	test('Test of changeRGBAColor with 3 changes over 4', () => {
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		    red : 126,
		    blue : 158,
		    alpha : 255
		})(0,0)).toEqual(colors.createColor(126, unfiltered_pixel(0,0).green, 158, 255));
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		    red : 126,
		    blue : 158,
		    alpha : 255
		})(54,89)).toEqual(colors.createColor(126, unfiltered_pixel(54,89).green, 158, 255));
	    expect(filters.changeRGBAColor(
		{
		    src : unfiltered_pixel,
		    green : 187,
		    blue : 158,
		    alpha : 255
		})(54,89)).toEqual(colors.createColor(unfiltered_pixel(54,89).red, 187, 158, 255));
	});
    });
}

function test__blackWhite() {
    describe('Black and White filter tests', () => {
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

	const filtered_pixel = filters.blackWhite(
		{
		    src : unfiltered_pixel,
		}
	);
	
	test('Test of property of black and White : R,G,B are the same for one pixel', () => {
	    expect(filtered_pixel(0,0).red).toEqual(filtered_pixel(0,0).green);
	    expect(filtered_pixel(0,0).red).toEqual(filtered_pixel(0,0).blue);

	    expect(filtered_pixel(89,165).red).toEqual(filtered_pixel(89,165).green);
	    expect(filtered_pixel(89,165).red).toEqual(filtered_pixel(89,165).blue);
	});

	test('Test of unchanged opacity', () => {
	    expect(filtered_pixel(0,0).alpha).toEqual(unfiltered_pixel(0,0).alpha);
	    expect(filtered_pixel(250,154).alpha).toEqual(unfiltered_pixel(250,154).alpha);
	    expect(filtered_pixel(148,186).alpha).toEqual(unfiltered_pixel(148,186).alpha);
	    expect(filtered_pixel(43,250).alpha).toEqual(unfiltered_pixel(43,250).alpha);
	});

	test('Test of the expected value', () => {
	    const average_value = (unfiltered_pixel(0,0).red + unfiltered_pixel(0,0).green +unfiltered_pixel(0,0).blue) / 3;
	    expect(filtered_pixel(0,0).red).toEqual(average_value);
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
