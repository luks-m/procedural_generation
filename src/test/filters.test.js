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
            expect(filtered_pixel(0,0)).toEqual(colors.createColor(60,60,60,122));
            expect(filtered_pixel(31, 45)).toEqual(colors.createColor(39,39,39,122));
            expect(filtered_pixel(250,250)).toEqual(colors.createColor(33,33,33,122));
            expect(filtered_pixel(250,89)).toEqual(colors.createColor(43,43,43,122));
            expect(filtered_pixel(114,250)).toEqual(colors.createColor(94,94,94,122));
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
