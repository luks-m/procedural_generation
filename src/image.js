const helpers = require('./helpers.js');

const noiseGenerators = require('./generators.js');
const generators = require('./gen.js');
const generatorsLucas = require('./generators_lucas.js');
const generatorsleo = require('./generator_leo.js');
const colorMaps = require('./colorMaps.js');
const colorMapPredicate = require('./colorMapPredicate.js');
const colors = require('./colors.js');


const filtersLucas = require('./filters_lucas.js');
const filtersleo = require('./filters_leo.js');

function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    const percentageGeneratedByOnePixel = ((1 / (height * width)) * 100);
    let progress = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            progress += percentageGeneratedByOnePixel;
            if (progress.toFixed(2) % 2.5 === 0) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`Generating Image: ${progress.toFixed(2)}%`);
            }
            const pixelColor = getPixelColor(x, y);
            image.data[n] = pixelColor.red;
            image.data[n + 1] = pixelColor.green;
            image.data[n + 2] = pixelColor.blue;
            image.data[n + 3] = pixelColor.alpha;
        }
    }
    process.stdout.write(`\n`);
    context.putImageData(image, 0, 0);
    return canvas;
}

function getImage(canvas, width, height) {

    let pixel;
    
    ///////////////////// Generators : /////////////////////

    // Checkerboard

    /*
    pixel = generatorsLucas.makeCheckerboard(
	{
	    pixelPerCase: 50,
	    color1: colors.createColor(255,0,0,255),
	    color2: colors.createColor(0,255,0,255),
	});
    */

    // Perlin Noise

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseGenerators.perlinNoise,
            noiseOptions: {
                width: width,
                height: height,
                seed: 1338,
                variant: 'simplex'
            }
        }
    );
    */

    // Fractal Brownian Motion

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'fbm',
                fractalOptions: {
                    noiseGen: "perlin",
                    noiseSeed: 2567,
                    argsList: {
                        variant: "simplex"
                    },
                    octaves: 5,
                    persistence: 0.5,
                    lacunarity: 2,
                    initial_amplitude: 2,
                    initial_frequency: 0.2,
                    colored: true
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'fbm',
                fractalOptions: {
                    noiseGen: "worley",
                    noiseSeed: 44,
                    argsList: {
                        type: "f2 - f1",
                        distance: "euclidean",
                        three_dimensions: true
                    },
                    octaves: 2,
                    colored: true
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'fbm',
                fractalOptions: {
                    noiseGen: "perlin",
                    noiseSeed: 42,
                    argsList: {
                        variant: "value"
                    },
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'fbm',
                fractalOptions: {
                    noiseGen: "worley",
                    noiseSeed: 1338,
                    argsList: {
                        type: "f2 - f1",
                        distance: "euclidean",
                        three_dimensions: false
                    },
                    octaves: 2,
                }
            }
        }
    );
    */

    // Turbulence Noise

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'turbulence',
                fractalOptions: {
                    noiseGen: "perlin",
                    noiseSeed: 1338,
                    argsList: {
                        variant: "simplex"
                    },
                    octaves: 6
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'turbulence',
                fractalOptions: {
                    noiseGen: "worley",
                    noiseSeed: 1338,
                    argsList: {
                        type: "f2 - f1",
                        distance: "euclidean",
                        three_dimensions: "false"
                    },
                    octaves: 2
                }
            }
        }
    );
    */


    // Ridged Multifractal Noise

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'ridged',
                fractalOptions: {
                    noiseGen: "perlin",
                    noiseSeed: 1338,
                    argsList: {
                        variant: "simplex",
                        scale: 4
                    },
                    octaves: 6,
                    colored: true
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'ridged',
                fractalOptions: {
                    noiseGen: "worley",
                    noiseSeed: 1338,
                    argsList: {
                        type: "f2 - f1",
                        distance: "euclidean",
                        three_dimensions: "false"
                    },
                    octaves: 3,
                    colored: true
                }
            }
        }
    );
    */

    // Worley Noise

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseGenerators.worleyNoise,
            noiseOptions: {
                width: width,
                height: height,
                three_dimensions: true,
                colored: true,
                seed: 43,
                type: "f2 - f1",
                distance: "euclidean"
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseGenerators.worleyNoise,
            noiseOptions: {
                width: width,
                height: height,
                seed: 1338,
                type: 'f2 - f1',
                distance: "euclidean",
                three_dimensions: false,
                colored: false
            }
        }
    );
    */

    // Domain Warping

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.warp,
            noiseOptions: {
                width: width,
                height: height,
                fractalGen: {
                    fractal: 'ridged',
                    fractalOptions: {
                        noiseGen: "perlin",
                        noiseSeed: 1338,
                        argsList: {
                            variant: "simplex"
                        },
                        octaves: 3,
                    }
                },
                qMultiplier: 4,
                rMultiplier: 10,
                colored: true
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.warp,
            noiseOptions: {
                width: width,
                height: height,
                fractalGen: {
                    fractal: 'ridged',
                    fractalOptions: {
                        noiseGen: "worley",
                        noiseSeed: 1338,
                        argsList: {
                            type: "f2 - f1",
                            distance: "manhattan"
                        },
                        octaves: 2
                    }
                },
                qMultiplier: 4,
                rMultiplier: 4,
                colored: true
            }
        }
    );
    */

    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.warp,
            noiseOptions: {
                width: width,
                height: height,
                fractalGen: {
                    fractal: 'turbulence',
                    fractalOptions: {
                        noiseGen: "perlin",
                        noiseSeed: 44
                    }
                },
                qMultiplier: 10,
                rMultiplier: 10,
                colored: true
            }
        }
    );
    */


    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.warp,
            noiseOptions: {
                width: width,
                height: height,
                fractalGen: {
                    fractal: 'fbm',
                    fractalOptions: {
                        noiseGen: "perlin",
                        noiseSeed: 44,
                        octaves: 2
                    }
                },
                qMultiplier: 40,
                rMultiplier: 20,
                colored: true
            }
        }
    );


    /*
    pixel = generators.noiseGen(
        {
            noise: noiseGenerators.noiseFractals.warp,
            noiseOptions: {
                width: width,
                height: height,
                fractalGen: {
                    fractal: 'fbm',
                    fractalOptions: {
                        noiseGen: "worley",
                        noiseSeed: 44,
                        argsList: {
                            type: "f2 - f1"
                        },
                        octaves: 2
                    }
                },
                qMultiplier: 10,
                rMultiplier: 4,
                colored: true
            }
        }
    )
    */


    // Colormap

    //Voronoi

    //Bee

    
    ///////////////////// Filters : /////////////////////

    //pixel = generatorsleo.generatorIsoscelesTriangle({color1 : colors.examples.WHITE, color2 : colors.examples.BLACK, size : 20});
    
    //Gaussian Blur

    /*
    const kernel = filtersLucas.createKernel(
	{
	    kernelSize : 10,
	    sigma : 1.5
	});
    
    pixel = filtersLucas.gaussianBlur(
	{
	    image : pixel,
	    kernel : kernel,
	    kernelSize : 10
	});
    */

    canvas = imageGeneration(canvas, width, height, pixel);
    
    return canvas;
}

exports.getImage = getImage;
