const colors = require('./colors.js');
const generators = require('./generators.js');
const filters = require('./filters.js');


function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    // const percentageGeneratedByOnePixel = ((1 / (height * width)) * 100);
    // let progress = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            // progress += percentageGeneratedByOnePixel;
            // if (progress.toFixed(2) % 2.5 === 0) {
                // process.stdout.clearLine();
                // process.stdout.cursorTo(0);
                // process.stdout.write(`Generating Image: ${progress.toFixed(2)}%`);
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
                                fractal: 'fbm',
                                fractalOptions: {
                                    noiseGen: "perlin",
                                    argsList: {
                                        variant: "simplex",
                                        scale: 12
                                    },
                                    octaves: 4,
                                    persistence: 0.5,
                                    lacunarity: 2,
                                    initial_amplitude: 3,
                                    initial_frequency: 0.3,
                                    get_noise: true
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
    };

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
                    dy: 2,
                    color: colors.examples.TRANSPARENT
                }
            }
        }
    };

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
    ///////////////////// FILTERS //////////////////////
    ////////////////////////////////////////////////////

    /*
    const mirror = generators.filtersDescriptorHelper(filters.mirror);
    const xMirror = mirror({
        axe: 'x',
        width: width,
        height: height
    });
    const yMirror = mirror({
        axe: 'y',
        width: width,
        height: height
    });
    const xyMirror = mirror({
        axe: 'xy',
        width: width,
        height: height
    });


    const clear = generators.filtersDescriptorHelper(filters.clear);
    const clearInCircle = clear({
        toClear: (x, y) => Math.sqrt((x - 125) ** 2 + (y - 125) ** 2) > 100
    });


    const bulge = generators.filtersDescriptorHelper(filters.bulge);
    const bulgeBump = bulge({
        size: {
            width : width,
            height: height
        },
        bulge: {
            x: 0.4,
            y: 0.6
        },
        coef: 1
    });

    const bulgeVanishingPoint = bulge({
        size: {
            width : width,
            height: height
        },
        bulge: {
            x: 0.4,
            y: 0.6
        },
        coef: -1
    });

    const bulgeHole = bulge({
        size: {
            width : width,
            height: height
        },
        bulge: {
            x: 0.4,
            y: 0.6
        },
        coef: -0.5
    });


    const setOpacity = generators.filtersDescriptorHelper(filters.setOpacity);
    const halfOpacity = setOpacity({
        coef: 0.5
    });
    const hundredOpacity = setOpacity({
        opacity: 100
    });


    const transform = generators.filtersDescriptorHelper(filters.transform);
    const translateRotateScale = transform({
        size: {
            width: width,
            height: height
        },
        offset: {
            x: 50,
            y: 10
        },
        scale: {
            x: 0.5,
            y: 0.5
        },
        angle: 42
    });


    const limit = generators.filtersDescriptorHelper(filters.limit);
    const window = limit({
        xlim: {
            min: 42,
            max: 125
        },
        ylim: {
            min: 89,
            max: 200
        }
    });


    const pixelate = generators.filtersDescriptorHelper(filters.pixelate);
    const bigPixel = pixelate({
        size: {
            x: 5,
            y: 3
        }
    });


    const negative = generators.filtersDescriptorHelper(filters.negative)();


    const changeRGBAColor = generators.filtersDescriptorHelper(filters.changeRGBAColor);
    const redMax = changeRGBAColor({
        red: 255
    });


    const blackWhite = generators.filtersDescriptorHelper(filters.blackWhite)();


    const repeat = generators.filtersDescriptorHelper(filters.repeat);
    const smallRepeat = repeat({
        width: width,
        height: height,
        size: {
            x: width / 5,
            y: height / 5
        }
    });


    const anaglyphe = generators.filtersDescriptorHelper(filters.anaglyphe);
    const effect3D = anaglyphe({
        dx: 3,
        dy: 2
    });


    const kernel = filters.createKernel(
        {
            kernelSize : 3,
            sigma : 1.5
        });
    const gaussianBlur = generators.filtersDescriptorHelper(filters.gaussianBlur);
    const blur = gaussianBlur({
        kernel : kernel,
        kernelSize : 3
    });

    const xor = filters.composition.xor;
    const over = filters.composition.over;
    const add = filters.composition.add;
    const atop = filters.composition.atop;
    const multiply = filters.composition.multiply;
    const divide = filters.composition.divide;
    const inSrc = filters.composition.inSrc;
    const minus = filters.composition.minus;
    const out = filters.composition.out;
    const screen = filters.composition.screen;


    ////////////////////////////////////////////////////
    ///////////////// NOISE Generators /////////////////
    ////////////////////////////////////////////////////


    const noise = generators.imageDescriptorHelper(generators.noiseGenerator);


    ///////////////// Perlin Noise /////////////////////

    const simplexNoise = noise({
        noise: generators.noise.noiseGenerators.perlinNoise,
        noiseOptions: {
            width: width,
            height: height,
            seed: 1338,
            variant: 'simplex'
        }
    })();


    const valueNoise = noise({
        noise: generators.noise.noiseGenerators.perlinNoise,
        noiseOptions: {
            width: width,
            height: height,
            seed: 1338,
            variant: 'value'
        }
    })();


    const gradientNoise = noise({
        noise: generators.noise.noiseGenerators.perlinNoise,
        noiseOptions: {
            width: width,
            height: height,
            seed: 1338,
            variant: 'gradient'
        }
    })();

    ///////////////// Fractal Brownian Motion //////////


    const fractalFbmPerlinSimplexColored = noise({
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
    })();


    const fractalFbmWorley = noise({
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
                    three_dimensions: true
                },
                octaves: 2,
            }
        }
    })();


    // Turbulence Noise


    const fractalTurbulencePerlin = noise({
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
                    scale: 4
                },
                octaves: 6
            }
        }
    })();


    const fractalTurbulenceWorley = noise({
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
    })();


    // Ridged Multifractal Noise


    const fractalRidgedPerlinColored = noise({
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
                    scale: 4
                },
                octaves: 6,
                persistence: 0.5,
                lacunarity: 2,
                initial_amplitude: 2,
                initial_frequency: 0.6,
                colored: true
            }
        }
    })();


    const fractalRidgedWorleyColored = noise({
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
    })();


    // Worley Noise


    const cellularWorleyNoise = noise({
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
    })();


    // Domain Warping


    const fractalDomainWarpingRidgedWorley = noise({
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
    })();


    const fractalDomainWarpingTurbulencePerlin = noise({
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
    })();


    ////////////////////////////////////////////////////
    //////////////// TILING Generators /////////////////
    ////////////////////////////////////////////////////

    ////////////// Checkerboard


    const solidColor = generators.imageDescriptorHelper(generators.tilings.solid);
    const indigo = solidColor({color: colors.examples.INDIGO})();
    const blue = solidColor({color: colors.examples.BLUE})();


    const checkerboard = generators.imageDescriptorHelper(generators.tilings.checkerboard);
    const chessBoard = checkerboard({
        pixelPerCase: width / 5,
        color1: colors.examples.WHITE,
        color2: colors.examples.BLACK,
    })();


    const rectangleTriangle = generators.imageDescriptorHelper(generators.tilings.rectangleTriangle);
    const rectangleTriangleIndigoBlue = rectangleTriangle({
        size: width / 5,
        color1: colors.examples.INDIGO,
        color2: colors.examples.BLUE
    })();


    const isocelesTriangle = generators.imageDescriptorHelper(generators.tilings.isoscelesTriangle);
    const isocelesTriangleRedVerdigri = isocelesTriangle({
        size: width / 5,
        color1: colors.examples.RED,
        color2: colors.examples.VERDIGRI
    })();


    const equilateralTriangle = generators.imageDescriptorHelper(generators.tilings.equilateralTriangle);
    const equilateralTriangleRedGreen = equilateralTriangle({
        size: width / 5,
        color1: colors.examples.RED,
        color2: colors.examples.GREEN
    })();


    const zigzag = generators.imageDescriptorHelper(generators.tilings.zigzag);
    const zigzagRedGreen = zigzag({
        size: width / 5,
        color1: colors.examples.RED,
        color2: colors.examples.GREEN
    })();


    const grid = generators.imageDescriptorHelper(generators.tilings.grid);
    const gridBlackGreen = grid({
        size: width / 5,
        color1: colors.examples.BLACK,
        color2: colors.examples.GREEN
    })();


    const doubleVichy = generators.imageDescriptorHelper(generators.tilings.doubleVichy);
    const doubleVichyBlackGreen = doubleVichy({
        size: 7,
        color1: colors.examples.BLACK,
        color2: colors.examples.GREEN
    })();


    const hourglass = generators.imageDescriptorHelper(generators.tilings.hourglass);
    const hourglassBlackWhite = hourglass({
        size: 50,
        color1: colors.examples.BLACK,
        color2: colors.examples.WHITE
    })();


    const octagonal = generators.imageDescriptorHelper(generators.tilings.octagonal);
    const octagonalRedBlack = octagonal({
        size: 50,
        width: 1,
        color1: colors.examples.RED,
        color2: colors.examples.BLACK
    })();


    const grandmaTexture = generators.imageDescriptorHelper(generators.tilings.grandmaTexture);
    const grandmaTexturePurpleBlack = grandmaTexture({
        size1: 7,
        size2: 10,
        width: 1,
        color1: colors.examples.PURPLE,
        color2: colors.examples.BLACK
    })();


    const beePattern = generators.imageDescriptorHelper(generators.tilings.beePattern);
    const beePatternYellowBlack = beePattern({
        color1: colors.examples.YELLOW,
        color2: colors.examples.BLACK
    })();


    const voronoiHexagonal = generators.imageDescriptorHelper(generators.tilings.voronoiHexagonal);
    const voronoiHex = voronoiHexagonal({
        height: height,
        width: width,
        size: 20
    })();


    const voronoiRandom = generators.imageDescriptorHelper(generators.tilings.voronoiRandom);
    const voronoiRng = voronoiRandom({
        height: height,
        width: width,
        size: 20,
        number: 42
    })();


    const voronoiPentagonal = generators.imageDescriptorHelper(generators.tilings.voronoiPentagonal);
    const voronoiPenta = voronoiPentagonal({
        height: height,
        width: width,
        size: 70
    })();

    ////////////////////////////////////////////////////
    /////////////// COLORMAPS Generators ///////////////
    ////////////////////////////////////////////////////

    const colorMapHot = generators.imageDescriptorHelper(generators.colorMap.examples.hot);
    const hotWave = colorMapHot({
        f: generators.colorMap.predicate.wave,
        min: -50,
        max: 50
    })();


    const focus = generators.colorMap.predicate.focused;


    const colorMapHsl = generators.imageDescriptorHelper(generators.colorMap.examples.hsl);
    const hslSplash = colorMapHsl({
        f: focus(generators.colorMap.predicate.splash, height, width, -1, 1, -1, 1),
        min: -0.001,
        max: 0.001
    })();


    const colorMapJet = generators.imageDescriptorHelper(generators.colorMap.examples.jet);
    const jetPic = colorMapJet({
        f: focus(generators.colorMap.predicate.pic, height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();

    const mandelBrotSet = generators.colorMap.predicate.mandelbrotSet;

    const colorMapSnow = generators.imageDescriptorHelper(generators.colorMap.examples.snow);
    const snowMandelBrot = colorMapSnow({
        f: focus(mandelBrotSet(10, 4), height, width, -2, 1, -1.5, 1.5),
        min: -1,
        max: 1
    })();


    const colorMapGreys = generators.imageDescriptorHelper(generators.colorMap.examples.greys);
    const greysMandelBrot = colorMapGreys({
        f: focus(mandelBrotSet(10, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    const colorMapIsland = generators.imageDescriptorHelper(generators.colorMap.examples.island);
    const islandJuliaDragon = colorMapIsland({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaDragon(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    const colorMapIslandD = generators.imageDescriptorHelper(generators.colorMap.examples.islandD);
    const islandDJuliaElec = colorMapIslandD({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaElec(10, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    const colorMapLight = generators.imageDescriptorHelper(generators.colorMap.examples.light);
    const lightJuliaBubble = colorMapLight({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaBubble(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    const colorMapMushroom = generators.imageDescriptorHelper(generators.colorMap.examples.mushroom);
    const mushroomJuliaCrown = colorMapMushroom({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaCrown(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    const colorMapPurple = generators.imageDescriptorHelper(generators.colorMap.examples.purple);
    const purpleJuliaSpi = colorMapPurple({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaSpi(25, 2), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    const colorMapSpring = generators.imageDescriptorHelper(generators.colorMap.examples.spring);
    const springJuliaPeak = colorMapSpring({
        f: focus(generators.colorMap.predicate.juliaShapes.juliaPeak(7, 3), height, width, -1, 1, -1, 1),
        min: -1,
        max: 1
    })();


    pixel = generators.generate({
        src: snowMandelBrot,
        linker: {
            composition: screen
        },
        dst: {
            src: voronoiPenta
        }
    });

    pixel = generators.generate({
       src: {
           ...simplexNoise,
           filters: {
               ...effect3D(1)(
                   smallRepeat(2)()
               )
           }
       }
    });
    */

    const pixel = generators.generate(starsXplanet);

    return imageGeneration(canvas, width, height, pixel);
}

exports.getImage = getImage;
