const generators = require('./../gen.js');
const noiseGenerators = require('./../generators.js');
const colors = require('./../colors.js');

function testPerlin() {

    describe('Perlin Noise test suite', () => {

        test('Test of Simplex Noise', () => {
            pixel = generators.noiseGen(
                {
                    noise: noiseGenerators.noiseGenerators.perlinNoise,
                    noiseOptions: {
                        width: 250,
                        height: 250,
                        seed: 1338,
                        variant: 'simplex'
                    }
                }
            );
            // TODO: USe integer numbers & check noise value

            expect(pixel(0, 0)).toStrictEqual(colors.createColor(127.5, 127.5, 127.5, 255));
            expect(pixel(0, 50)).toStrictEqual(colors.createColor(73.46860574369879, 73.46860574369879, 73.46860574369879, 255));
            expect(pixel(50, 100)).toStrictEqual(colors.createColor(171.5503629568706, 171.5503629568706, 171.5503629568706, 255));
            expect(pixel(100, 150)).toStrictEqual(colors.createColor(216.68585800433974, 216.68585800433974, 216.68585800433974, 255));
            expect(pixel(150, 200)).toStrictEqual(colors.createColor(150.0193897949947, 150.0193897949947, 150.0193897949947, 255));
            expect(pixel(200, 250)).toStrictEqual(colors.createColor(82.58715063120549, 82.58715063120549, 82.58715063120549, 255));
            expect(pixel(250, 250)).toStrictEqual(colors.createColor(69.01425502027168, 69.01425502027168, 69.01425502027168, 255));
        })
    });
}

testPerlin();