const filters = require('./../filters.js');
const generators = require('./../generators.js');
const colors = require('./../colors.js');

function test__gaussian_blur() {
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
            expect(filteredPixel(0,0)).toEqual(colors.createColor(60,60,60,122));
            expect(filteredPixel(31, 45)).toEqual(colors.createColor(39,39,39,122));
            expect(filteredPixel(250,250)).toEqual(colors.createColor(33,33,33,122));
            expect(filteredPixel(250,89)).toEqual(colors.createColor(43,43,43,122));
            expect(filteredPixel(114,250)).toEqual(colors.createColor(94,94,94,122));
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
		    src : unfilteredPixel,
		    coef : 1,
		    opacity : 20
		}
	    );
	    expect(filteredPixel(0,0).alpha).toEqual((unfilteredPixel(0,0).alpha + 20) % 256);
	    expect(filteredPixel(0,0).red).toEqual(unfilteredPixel(0,0).red);
	    expect(filteredPixel(0,0).green).toEqual(unfilteredPixel(0,0).green);
	    expect(filteredPixel(0,0).blue).toEqual(unfilteredPixel(0,0).blue);
	    expect(filteredPixel(50,89).alpha).toEqual((unfilteredPixel(50,89).alpha + 20) % 256);
	});	

	test('Test of multiplying by a coefficient', () => {
	    const filteredPixel = filters.setOpacity(
		{
		    src : unfilteredPixel,
		    coef : 2,
		    opacity : 0
		}
	    );
	    expect(filteredPixel(0,0).alpha).toEqual((unfilteredPixel(0,0).alpha*2) % 256);
	    expect(filteredPixel(0,0).red).toEqual(unfilteredPixel(0,0).red);
	    expect(filteredPixel(0,0).green).toEqual(unfilteredPixel(0,0).green);
	    expect(filteredPixel(0,0).blue).toEqual(unfilteredPixel(0,0).blue);
	    expect(filteredPixel(50,89).alpha).toEqual((unfilteredPixel(50,89).alpha*2) % 256);
	});

	test('Test of multiplying by a coefficient', () => {
	    const filteredPixel = filters.setOpacity(
		{
		    src : unfilteredPixel,
		    coef : 2,
		    opacity : 50
		}
	    );
	    expect(filteredPixel(0,0).alpha).toEqual((unfilteredPixel(0,0).alpha*2+50) % 256);
	    expect(filteredPixel(0,0).red).toEqual(unfilteredPixel(0,0).red);
	    expect(filteredPixel(0,0).green).toEqual(unfilteredPixel(0,0).green);
	    expect(filteredPixel(0,0).blue).toEqual(unfilteredPixel(0,0).blue);
	    expect(filteredPixel(50,89).alpha).toEqual((unfilteredPixel(50,89).alpha*2+50) % 256);
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
		    src : unfilteredPixel,
		})(0,0)).toEqual(unfilteredPixel(0,0));
	    expect(filters.changeRGBAColor(
		{
		    src : unfilteredPixel,
		})(250,250)).toEqual(unfilteredPixel(250,250));
	    expect(filters.changeRGBAColor(
		{
		    src : unfilteredPixel,
		})(0,0)).toEqual(unfilteredPixel(0,0));
	    expect(filters.changeRGBAColor(
		{
		    src : unfilteredPixel,
		})(89,158)).toEqual(unfilteredPixel(89,158));
	});

	test('Test of changeRGBAColor with 3 changes over 4', () => {
	    expect(filters.changeRGBAColor(
		{
		    src : unfilteredPixel,
		    red : 126,
		    blue : 158,
		    alpha : 255
		})(0,0)).toEqual(colors.createColor(126, unfilteredPixel(0,0).green, 158, 255));
	    expect(filters.changeRGBAColor(
		{
		    src : unfilteredPixel,
		    red : 126,
		    blue : 158,
		    alpha : 255
		})(54,89)).toEqual(colors.createColor(126, unfilteredPixel(54,89).green, 158, 255));
	    expect(filters.changeRGBAColor(
		{
		    src : unfilteredPixel,
		    green : 187,
		    blue : 158,
		    alpha : 255
		})(54,89)).toEqual(colors.createColor(unfilteredPixel(54,89).red, 187, 158, 255));
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
		    src : unfilteredPixel,
		}
	);
	
	test('Test of property of black and White : R,G,B are the same for one pixel', () => {
	    expect(filteredPixel(0,0).red).toEqual(filteredPixel(0,0).green);
	    expect(filteredPixel(0,0).red).toEqual(filteredPixel(0,0).blue);

	    expect(filteredPixel(89,165).red).toEqual(filteredPixel(89,165).green);
	    expect(filteredPixel(89,165).red).toEqual(filteredPixel(89,165).blue);
	});

	test('Test of unchanged opacity', () => {
	    expect(filteredPixel(0,0).alpha).toEqual(unfilteredPixel(0,0).alpha);
	    expect(filteredPixel(250,154).alpha).toEqual(unfilteredPixel(250,154).alpha);
	    expect(filteredPixel(148,186).alpha).toEqual(unfilteredPixel(148,186).alpha);
	    expect(filteredPixel(43,250).alpha).toEqual(unfilteredPixel(43,250).alpha);
	});

	test('Test of the expected value', () => {
	    const average_value = (unfilteredPixel(0,0).red + unfilteredPixel(0,0).green +unfilteredPixel(0,0).blue) / 3;
	    expect(filteredPixel(0,0).red).toEqual(average_value);
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
		    size: 125,
		}
	    );
	    
	    expect(filteredPixel(0,0)).toEqual(unfilteredPixel(0,0));
	    expect(filteredPixel(1,1)).toEqual(unfilteredPixel(2,2));
	    expect(filteredPixel(240,240)).toEqual(unfilteredPixel(230,230));
	    expect(filteredPixel(56,124)).toEqual(unfilteredPixel(112,248));
	    expect(filteredPixel(145,236)).toEqual(unfilteredPixel(40, 222));
	});

	test('Test of repeat on non-square image', () => {
	    const filteredPixel = filters.repeat(
		{
		    src: unfilteredPixel,
		    width: 200,
		    height: 150,
		    size: 80,
		}
	    );

	    expect(filteredPixel(0,0)).toEqual(unfilteredPixel(0,0));
	    expect(filteredPixel(1,1)).toEqual(unfilteredPixel(2,1));
	    expect(filteredPixel(80,80)).toEqual(unfilteredPixel(0,0));
	    expect(filteredPixel(64,80)).toEqual(unfilteredPixel(160,0));
	    expect(filteredPixel(56,48)).toEqual(unfilteredPixel(140,90));
	});
    });
}

function test__anaglyphe()
{
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
	    expect(filteredPixel(0,0)).toEqual(colors.createColor(173,173,173,254));
	    expect(filteredPixel(250,250)).toEqual(colors.createColor(143,47,47,254));
	    expect(filteredPixel(58,69)).toEqual(colors.createColor(93,128,128,254));
	    expect(filteredPixel(250,150)).toEqual(colors.createColor(70,103,103,254));
	    expect(filteredPixel(154,15)).toEqual(colors.createColor(191,161,161,254));
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

	    expect(filteredPixel(0,0).red).toEqual((unfilteredPixel1(0,0).red * unfilteredPixel2(0,0).red + unfilteredPixel2(0,0).red) % 256);
	    expect(filteredPixel(250,250).green).toEqual((unfilteredPixel1(250,250).green * unfilteredPixel2(250,250).green + unfilteredPixel2(250,250).green) % 256);
	    expect(filteredPixel(125,14).blue).toEqual((unfilteredPixel1(125,14).blue * unfilteredPixel2(125,14).blue + unfilteredPixel2(125,14).blue) % 256);
	    expect(filteredPixel(100,236).alpha).toEqual((unfilteredPixel1(100,236).alpha * unfilteredPixel2(100,236).alpha + unfilteredPixel2(100,236).alpha) % 256);
	});

	test('Test of multiply composition', () => {
	    const filteredPixel = filters.composition.multiply(
		{
		    src: unfilteredPixel1,
		    dst: unfilteredPixel2,
		}
	    );

	    expect(filteredPixel(0,0).red).toEqual(Math.floor(unfilteredPixel1(0,0).red * unfilteredPixel2(0,0).red / 255) % 256);
	    expect(filteredPixel(124,197).green).toEqual(Math.floor(unfilteredPixel1(124,197).green * unfilteredPixel2(124,197).green / 255) % 256);
	    expect(filteredPixel(10,250).blue).toEqual(Math.floor(unfilteredPixel1(10,250).blue * unfilteredPixel2(10,250).blue / 255) % 256);
	    expect(filteredPixel(100,0).alpha).toEqual(Math.floor(unfilteredPixel1(100,0).alpha * unfilteredPixel2(100,0).alpha / 255) % 256);
	});

	test('Test of screen composition', () => {
	    const filteredPixel = filters.composition.screen(
		{
		    src: unfilteredPixel1,
		    dst: unfilteredPixel2,
		}
	    );

	    expect(filteredPixel(0,0).red).toEqual(Math.floor((1 - (1 - unfilteredPixel1(0,0).red / 255) * (1 - unfilteredPixel2(0,0).red / 255)) * 255) % 256);
	    expect(filteredPixel(124,197).green).toEqual(Math.floor((1 - (1 - unfilteredPixel1(124,197).green / 255) * (1 - unfilteredPixel2(124,197).green / 255)) * 255) % 256);
	    expect(filteredPixel(10,250).blue).toEqual(Math.floor((1 - (1 - unfilteredPixel1(10,250).blue / 255) * (1 - unfilteredPixel2(10,250).blue / 255)) * 255) % 256);
	    expect(filteredPixel(100,0).alpha).toEqual(Math.floor((1 - (1 - unfilteredPixel1(100,0).alpha / 255) * (1 - unfilteredPixel2(100,0).alpha / 255)) * 255) % 256);
	});

	test('Test of divide composition', () => {
	    const filteredPixel = filters.composition.divide(
		{
		    src: unfilteredPixel1,
		    dst: unfilteredPixel2,
		}
	    );

	    expect(filteredPixel(0,0).red).toEqual(Math.floor((unfilteredPixel2(0,0).red + 1) / (unfilteredPixel1(0,0).red + 1) * 255) % 256);
	    expect(filteredPixel(124,197).green).toEqual(Math.floor((unfilteredPixel2(124,197).green + 1) / (unfilteredPixel1(124,197).green + 1) * 255) % 256);
	    expect(filteredPixel(10,250).blue).toEqual(Math.floor((unfilteredPixel2(10,250).blue + 1) / (unfilteredPixel1(10,250).blue + 1) * 255) % 256);
	    expect(filteredPixel(100,0).alpha).toEqual(Math.floor((unfilteredPixel2(100,0).alpha + 1) / (unfilteredPixel1(100,0).alpha + 1) * 255) % 256);
	});

	test('Test of add composition', () => {
	    const filteredPixel = filters.composition.add(
		{
		    src: unfilteredPixel1,
		    dst: unfilteredPixel2,
		}
	    );

	    expect(filteredPixel(0,0).red).toEqual(Math.floor(unfilteredPixel1(0,0).red + unfilteredPixel2(0,0).red) % 256);
	    expect(filteredPixel(124,197).green).toEqual(Math.floor(unfilteredPixel1(124,197).green + unfilteredPixel2(124,197).green) % 256);
	    expect(filteredPixel(10,250).blue).toEqual(Math.floor(unfilteredPixel1(10,250).blue + unfilteredPixel2(10,250).blue) % 256);
	    expect(filteredPixel(100,0).alpha).toEqual(Math.floor(unfilteredPixel1(100,0).alpha + unfilteredPixel2(100,0).alpha) % 256);
	});

	test('Test of minus composition', () => {
	    const filteredPixel = filters.composition.minus(
		{
		    src: unfilteredPixel1,
		    dst: unfilteredPixel2,
		}
	    );

	    expect(filteredPixel(0,0).red).toEqual(0);
	    expect(filteredPixel(124,197).green).toEqual(Math.floor(unfilteredPixel2(124,197).green - unfilteredPixel1(124,197).green) % 256);
	    expect(filteredPixel(10,250).blue).toEqual(Math.floor(unfilteredPixel2(10,250).blue - unfilteredPixel1(10,250).blue) % 256);
	    expect(filteredPixel(100,0).alpha).toEqual(Math.floor(unfilteredPixel2(100,0).alpha - unfilteredPixel1(100,0).alpha) % 256);
	});

	test('Test of over composition', () => {
	    const filteredPixel = filters.composition.over(
		{
		    src: unfilteredPixel1,
		    dst: unfilteredPixel2,
		}
	    );

	    expect(filteredPixel(0,0)).toEqual(unfilteredPixel1(0,0));
	    expect(filteredPixel(250,250)).toEqual(unfilteredPixel1(250,250));
	    expect(filteredPixel(50,110)).toEqual(unfilteredPixel1(50,110));
	    expect(filteredPixel(56,106)).toEqual(unfilteredPixel1(56,106));
	    expect(filteredPixel(212,257)).toEqual(unfilteredPixel1(212,257));
	});
    });
}
	
test__gaussian_blur();
test__setOpacity();
test__changeRGBAColor();
test__blackWhite();
test__repeat();
test__anaglyphe();
test__composition();

