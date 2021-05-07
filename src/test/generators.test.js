const generators = require('./../generators.js');
const colors = require('./../colors.js');

function testPerlin() {

    describe('Perlin Noise test suite', () => {

        test('Test of Simplex Noise', () => {
            const pixel = generators.noiseGenerator(
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

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(127, 127, 127, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(73, 73, 73, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(171, 171, 171, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(216, 216, 216, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(150, 150, 150, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(82, 82, 82, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(69, 69, 69, 255));
        });
    });
}

testPerlin();