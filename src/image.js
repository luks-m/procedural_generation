const colors = require('./colors.js');
const generators = require('./generators.js');
const filters = require('./filters.js');

function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    const percentageGeneratedByOnePixel = ((1 / (height * width)) * 100);
    let progress = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            // progress += percentageGeneratedByOnePixel;
            // if (progress.toFixed(2) % 2.5 === 0) {
            //     process.stdout.clearLine();
            //     process.stdout.cursorTo(0);
            //     process.stdout.write(`Generating Image: ${progress.toFixed(2)}%`);
            // }
            const pixelColor = getPixelColor(x, y);
            image.data[n] = pixelColor.red;
            image.data[n + 1] = pixelColor.green;
            image.data[n + 2] = pixelColor.blue;
            image.data[n + 3] = pixelColor.alpha;
        }
    }
    // process.stdout.write(`\n`);
    context.putImageData(image, 0, 0);
    return canvas;
}

function getImage(canvas, width, height) {

    let pixel;
    

    ////////////////////////////////////////////////////
    ///////////////// NOISE Generators /////////////////
    ////////////////////////////////////////////////////

    ///////////////// Perlin Noise /////////////////////


    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseGenerators.perlinNoise,
            noiseOptions: {
                width: width,
                height: height,
                seed: 1338,
                variant: 'simplex'
            }
        }

    ); 

    ///////////////// Fractal Brownian Motion //////////

    /* pixel = generators.noiseGenerator({
            noise: generators.noise.noiseFractals.fractal,
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
    ); */


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
                        three_dimensions: true
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
                        scale: 2
                    },
                    octaves: 6,
                    persistence: 0.5,
                    lacunarity: 2,
                    initial_amplitude: 2,
                    initial_frequency: 0.6,
                    colored: false
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
                        three_dimensions: false
                    },
                    octaves: 3,
                    colored: true
                }
            }
        }
    );
    */


    // pixel = generators.noiseGen(
    //     {
    //         noise: noiseGenerators.noiseFractals.fractal,
    //         noiseOptions: {
    //             width: width,
    //             height: height,
    //             fractal: 'ridged',
    //             fractalOptions: {
    //                 noiseGen: "worley",
    //                 noiseSeed: 1338,
    //                 argsList: {
    //                     type: "f2 - f1",
    //                     distance: "chebyshev",
    //                     three_dimensions: true
    //                 },
    //                 octaves: 2,
    //                 persistence: 0.5,
    //                 lacunarity: 2,
    //                 initial_amplitude: 1,
    //                 initial_frequency: 0.3,
    //                 colored: true
    //             }
    //         }
    //     }
    // );


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
                            distance: "euclidean",
                            three_dimensions: true
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
    */

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

    ////////////// Checkerboard


    /* pixel = generators.tilings.checkerboard({
        pixelPerCase: 50,
        color1: colors.examples.INDIGO,
        color2: colors.examples.PURPLE,
    }); */

    // Colormaps
    /* pixel = generators.colorMap.examples.greys({
        f: generators.colorMap.predicate.focused(generators.colorMap.predicate.juliaShapes.juliaDragon(25, 10), height, width, -1, 1, -1, 1),
        min: 0,
        max: 10
    }); */

    //Voronoi
    /*
    pixel = generators.tilings.voronoiHexagonal({
        height: height,
        width: width,
        size: 20
    }); 
    */
    //Bee

    
    ///////////////////// Filters : /////////////////////

    /*
    pixel = filters.composition.multiply({
        src: pixel,
        dst: generators.tilings.square({
            size: height,
            color1: colors.examples.VERDIGRI,
	    color2: colors.examples.TRANSPARENT
        })
    });
    */

    //Opacity Chnager
    /*
    pixel = filters.opacityChanger(
	{
	    image : pixel,
	    opacity : 255
	}
    );
    */
    //Gaussian Blur


    for (let y = 43; y < 48; y++) {
	for (let x = 29; x < 34; x++) {
	    console.log(pixel(x,y));
	}
    }
    
    
    const kernel = filters.createKernel(
	{
	    kernelSize : 5,
	    sigma : 1.5
	});

    console.log(kernel);
    pixel = filters.gaussianBlur(
	{
	    image : pixel,
	    kernel : kernel,
	    kernelSize : 5
	});

    console.log(pixel(29,45));
    console.log(pixel(30,45));
    console.log(pixel(31,45));

    canvas = imageGeneration(canvas, width, height, pixel);

    return canvas;
}

exports.getImage = getImage;
