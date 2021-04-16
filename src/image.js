const helpers = require('./helpers.js');

const generators = require('./generators.js');
const generatorsLucas = require('./generators_lucas.js');
const generatorsleo = require('./generator_leo.js');
const colormaps = require('./colormap.js');
const functionMap = require('./function_map.js');


const filtersLucas = require('./filters_lucas.js');
const filtersleo = require('./filters_leo.js');

function imageGeneration(canvas, width, height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);

    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
            //console.log(x,y);
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
    //pixel = generatorsLucas.makeCheckerboard(width, height, 50,
	//						  helpers.getColor(255,0,0,255),
	//						  helpers.getColor(0,255,0,255));

    // Perlin Noise
    //pixel = generators.perlinNoiseGen(width, height, 'simplex', undefined, 8, undefined, false);

    // Fractional Brownian Motion
    //pixel = generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex'], 8, 0.5, 2, 2, 0.1, false);
    //pixel = generators.fractionalBrownianMotionGen(width, height, "worley", ['f2', 'euclidean', false], 2, undefined, undefined, undefined, undefined, false)
    //pixel = generators.fractionalBrownianMotionGen(width, height, "perlin", ['gradient'])

    // Worley Noise
    //pixel = generators.worleyNoiseGen(width, height, 'f2 - f1', 'euclidean', false, false);

    // Colormap
    //function f(z){return [z[0]*(z[0]**2-z[1]**2)-2*z[0]*z[1]**2+0.23,2*z[0]**2*z[1]+z[1]*(z[0]**2-z[1]**2)-0.970];}
    //pixel = generatorsleo.getColormap(functionMap.focused(functionMap.juliaSpi(15),height,width,-1,1,-1,1),"hot",0,2);

    //pixel = generatorsleo.getColormap(generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex'],8, 0.6, 2, 2, 0.07, false,true),"hot",-1,1);

    
    //function f1(z){return [0,0.16*z[1]];}
    //function f2(z){return [0.85*z[0]+0.04*z[1],-0.04*z[0]+0.85*z[1]+1.60];}
    //function f3(z){return [0.2*z[0]-0.26*z[1],0.23*z[0]+0.22*z[1]+1.60];}
    //function f4(z){return [-0.15*z[0]+0.28*z[1],0.26*z[0]+0.24*z[1]+0.44];}
    //let p = [0.01,0.86,0.93,1]
    //pixel = generatorsleo.getColormap(functionMap.focused(functionMap.IFS([f1,f2,f3,f4],p,4,500,0.5),height,width,-5,5,-5,5),"island",0,6);


    //voronoi

    //function f(t){return [Math.sin(t)/(1+Math.cos(t)**2),Math.sin(t)*Math.cos(t)/(1+Math.cos(t)**2)];}
    //pixel = generatorsleo.voronoi([[200,200],[120,140],[70,155]],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255)])
    //pixel = generatorsleo.voronoi([[0,0],[50,0],[100,0],[25,50],[75,50]],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255),helpers.getColor(120,200,0,255),helpers.getColor(0,50,80,255)])
    //pixel = functionMap.focused(generatorsleo.voronoi([f(-1*Math.pi),f(-1*Math.pi+1.5),f(-1*Math.pi+3),f(-1*Math.pi+4.5),f(-1*Math.pi+6)],[helpers.getColor(255,0,0,255),helpers.getColor(0,255,0,255),helpers.getColor(0,0,255,255),helpers.getColor(120,200,0,255),helpers.getColor(0,50,80,255)]),height,width,-10,10,-10,10)
    //pixel = filtersleo.smooth2(generatorsleo.getColormap(functionMap.focused((x,y)=>{return functionMap.mandelbrot(50)(x%0.5-1,y%1-0.4);},height,width,0,5,0,5),"hot",0,10),height,width);

    //pixel = (x,y)=>{let noise = generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex'],8, 0.6, 2, 2, 0.07, false,true);return generatorsleo.predEqTriangle(50,helpers.getColor(255,0,0,255),helpers.getColor(0,0,255,255))(x+20*noise(x,y),y-20*noise(x,y));};

    //pixel = (x,y)=>{let noise = generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex'],8, 0.6, 2, 2, 0.07, false,true);return generatorsleo.getColormap(functionMap.focused(functionMap.juliaDragon(15),height,width,-1,1,-1,1),"hot",0,2)(x+10*noise(x,y),y-10*noise(x,y));};

    let generator = generatorsleo.getColormap(functionMap.focused(functionMap.juliaDragon(25),height,width,-1,1,-1,1),"light",0,10);
    let generator3 = generatorsleo.getColormap(generators.fractionalBrownianMotionGen(width, height, "perlin", ['simplex',78],4, 0.6, 2, 2, 0.07, false,true),"hot",-1,0.8);
    let f = (x,y)=>{let value = (x%4-2)**2+(y%4-2)**2 ; if (value > 2) {return value;}; return -2 ;};
    let f1 = (x,y)=>{let value = (2*x)**2+(2*y)**2 ; if (value < 5 ) {return value;}; return 6.99;};
    let generator2 = generatorsleo.getColormap(functionMap.focused(f1,height,width,-2,2,-2,2),"greys",-2,7);
    pixel = filtersleo.smooth2(filtersleo.composition(filtersleo.composition(generator3,generatorsleo.getColormap(f1,"greys",0,5),"Multiply"),generator2,"Multiply",),height,width);
    //pixel = filtersleo.composition(generator,generator3,"Multiply");
    pixel = generatorsleo.voronoiRandom(height,width,20);
		  
    
    //Bee
   
    //pixel = generatorsleo.bee(helpers.getColor(0,0,0,255),helpers.getColor(140,120,0,255));

    
    
    ///////////////////// Filters : /////////////////////

    //Opacity Changer with value
    //pixel = filtersLucas.opacityChanger(pixel, 100);

    canvas = imageGeneration(canvas, width, height, pixel);

    
    //let matrices = filtersleo.canvasToMatrix(canvas,height,width);
    //let matricesfiltered = filtersleo.reverseImg(matrices,"","");
    //canvas = filtersleo.MatrixToCanvas(matricesfiltered,height,width);
    
    return canvas;
}

exports.getImage = getImage;
