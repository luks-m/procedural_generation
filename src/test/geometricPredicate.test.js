const geometric = require('../geometricPredicate.js');

function testIsEven() {
    describe('isEven tests', () => {
        test('Test if 2 is even', () => {
            expect(geometric.isEven({ x: 2 })).toBe(true);
        });
        test('Test if 0 is even', () => {
            expect(geometric.isEven({ x: 0 })).toBe(true);
        });
        test('Test if 3 is not even', () => {
            expect(geometric.isEven({ x: 3 })).toBe(false);
        });
    });
}

function testIsOdd() {
    describe('isOdd tests', () => {
        test('Test if 6 not odd', () => {
            expect(geometric.isOdd({ x: 6 })).toBe(false);
        });
        test('Test if 0 is not odd', () => {
            expect(geometric.isOdd({ x: 0 })).toBe(false);
        });
        test('Test if 5 is odd', () => {
            expect(geometric.isOdd({ x: 5 })).toBe(true);
        });
    });
}

function testSameParity() {
    describe('sameParity tests', () => {
        test('Test if 8 and 10 have the same parity', () => {
            expect(geometric.sameParity({ x: 8, y: 10 })).toBe(true);
        });
        test('Test if 0 and 1 have not the same parity', () => {
            expect(geometric.sameParity({ x: 0, y: 1 })).toBe(false);
        });
        test('Test if 7 and 9 have the same parity', () => {
            expect(geometric.sameParity({ x: 7, y: 9 })).toBe(true);
        });
    });
}

function testPredTrue() {
    describe('predTrue tests', () => {
        test('Test if true is true', () => {
            expect(geometric.predTrue()).toBe(true);
        });
    });
}

function testPredFalse() {
    describe('predFalse tests', () => {
        test('Test if false is false', () => {
            expect(geometric.predFalse()).toBe(false);
        });
    });
}

function testPredTopLine() {
    describe('predTopLine tests', () => {
        test('Test if 2 belong to the 4-width top line of a 20-size square', () => {
            expect(geometric.predTopLine({ x: 2, width: 4, size: 20 })).toBe(true);
        });
        test('Test if 5 not belong to the 4-width top line of a 20-size square', () => {
            expect(geometric.predTopLine({ x: 5, width: 4, size: 20 })).toBe(false);
        });

        test('Test if 1 belong to the 2-width top line of a 100-size square', () => {
            expect(geometric.predTopLine({ x: 1, width: 2, size: 100 })).toBe(true);
        });
    });
}

function testPredBottomLine() {
    describe('predBottomLine tests', () => {
        test('Test if 17 belong to the 4-width bottom line of a 20-size square', () => {
            expect(geometric.predBottomLine({ x: 17, width: 4, size: 20 })).toBe(true);
        });
        test('Test if 5 not belong to the 4-width bottom line of a 20-size square', () => {
            expect(geometric.predBottomLine({ x: 5, width: 4, size: 20 })).toBe(false);
        });
        test('Test if 355 belong to the 2-width bottom line of a 356-size square', () => {
            expect(geometric.predBottomLine({ x: 355, width: 2, size: 356 })).toBe(true);
        });
    });
}

function testPredLeftLine() {
    describe('predLeftLine tests', () => {
        test('Test if 25 belong to the 6-width left line of a 22-size square', () => {
            expect(geometric.predLeftLine({ y: 25, width: 6, size: 22 })).toBe(true);
        });
        test('Test if 18 not belong to the 2-width left line of a 20-size square', () => {
            expect(geometric.predLeftLine({ x: 18, width: 2, size: 20 })).toBe(false);
        });
        test('Test if 0 belong to the 1-width left line of a 56-size square', () => {
            expect(geometric.predLeftLine({ y: 0, width: 1, size: 56 })).toBe(true);
        });
    });
}

function testPredRightLine() {
    describe('predRightLine tests', () => {
        test('Test if 18 belong to the 6-width right line of a 22-size square', () => {
            expect(geometric.predRightLine({ y: 18, width: 6, size: 22 })).toBe(true);
        });
        test('Test if 34 not belong to the 2-width right line of a 36-size square', () => {
            expect(geometric.predRightLine({ x: 34, width: 2, size: 36 })).toBe(false);
        });
        test('Test if 55 belong to the 2-width right line of a 56-size square', () => {
            expect(geometric.predRightLine({ y: 55, width: 2, size: 56 })).toBe(true);
        });
    });
}

function testPredCornerTopRight() {
    describe('predCornerTopRight tests', () => {
        test('Test if (18,5) belong to the top right corner of a 22-size square with a 6-with diagonal', () => {
            expect(geometric.predCornerTopRight({ x: 18, y: 5, width: 6, size: 22 })).toBe(true);
        });
        test('Test if (7,18) not belong to the top right corner of a 22-size square with a 6-with diagonal', () => {
            expect(geometric.predCornerTopRight({ x: 7, y: 18, width: 6, size: 22 })).toBe(false);
        });
        test('Test if (11,17) not belong to the top right corner of a 22-size square with a 6-with diagonal', () => {
            expect(geometric.predCornerTopRight({ x: 11, y: 17, width: 6, size: 22 })).toBe(false);
        });
        test('Test if (7,10) belong to the top right corner of a 22-size square with a 6-with diagonal', () => {
            expect(geometric.predCornerTopRight({ x: 7, y: 10, width: 6, size: 22 })).toBe(true);
        });
    });
}

function testPredCornerTopLeft() {
    describe('predCornerTopLeft tests', () => {
        test('Test if (18,5) belong to the top left corner of a 56-size square with a 5-with diagonal', () => {
            expect(geometric.predCornerTopLeft({ x: 18, y: 5, width: 5, size: 56 })).toBe(true);
        });
        test('Test if (25,40) not belong to the top left corner of a 56-size square with a 5-with diagonal', () => {
            expect(geometric.predCornerTopLeft({ x: 25, y: 40, width: 5, size: 56 })).toBe(false);
        });
        test('Test if (50,36) not belong to the top left corner of a 56-size square with a 0-with diagonal', () => {
            expect(geometric.predCornerTopLeft({ x: 50, y: 36, width: 0, size: 56 })).toBe(false);
        });
        test('Test if (57,5) belong to the top left corner of a 56-size square with a 5-with diagonal', () => {
            expect(geometric.predCornerTopLeft({ x: 57, y: 5, width: 5, size: 56 })).toBe(true);
        });
    });
}

function testPredCornerBottomRight() {
    describe('predCornerBottomRight tests', () => {
        test('Test if (56,75) belong to the bottom right corner of a 78-size square with a 2-with diagonal', () => {
            expect(geometric.predCornerBottomRight({ x: 56, y: 75, width: 2, size: 78 })).toBe(true);
        });
        test('Test if (5,5) not belong to the bottom right corner of a 78-size square with a 2-with diagonal', () => {
            expect(geometric.predCornerBottomRight({ x: 5, y: 5, width: 2, size: 78 })).toBe(false);
        });
        test('Test if (81,17) not belong to the bottom right corner of a 78-size square with a 2-with diagonal', () => {
            expect(geometric.predCornerBottomRight({ x: 81, y: 17, width: 2, size: 78 })).toBe(false);
        });
        test('Test if (7,77) belong to the bottom right corner of a 78-size square with a 2-with diagonal', () => {
            expect(geometric.predCornerBottomRight({ x: 7, y: 77, width: 2, size: 78 })).toBe(true);
        });
    });
}

function testPredCornerBottomLeft() {
    describe('predCornerBottomLeft tests', () => {
        test('Test if (50,50) belong to the bottom left corner of a 500-size square with a 10-with diagonal', () => {
            expect(geometric.predCornerBottomLeft({ x: 50, y: 50, width: 10, size: 500 })).toBe(true);
        });
        test('Test if (480,10) not belong to the bottom left corner of a 500-size square with a 10-with diagonal', () => {
            expect(geometric.predCornerBottomLeft({ x: 480, y: 10, width: 10, size: 500 })).toBe(false);
        });
        test('Test if (822,20) not belong to the bottom left corner of a 500-size square with a 10-with diagonal', () => {
            expect(geometric.predCornerBottomLeft({ x: 822, y: 20, width: 10, size: 500 })).toBe(false);
        });
        test('Test if (250,745) belong to the bottom left corner of a 500-size square with a 10-with diagonal', () => {
            expect(geometric.predCornerBottomLeft({ x: 250, y: 745, width: 10, size: 500 })).toBe(true);
        });
    });
}

function testPredDiagBottomRightTopLeft() {
    describe('predDiagBottomRightTopLeft tests', () => {
        test('Test if (25,18) belong to the bottom right top left 15-width diagonal of a 50-size square', () => {
            expect(geometric.predDiagBottomRightTopLeft({ x: 25, y: 18, width: 15, size: 50 })).toBe(true);
        });
        test('Test if (25,5) not belong to the bottom right top left 2-width diagonal of a 50-size square', () => {
            expect(geometric.predDiagBottomRightTopLeft({ x: 25, y: 5, width: 2, size: 50 })).toBe(false);
        });
        test('Test if (361,361) belong to the bottom right top left 3-width diagonal of a 356-size square', () => {
            expect(geometric.predDiagBottomRightTopLeft({ x: 361, y: 361, width: 3, size: 356 })).toBe(true);
        });
    });
}

function testPredDiagBottomLeftTopRight() {
    describe('predDiagBottomLeftTopRight tests', () => {
        test('Test if (99,2) belong to the bottom left top right 5-width diagonal of a 100-size square', () => {
            expect(geometric.predDiagBottomLeftTopRight({ x: 99, y: 2, width: 5, size: 100 })).toBe(true);
        });
        test('Test if (12,5) not belong to the bottom left top right 2-width diagonal of a 100-size square', () => {
            expect(geometric.predDiagBottomLeftTopRight({ x: 12, y: 5, width: 2, size: 100 })).toBe(false);
        });
        test('Test if (1401,2798) belong to the bottom left top right 10-width diagonal of a 700-size square', () => {
            expect(geometric.predDiagBottomLeftTopRight({ x: 1401, y: 2798, width: 10, size: 700 })).toBe(true);
        });
    });
}

function testWhichPart() {
    describe('predWhichPart tests', () => {
        test('Test if (0,2) is in the (0,0) part of a 50-size square', () => {
            expect(geometric.whichPart({ x: 0, y: 2, size: 50 })).toStrictEqual([0, 0]);
        });
        test('Test if (22,35) is in the (2,3) part of a 10-size square', () => {
            expect(geometric.whichPart({ x: 22, y: 35, size: 10 })).toStrictEqual([2, 3]);
        });
        test('Test if (145,92) is in the (6,4) part of a 22-size square', () => {
            expect(geometric.whichPart({ x: 145, y: 92, size: 22 })).toStrictEqual([6, 4]);
        });
    });
}

function testIsSquareDiag() {
    describe('IsSquareDiag tests', () => {
        test('Test if (0,0) is on the corner of 50-size tile', () => {
            expect(geometric.isSquareDiag({ x: 0, y: 0, size: 50 })).toStrictEqual(true);
        });
	test('Test if (50,0) is on the corner of 50-size tile', () => {
            expect(geometric.isSquareDiag({ x: 50, y: 0, size: 50 })).toStrictEqual(true);
        });
	test('Test if (33,33) is on the corner of 33-size tile', () => {
            expect(geometric.isSquareDiag({ x: 33, y: 33, size: 33 })).toStrictEqual(true);
        });
	test('Test if (26,33) is not on the corner of 33-size tile', () => {
            expect(geometric.isSquareDiag({ x: 26, y: 33, size: 33 })).toStrictEqual(false);
        });	
	test('Test if (15,12) is not on the corner of 22-size tile', () => {
            expect(geometric.isSquareDiag({ x: 15, y: 12, size: 22 })).toStrictEqual(false);
        });
        
    });
}

testIsEven();
testIsOdd();
testSameParity();
testPredTrue();
testPredFalse();
testPredTopLine();
testPredBottomLine();
testPredLeftLine();
testPredRightLine();
testPredCornerTopRight();
testPredCornerTopLeft();
testPredCornerBottomRight();
testPredCornerBottomLeft();
testPredDiagBottomRightTopLeft();
testPredDiagBottomLeftTopRight();
testWhichPart();
testIsSquareDiag();
