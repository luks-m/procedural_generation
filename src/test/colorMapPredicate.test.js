const colorMap = require('./../colorMapPredicate.js');

function testColorMapPredicate() {
    describe('ColorMapPredicate tests', () => {
        let epsilon = 5;
        test('Test of wave', () => {
            expect(colorMap.wave(0, 0)).toBeCloseTo(0, epsilon);
            expect(colorMap.wave(2, 0)).toBeCloseTo(0.2 * Math.sin(2), epsilon);
            expect(colorMap.wave(3, 4)).toBeCloseTo(0.5 * Math.sin(19), epsilon);
        });

        test('Test of splash', () => {
            expect(colorMap.splash(0, 0)).toBeCloseTo(0, epsilon);
            expect(colorMap.splash(10, 0)).toBeCloseTo(0, epsilon);
            expect(colorMap.splash(10, 10)).toBeCloseTo(Math.sin(2) * 10 ** 5, epsilon);
        });

        test('Test of pic', () => {
            expect(colorMap.pic(0, 0)).toBeCloseTo(0, epsilon);
            expect(colorMap.pic(1, 0)).toBeCloseTo(Math.sin(1) / 1.1 + 0.5, epsilon);
            expect(colorMap.pic(10, 10)).toBeCloseTo(Math.sin(400) / (0.1 + Math.sqrt(200)) + 300 * Math.exp(-199), epsilon);
        });

        test('Test of mandelBrotSet', () => {
            expect(colorMap.mandelbrotSet(50, 2)(0, 0)).toBeCloseTo(0, epsilon);
            expect(colorMap.mandelbrotSet(2, 2)(0.1, 0)).toBeCloseTo(Math.sqrt((0.1 + 0.1 ** 2) ** 2), epsilon);
            expect(colorMap.mandelbrotSet(25, 6)(25, 1)).toBeCloseTo(Math.sqrt(626), epsilon);
        });

        test('Test of JuliaSquare', () => {
            expect(colorMap.juliaShapes.juliaSquare(1, 2)(0, 0)).toBeCloseTo(Math.sqrt(0.3 ** 2 + 0.5 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaSquare(2, 2)(20, 30)).toBeCloseTo(Math.sqrt(20 * 20 + 30 * 30), epsilon);

        });

        test('Test of JuliaSpi', () => {
            expect(colorMap.juliaShapes.juliaSpi(1, 2)(0, 0)).toBeCloseTo(Math.sqrt(0.285 ** 2 + 0.01 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaSpi(2, 2)(100, 0)).toBeCloseTo(100, epsilon);

        });

        test('Test of JuliaPeak', () => {
            expect(colorMap.juliaShapes.juliaPeak(1, 2)(0, 0)).toBeCloseTo(Math.sqrt(1.4107 ** 2 + 0.0099 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaPeak(2, 2)(10, 20)).toBeCloseTo(Math.sqrt(100 + 20 ** 2), epsilon);

        });

        test('Test of JuliaElec', () => {
            expect(colorMap.juliaShapes.juliaElec(1, 2)(0, 0)).toBeCloseTo(Math.sqrt(0.038 ** 2 + 0.9754 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaElec(50, 2)(18, 13)).toBeCloseTo(Math.sqrt(18 ** 2 + 13 ** 2), epsilon);

        });

        test('Test of JuliaCrown', () => {
            expect(colorMap.juliaShapes.juliaCrown(1, 6)(0, 0)).toBeCloseTo(Math.sqrt(1.476 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaCrown(5, 1)(5, 6)).toBeCloseTo(Math.sqrt(61), epsilon);

        });

        test('Test of JuliaBubble', () => {
            expect(colorMap.juliaShapes.juliaBubble(1, 1)(0, 0)).toBeCloseTo(Math.sqrt(0.4 ** 2 + 0.6 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaBubble(5, 15)(56, 0)).toBeCloseTo(Math.sqrt(56 ** 2), epsilon);

        });

        test('Test of JuliaDragon', () => {
            expect(colorMap.juliaShapes.juliaDragon(1, 2)(0, 0)).toBeCloseTo(Math.sqrt(0.8 ** 2 + 0.156 ** 2), epsilon);
            expect(colorMap.juliaShapes.juliaDragon(2, 2)(10, 0)).toBeCloseTo(10, epsilon);

        });

        test('Test of fractale', () => {
            expect(colorMap.fractale(50, 2, (z) => { return [z[0] ** 2, 0]; })(0, 0)).toBeCloseTo(0, epsilon);
            expect(colorMap.fractale(3, 2, (z) => { return [z[0] ** 2, 0]; })(0.5, 0)).toBeCloseTo(0.00390625, epsilon);
            expect(colorMap.fractale(5, 6, (z) => { return [z[0] ** 3, 0]; })(10, 0)).toBeCloseTo(10, epsilon);
        });

        test('Test of focused', () => {
            const f = (x, y) => { return x + y; };
            expect(colorMap.focused(f, 250, 250, -10, 10, -5, 5)(0, 125)).toBeCloseTo(f(-10, 0), epsilon);
            expect(colorMap.focused(f, 250, 250, -10, 0, -5, 5)(250, 0)).toBeCloseTo(f(0, -5), epsilon);
            expect(colorMap.focused(f, 50, 100, -22, 22, -50, -10)(50, 50)).toBeCloseTo(f(0, -10), epsilon);
        });
    });
}

testColorMapPredicate();
