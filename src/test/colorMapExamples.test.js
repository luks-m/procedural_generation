const colorMap = require('./../colorMapExamples.js');
const colors = require('./../colors.js');

function testColorMapExamples() {
    describe('ColorMapExamples tests', () => {

        test('Test of colorMapGreys', () => {
            const gradient = colorMap.greys({ f: (x) => x, min: 0, max: 50 });
            let color1 = gradient(0, 5);
            expect(colors.compareColor(color1, colors.createColor(255, 255, 255, 255))).toEqual(true);
            let color2 = gradient(25, 5);
            expect(colors.compareColor(color2, colors.createColor(128, 128, 128, 255))).toEqual(true);
            let color3 = gradient(50, 5);
            expect(colors.compareColor(color3, colors.createColor(2, 2, 2, 255))).toEqual(true);
            let color4 = gradient(125, 5);
            expect(colors.compareColor(color4, colors.createColor(131, 131, 131, 255))).toEqual(true);
        });

        test('Test of colorMapMushroom', () => {
            const gradient = colorMap.mushroom({ f: (x) => x, min: 0, max: 100 });
            let color1 = gradient(0, 5);
            expect(colors.compareColor(color1, colors.createColor(255, 0, 0, 255))).toEqual(true);
            let color2 = gradient(50, 5);
            expect(colors.compareColor(color2, colors.createColor(128, 126, 126, 255))).toEqual(true);
            let color3 = gradient(100, 5);
            expect(colors.compareColor(color3, colors.createColor(2, 252, 252, 255))).toEqual(true);
            let color4 = gradient(250, 5);
            expect(colors.compareColor(color4, colors.createColor(131, 123, 123, 255))).toEqual(true);
        });

        test('Test of colorMapSpring', () => {
            const gradient = colorMap.spring({ f: (x) => x, min: 10, max: 0 });
            let color1 = gradient(0, 5);
            expect(colors.compareColor(color1, colors.createColor(2, 252, 0, 255))).toEqual(true);
            let color2 = gradient(10, 5);
            expect(colors.compareColor(color2, colors.createColor(255, 0, 0, 255))).toEqual(true);
            let color3 = gradient(5, 5);
            expect(colors.compareColor(color3, colors.createColor(128, 126, 0, 255))).toEqual(true);
            let color4 = gradient(25, 5);
            expect(colors.compareColor(color4, colors.createColor(123, 131, 0, 255))).toEqual(true);
        });

        test('Test of colorMapJet', () => {
            const gradient = colorMap.jet({ f: (x, y) => y + 0*x, min: 25, max: 5 });
            let color1 = gradient(0, 5);
            expect(colors.compareColor(color1, colors.createColor(2, 0, 252, 255))).toEqual(true);
            let color2 = gradient(10, 25);
            expect(colors.compareColor(color2, colors.createColor(255, 0, 0, 255))).toEqual(true);
            let color3 = gradient(5, 15);
            expect(colors.compareColor(color3, colors.createColor(128, 0, 126, 255))).toEqual(true);
            let color4 = gradient(25, 55);
            expect(colors.compareColor(color4, colors.createColor(123, 0, 131, 255))).toEqual(true);
        });

        test('Test of colorMapHSL', () => {
            const gradient = colorMap.hsl({ f: (x, y) => y+0*x, min: 0, max: 30 });
            let color1 = gradient(0, 0);
            expect(colors.compareColor(color1, colors.createColor(240, 0, 97, 255))).toEqual(true);
            let color2 = gradient(10, 30);
            expect(colors.compareColor(color2, colors.createColor(240, 252, 97, 255))).toEqual(true);
            let color3 = gradient(5, 15);
            expect(colors.compareColor(color3, colors.createColor(240, 126, 97, 255))).toEqual(true);
            let color4 = gradient(25, 75);
            expect(colors.compareColor(color4, colors.createColor(240, 123, 97, 255))).toEqual(true);
        });

        test('Test of colorMapLight', () => {
            const gradient = colorMap.light({ f: (x, y) => y+0*x, min: 0, max: 60 });
            let color1 = gradient(0, 0);
            expect(colors.compareColor(color1, colors.createColor(0, 0, 255, 255))).toEqual(true);
            let color2 = gradient(10, 60);
            expect(colors.compareColor(color2, colors.createColor(6, 0, 0, 255))).toEqual(true);
            let color3 = gradient(5, 30);
            expect(colors.compareColor(color3, colors.createColor(59, 193, 0, 255))).toEqual(true);
            let color4 = gradient(25, 75);
            expect(colors.compareColor(color4, colors.createColor(0, 155, 95, 255))).toEqual(true);
        });

        test('Test of colorMapIsland', () => {
            const gradient = colorMap.island({ f: (x, y) => y+0*x, min: 0, max: 200 });
            let color1 = gradient(0, 0);
            expect(colors.compareColor(color1, colors.createColor(0, 0, 255, 255))).toEqual(true);
            let color2 = gradient(10, 200);
            expect(colors.compareColor(color2, colors.createColor(128, 128, 0, 255))).toEqual(true);
            let color3 = gradient(5, 100);
            expect(colors.compareColor(color3, colors.createColor(249, 228, 183, 255))).toEqual(true);
            let color4 = gradient(25, 250);
            expect(colors.compareColor(color4, colors.createColor(135, 206, 235, 255))).toEqual(true);
        });

        test('Test of colorMapIslandD', () => {
            const gradient = colorMap.islandD({ f: (x, y) => y+0*x, min: -100, max: 400 });
            let color1 = gradient(0, -100);
            expect(colors.compareColor(color1, colors.createColor(0, 0, 255, 255))).toEqual(true);
            let color2 = gradient(10, 400);
            expect(colors.compareColor(color2, colors.createColor(128, 128, 0, 255))).toEqual(true);
            let color3 = gradient(5, 150);
            expect(colors.compareColor(color3, colors.createColor(130, 254, 5, 255))).toEqual(true);
            let color4 = gradient(25, -200);
            expect(colors.compareColor(color4, colors.createColor(132, 142, 9, 255))).toEqual(true);
        });

        test('Test of colorMapSnow', () => {
            const gradient = colorMap.snow({ f: (x, y) => y+0*x, min: -50, max: 50 });
            let color1 = gradient(0, -50);
            expect(colors.compareColor(color1, colors.createColor(0, 0, 255, 255))).toEqual(true);
            let color2 = gradient(10, 50);
            expect(colors.compareColor(color2, colors.createColor(115, 0, 255, 0))).toEqual(true);
            let color3 = gradient(5, 0);
            expect(colors.compareColor(color3, colors.createColor(117, 0, 255, 2))).toEqual(true);
            let color4 = gradient(25, 75);
            expect(colors.compareColor(color4, colors.createColor(0, 118, 255, 121))).toEqual(true);
        });

        test('Test of colorMapPurple', () => {
            const gradient = colorMap.purple({ f: (x, y) => y+0*x, min: 0, max: 50 });
            let color1 = gradient(0, 0);
            expect(colors.compareColor(color1, colors.createColor(0, 0, 255, 255))).toEqual(true);
            let color2 = gradient(10, 50);
            expect(colors.compareColor(color2, colors.createColor(115, 0, 0, 255))).toEqual(true);
            let color3 = gradient(5, 25);
            expect(colors.compareColor(color3, colors.createColor(117, 117, 2, 255))).toEqual(true);
            let color4 = gradient(25, 62);
            expect(colors.compareColor(color4, colors.createColor(0, 0, 126, 255))).toEqual(true);
        });

        test('Test of colorMapHot', () => {
            const gradient = colorMap.hot({ f: (x) => x, min: 10, max: 40 });
            let color1 = gradient(10, 0);
            expect(colors.compareColor(color1, colors.createColor(28, 8, 1, 255))).toEqual(true);
            let color2 = gradient(40, 50);
            expect(colors.compareColor(color2, colors.createColor(250, 251, 255, 255))).toEqual(true);
            let color3 = gradient(25, 3);
            expect(colors.compareColor(color3, colors.createColor(113, 58, 152, 255))).toEqual(true);
            let color4 = gradient(47.5, 47.5);
            expect(colors.compareColor(color4, colors.createColor(75, 176, 22, 255))).toEqual(true);
        });
    });
}

testColorMapExamples();
