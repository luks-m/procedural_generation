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
    // process.stdout.write(`\n`);
    context.putImageData(image, 0, 0);
    return canvas;
}

function getImage(canvas, width, height) {

    let pixel;
    /*
    const dsdfg = {
        src: {
            img: generators.noiseGenerator,
            options: {
                noise: generators.noise.noiseFractals.warp,
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
            },
            filters: {
                1: {
                    filter:
                }
            }
        }
    };
    */

    const planet = {
        src: {
            img: generators.colorMap.colorMap,
            options: {
                f: generators.colorMap.predicate.focused(
                    (x, y) => {
                        if (Math.sqrt(x ** 2 + y ** 2) < 75) {
                            return x ** 2 + y ** 2;
                        }
                        return 75 ** 2;
                    },
                    height, width, -150, 150, -150, 150),
                min: 0,
                max: 75 ** 2,
                redVariations: [[255, 20], [20, 0]],
                greenVariations: [[255, 20], [20, 0]],
                blueVariations: [[255, 20], [20, 0]],
                alphaVariations: [[255], [0]]
            },
            filters: {
                1: {
                    filter: filters.bulge,
                    filter_options: {
                        size: {
                            width: width,
                            height: height
                        },
                        coef: 0.5
                    }
                }
            }
        },
        linker: {
            composition: filters.composition.multiply,
        },
        dst: {
            src: {
                img: generators.colorMap.examples.hot,
                options: {
                    f: generators.noiseGenerator(
                        {
                            noise: generators.noise.noiseFractals.fractal,
                            noiseOptions: {
                                width: width,
                                height: height,
                                fractal: 'turbulence',
                                fractalOptions: {
                                    noiseGen: "perlin",
                                    noiseSeed: 1338,
                                    argsList: {
                                        variant: "simplex",
                                        scale: 16
                                    },
                                    octaves: 6,
                                    get_noise: true,
                                    initial_frequency: 0.2,
                                    initial_amplitude: 1.2,
                                }
                            }
                        }
                    ),
                    min: -1,
                    max: 1
                }
            }
        }
    };

    const stars = {
        src: {
            img: generators.colorMap.colorMap,
            options: {
                f: generators.noiseGenerator(
                    {
                        noise: generators.noise.noiseFractals.warp,
                        noiseOptions: {
                            width: width,
                            height: height,
                            fractalGen: {
                                fractal: 'turbulence',
                                fractalOptions: {
                                    noiseGen: "perlin",
                                    noiseSeed: 1339,
                                    argsList: {
                                        variant: "simplex",
                                        scale: 48
                                    },
                                    octaves: 4,
                                    initial_frequency: 0.3,
                                    initial_amplitude: 3,
                                    lacunarity: 3,
                                    frequency: 0.7
                                }
                            },
                            qMultiplier: 100,
                            rMultiplier: 100,
                            colored: false,
                            get_noise: true
                        }
                    }
                ),
                min: 1,
                max: -1,
                redVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
                greenVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
                blueVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
                alphaVariations: [[255]]
            }
        }
    }

    /*
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.warp,
            noiseOptions: {
                width: width,
                height: height,
                fractalGen: {
                    fractal: 'turbulence',
                    fractalOptions: {
                        noiseGen: "perlin",
                        noiseSeed: 1339,
                        argsList: {
                            variant: "simplex",
                            scale: 48
                        },
                        octaves: 4,
                        initial_frequency: 0.3,
                        initial_amplitude: 3,
                        lacunarity: 3,
                        frequency: 0.7
                    }
                },
                qMultiplier: 100,
                rMultiplier: 100,
                colored: false,
                get_noise: true
            }
        }
    );
    */
    /*
    pixel = generators.colorMap.colorMap(
        {
            f: pixel,
            min: 1,
            max: -1,
            redVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
            greenVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
            blueVariations: [[0], [0], [0], [0], [0], [0], [0, 255], [255]],
            alphaVariations: [[255]]
        }
    )
    */


    const starsXplanet = {
        src: {
            img: () => generators.generate(planet),
        },
        linker: {
            composition: filters.composition.over
        },
        dst: {
            src: {
                img: () => generators.generate(stars)
            }
        },
        filters: {
            1: {
                filter: filters.anaglyphe,
                filter_options: {
                    dx: 3,
                    dy: 2
                }
            }
        }
    }

    /*
    const asteroid = {
        src: {
            img: generators.colorMap.colorMap,
            options: {
                f: generators.colorMap.predicate.focused(
                    (x, y) => {
                        if (Math.sqrt(x ** 2 + y ** 2) < 25){
                            return x ** 2 + y ** 2;
                        }
                        return 25 ** 2;
                    },
                    height, width, -150, 100, -100, 150),
                min: 0,
                max: 25 ** 2,
                redVariations:[[255, 20], [20, 0]],
                greenVariations:[[255, 20], [20, 0]],
                blueVariations:[[255, 20], [20, 0]],
                alphaVariations:[[255], [0]]
            },
            filters: {
                1: {
                    filter: filters.bulge,
                    filter_options: {
                        size: {
                            width: width,
                            height: height
                        },
                        coef: 0.5
                    }
                }
            }
        },
        linker: {
            composition: filters.composition.multiply,
        },
        dst: {
            src: {
                img: generators.colorMap.colorMap,
                options: {
                    f: generators.noiseGenerator(
                        {
                            noise: generators.noise.noiseFractals.warp,
                            noiseOptions: {
                                width: width,
                                height: height,
                                fractalGen: {
                                    fractal: 'turbulence',
                                    fractalOptions: {
                                        noiseGen: "perlin",
                                        noiseSeed: 1339,
                                        argsList: {
                                            variant: "simplex",
                                            scale: 8
                                        },
                                        octaves: 4,
                                        initial_frequency: 0.5,
                                        initial_amplitude: 3,
                                        lacunarity: 2,
                                        frequency: 0.7
                                    }
                                },
                                qMultiplier: 75,
                                rMultiplier: 75,
                                colored: false,
                                get_noise: true
                            }
                        }
                    ),
                    min: 1,
                    max: -1,
                    redVariations: [[0], [0], [0], [0], [0, 255], [255]],
                    greenVariations: [[0], [0], [0], [0], [0, 255], [255]],
                    blueVariations: [[0], [0], [0], [0], [0, 255], [255]],
                    alphaVariations: [[255]]
                }
            }
        }
    };
    */


    ////////////////////////////////////////////////////
    ///////////////// NOISE Generators /////////////////
    ////////////////////////////////////////////////////

    ///////////////// Perlin Noise /////////////////////

    /*
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
    */

    ///////////////// Fractal Brownian Motion //////////

    /*
    pixel = generators.noiseGenerator({
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
    );
    */

    /*
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
                    octaves: 4
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
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
                    octaves: 2,
                    colored: true
                }
            }
        }
    );
    */

    /*
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.fractal,
            noiseOptions: {
                width: width,
                height: height,
                fractal: 'ridged',
                fractalOptions: {
                    noiseGen: "worley",
                    noiseSeed: 1338,
                    argsList: {
                        type: "f2 - f1",
                        distance: "chebyshev",
                        three_dimensions: true
                    },
                    octaves: 2,
                    persistence: 0.5,
                    lacunarity: 2,
                    initial_amplitude: 1,
                    initial_frequency: 0.3,
                    colored: true
                }
            }
        }
    );
    */


    // Worley Noise

    /*
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseGenerators.worleyNoise,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseGenerators.worleyNoise,
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


    /*pixel = filters.negative({
        src: pixel
    })*/


    /*
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.warp,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.warp,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.warp,
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
    pixel = generators.noiseGenerator(
        {
            noise: generators.noise.noiseFractals.warp,
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
    pixel = filters.takeColor({
        src: pixel,
        takeRed: true,
        takeBlue: true,
        takeGreen: false
    });
    pixel = filters.composition.add({
        src: pixel,
        dst: generators.tilings.square({
            size: height,
            color1: colors.examples.PURPLE,
            color2: colors.examples.TRANSPARENT
        })
    });
    pixel = filters.repeat({
        src: pixel,
        size: 10,
        width:200,
        height: 50
    });
    */
    //Gaussian Blur
    /*
    const kernel = filters.createKernel(
	{
	    kernelSize : 3,
	    sigma : 1.5
	});

    
    pixel = filters.gaussianBlur(
	{
	    src : pixel,
	    kernel : kernel,
	    kernelSize : 3
	});
    */

    /*
    pixel = generators.generate(
        {

        }
    );
    */

    pixel = generators.generate(starsXplanet);
    canvas = imageGeneration(canvas, width, height, pixel);

    return canvas;
}

exports.getImage = getImage;
