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
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            let progress = (((n+1)/4)/(height*width)*100).toFixed(2)
            if (progress % 2.5 === 0) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`Generating Image: ${progress}%`);
            }
            let pixelColor = getPixelColor(x, y);
            image.data[n] = pixelColor.red;
            image.data[n + 1] = pixelColor.green;
            image.data[n + 2] = pixelColor.blue;
            image.data[n + 3] = pixelColor.alpha;
        }
    }
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
                        noiseSeed: 44
                    }
                },
                qMultiplier: 40,
                rMultiplier: 20,
                colored: true
            }
        }
    );



    // Colormap
    
    //function f(z){return [z[0]*(z[0]**2-z[1]**2)-2*z[0]*z[1]**2+0.23,2*z[0]**2*z[1]+z[1]*(z[0]**2-z[1]**2)-0.970];}
    //pixel = colorMaps.colormaps.jet(colorMapPredicate.focused(colorMapPredicate.juliaSpi(15), height, width, -1, 1, -1, 1), 0,2);

    //pixel = generatorsleo.getColormap(generators.fractionalBrownianMotionGen(width, height, "perlin", 25687, ['simplex', 10],4, 0.5, 2, 2, 0.2, false,true), "hot", -1, 1);

    
    //function f1(z){return [0,0.16*z[1]];}
    //function f2(z){return [0.85*z[0]+0.04*z[1],-0.04*z[0]+0.85*z[1]+1.60];}
    //function f3(z){return [0.2*z[0]-0.26*z[1],0.23*z[0]+0.22*z[1]+1.60];}
    //function f4(z){return [-0.15*z[0]+0.28*z[1],0.26*z[0]+0.24*z[1]+0.44];}
    //let p = [0.01,0.86,0.93,1]
    //pixel = generatorsleo.getColormap(colorMapPredicate.focused(colorMapPredicate.IFS([f1,f2,f3,f4],p,4,500,0.5),height,width,-5,5,-5,5),"island",0,6);


    //Voronoi

    //function f(t){return [Math.sin(t)/(1+Math.cos(t)**2),Math.sin(t)*Math.cos(t)/(1+Math.cos(t)**2)];}
    //pixel = generatorsleo.voronoi([[200,200],[120,140],[70,155]],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255)])
    //pixel = generatorsleo.voronoi([[0,0],[50,0],[100,0],[25,50],[75,50]],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255),helpers.getColor(120,200,0,255),helpers.getColor(0,50,80,255)])
    //pixel = functionMap.focused(generatorsleo.voronoi([f(-1*Math.pi),f(-1*Math.pi+1.5),f(-1*Math.pi+3),f(-1*Math.pi+4.5),f(-1*Math.pi+6)],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255),helpers.getColor(120,200,0,255),helpers.getColor(0,50,80,255)]),height,width,-10,10,-10,10)
    //pixel = filtersleo.smooth2(generatorsleo.getColormap(functionMap.focused((x,y)=>{return functionMap.mandelbrot(50)(x%0.5-1,y%1-0.4);},height,width,0,5,0,5),"hot",0,10),height,width);

    //pixel = (x,y)=>{let noise = generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex'],8, 0.6, 2, 2, 0.07, false,true);return generatorsleo.predEqTriangle(50,helpers.getColor(255,0,0,255),helpers.getColor(0,0,255,255))(x+20*noise(x,y),y-20*noise(x,y));};

    //pixel = (x,y)=>{let noise = generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex'],8, 0.6, 2, 2, 0.07, false,true);return generatorsleo.getColormap(functionMap.focused(functionMap.juliaDragon(15),height,width,-1,1,-1,1),"hot",0,2)(x+10*noise(x,y),y-10*noise(x,y));};

    //let generator = generatorsleo.getColormap(functionMap.focused(functionMap.juliaDragon(25),height,width,-1,1,-1,1),"light",0,10);
    //let generator3 = generatorsleo.getColormap(generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex',78],4, 0.6, 2, 2, 0.07, false,true),"hot",-1,0.8);
    //let f = (x,y)=>{let value = (x%4-2)**2+(y%4-2)**2 ; if (value > 2) {return value;}; return -2 ;};
    //let f1 = (x,y)=>{let value = (2*x)**2+(2*y)**2 ; if (value < 5 ) {return value;}; return 6.99;};
    //let generator2 = generatorsleo.getColormap(functionMap.focused(f1,height,width,-2,2,-2,2),"greys",-2,7);
    //pixel = filtersleo.smooth2(filtersleo.composition(filtersleo.composition(generator3,generatorsleo.getColormap(f1,"greys",0,5),"Multiply"),generator2,"Multiply",),height,width);
    //pixel = filtersleo.composition(generator,generator3,"Multiply");
    //pixel = generatorsleo.voronoiRandom(height,width,20);
    //pixel = generatorsleo.generatorVoronoi([[200,200],[120,140],[70,155]],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255)])
    //pixel = generatorsleo.generatorVoronoi([[0,0],[50,0],[100,0],[25,50],[75,50]],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255),helpers.getColor(120,200,0,255),helpers.getColor(0,50,80,255)])
    //pixel = colorMapPredicate.focused(generatorsleo.voronoi([f(-1*Math.pi),f(-1*Math.pi+1.5),f(-1*Math.pi+3),f(-1*Math.pi+4.5),f(-1*Math.pi+6)],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255),helpers.getColor(120,200,0,255),helpers.getColor(0,50,80,255)]),height,width,-10,10,-10,10)
		  
    
    //Bee
   
    //pixel = generatorsleo.generatorBeePattern({color1:helpers.getColor(0,0,0,255),color2:helpers.getColor(140,120,0,255)});
    // pixel2 = generatorsleo.generatorBeePattern({
                                              
    //                                           color1: helpers.getColor(250, 200, 100, 255),
    //                                           color2: helpers.getColor(0, 0, 0, 255)
    //                                         });
    //pixel = generatorsleo.generatorVoronoi([[0, 0], [80, 80], [500, 500], [0, 250], [250, 0]], [helpers.getColor(250, 50, 50, 255), helpers.getColor(250, 250, 250, 255), helpers.getColor(250, 50, 50, 255), helpers.getColor(250, 50, 50, 255), helpers.getColor(250, 50, 50, 255)])
    //pixel = generatorsleo.generatorVoronoi([[250, 0], [0, 250]], [helpers.getColor(250, 50, 50, 255), helpers.getColor(50, 50, 250, 255)])
    //pixel = generatorsleo.generatorVoronoiRandom(height, width, 20);
    //pixel = filtersleo.composition(pixel, pixel2, "Xor", helpers.getColor(0, 0, 0, 255));

    //rand = helpers.makeRandom();
    // pixel = function i(x, y) {
    //     function iPrim(x,y, f){
    //         //return f(x,y);
    //         coord = { x: x, y: y };
    //         // if (y > 250)
    //         //     coord = { x: x, y: 500 - y };
    //         // if (x > 250)
    //         //     coord.x = 500 - x;
    //         //return f(coord.x, coord.y);
    //         distance = Math.sqrt(((250-coord.x)*(250-coord.x)) + Math.abs(((250-coord.y)*(250-coord.y)))); 
    //         c = f((coord.x*coord.x-distance)/distance, (coord.y*coord.y-distance)/distance);
    //         return helpers.getColor(c.red, c.green , c.blue, Math.max(distance%256, 255));
    //     }
    //     f = function (x, y) {
            
    //     return helpers.getColor(1 / (1 / x + 1 / y) , 1 / (1 / x - 1 / y), (1 / x) * 255, 255);
        // sphere = {x:250, y:250,radius:250};
        // const distance = (x - sphere.x) * (x - sphere.x) +
        //     (y - sphere.y) * (y - sphere.y);

        // return  distance < sphere.radius * sphere.radius ? 
        // helpers.getColor((distance), ((500-distance)), ((500 + distance * 1)), 255 % distance) : 
        // helpers.getColor((distance * 1), ((rand() * 500) / distance) / distance, distance, 255);
    // }
    //     distance = {x: x, y: y};
        
    //     fPrim = iPrim(distance.x, distance.y,f);
    //     return fPrim;
    // }
    // pdixel = function (x, y) {
    //     y = 500- y;
    //     x = 500 - x;
    //     t = y;
    //     y = 250-x;
    //     x = 250-t;
    //     return helpers.getColor(1 / (1 / x + 1 / y) , 1 / (1 / x - 1 / y), (1 / x) * 255, 255);
    // }
    // pixel = function (x, y) {
    //     sphere = {x:250, y:250,radius:250};
    //     const distance = (x - sphere.x) * (x - sphere.x) +
    //         (y - sphere.y) * (y - sphere.y);
            
    //     return  distance < sphere.radius * sphere.radius ? 
    //     helpers.getColor((distance), (rand()*(500-distance)), ((500 + distance * rand())), 255 % distance) : 
    //     helpers.getColor((distance * rand()), ((rand() * 500) / distance) / distance, distance, 255);
    // }



    
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

    //Opacity Changer with value
    //pixel = filtersLucas.opacityChanger(pixel, 255);
    
    //let matrices = filtersleo.canvasToMatrix(canvas,height,width);
    //let matricesfiltered = filtersleo.reverseImg(matrices,"","");
    //canvas = filtersleo.MatrixToCanvas(matricesfiltered,height,width);
    //let options = { min: -2, max: 0 , f: (x,y) => x };
    //pixel = colorMaps.colorMaps.greys(options);
    canvas = imageGeneration(canvas, width, height, pixel);
    
    return canvas;
}

exports.getImage = getImage;
