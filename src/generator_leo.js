const helpers = require('./helpers.js');
const geometric = require('./pred_geometric.js');
const colormap = require('./colormap.js');

function predUni(x,y){
    
    return x===x && y===y;
}

function predRectTriangle(size,color_1,color_2){

    function rectTriangle(x,y){
	if((x%size < y%size)){
          return color_1;
	}
	return color_2;
    }

    return rectTriangle;
	
}

function predZigzag(size,color_1,color_2){
    
    function zigzag(x,y){

	if (geometric.isEven((y-y%size)/size)){
            if (x%size < (size/2-y%size/2) || x%size > (size/2+y%size/2)){
		return color_1;
            }
            return color_2;
	}
	else if (!(x%size < (size/2-y%size/2) || x%size > (size/2+y%size/2))){
            return color_1;
	}
	return color_2;
    }
    return zigzag;
}

function predIsoTriangle(size,color_1,color_2){

    function isoTriangle(x,y){
	if (geometric.isEven((y-y%size)/size)){
            if (x%size < (size/2-y%size/2) || x%size > (size/2+y%size/2)){
		return color_1;
            }
            return color_2;
	}
	else if(x%size > (size/2-(size-y)%size/2) || x%size < (size/2+(size-y)%size/2)){
            return color_1;
	}
	return color_2;
    }
    return isoTriangle;
}

function predEqTriangle(size,color_1,color_2){

    function EqTriangle(x,y){

	if (geometric.isEven((y-y%size)/size)){
            if (x%size < (size/2-y%size/2) || x%size > (size/2+y%size/2)){
		return color_1;
            }
            return color_2;
	}
	if (x%size > (y%size/2) && x%size < (size-y%size/2)){
            return color_1;
	}
	return color_2;
    }
    return EqTriangle;
}



function predQuad(size,color_1,color_2){

    function quad(x,y){
	if (geometric.sameParity(x/size,y/size)){
            return color_1;
	}
	return color_2;
    }

    return quad;
}

function predVichy(size,color_1,color_2){

    function vichy(x,y){
	if (geometric.sameParity(x%size,y%size)){
            return color_1;
	}
	return color_2;
    }

    return vichy;
}

function predSquare(size,color_1,color_2){

    function square(x,y){

	if(geometric.sameParity((x-x%size)/size,(y-y%size)/size)){
            return color_1;
	}
	return color_2;
    }
    return square;
}

function predDoubleVichy(size,color_1,color_2){

    function doubleVichy(x,y){

	if (helpers.compareColor(predSquare(size,color_1,color_2)(x,y),color_1)){
            return predVichy(size/2,color_2,color_1)(x,y);
	}
	return predVichy(size/2,color_1,color_2)(x,y);
    }
    return doubleVichy;
}

function predHourglass(size,color_1,color_2){

    function hourglass(x,y){

	if (y%size < size/4){
            return predEqTriangle(size,color_1,color_2)(x,y);
	}
	if (y%size > (3*size/4)){
            return predEqTriangle(size,color_1,color_2)(x,y);
	}
	return color_1;
    }
    return hourglass;
}

function predUnknown(size,color_1,color_2){

    function unknown(x,y){

	if (geometric.isEven((y-y%size)/size)){
            if (helpers.compareColor(predEqTriangle(size/2,color_1,color_2)(x,y),color_2) && ((x-size/2)-(x-size/2)%size)/size%2===0){
		return color_1;
            }
            return color_2;
	}
   
	else {
            if (!(helpers.compareColor(predEqTriangle(size/2,color_1,color_2),color_2) && ((x-size/2)-(x-size/2)%size)/size%2===0)){
		return color_1;
            }
            return color_2;
	}
    }
	
    return unknown;
}

function predHex(size,width,color1,color2){

    const pred = [[geometric.predDiagBottomLeftTopRight,geometric.predTopLine,geometric.predDiagBottomRightTopLeft],[geometric.predLeftLine,geometric.predFalse,geometric.predRightLine],[geometric.predDiagBottomRightTopLeft,geometric.predBottomLine,geometric.predDiagBottomLeftTopRight]];

    function hex(x,y){

	let [index1,index2] = geometric.whichPart(x%size,y%size,size/3);

	if (geometric.isSquareDiag(index1,index2,size/3)){

            if (pred[index1][index2](x%size,y%size,size/3,width)){
		return color1;
            }
            return color2;
	}
	else {
            if (pred[index1][index2](x,y,size/3,width)){
		return color1;
            }
            return color2;
	}		
    }	  
    return hex;
}

function predGrandmaTexture(size1,size2,width,color1,color2){
    
    const pred1 = predDoubleVichy(size1,color1,color2);
    const pred2 = predHex(size2,width,color1,color2);

    function Grandma(x,y){

	if (helpers.compareColor(pred1(x,y),pred2(x,y))){
            return color1;
	}
        return color2;
    }
    return Grandma;
}

function getOtherColor(color,color1,color2){

    if (helpers.compareColor(color,color1)){
	return color2;
    }
    return color1;
}

function generator(generators,size,color1,color2){

    function getGenerators(x,y){

	function getColor(acc,curr){
            if (acc){	
		acc = helpers.compareColor(color1,curr);
            }
            else {	
		let new_color = getOtherColor(curr,color1,color2);
		acc = helpers.compareColor(color1,new_color);
            }
            return acc;
	}		
	let color = generators.map((f,i) => {let [x1,y1] = size[i](x,y) ; return f(x1,y1) ;});
	let bool = color.reduce((acc,curr) => getColor(acc,curr),true);
	if ( (bool && helpers.compareColor(color[color.length-1],color1))  || (!bool && !helpers.compareColor(color[color.length-1],color1)) ){
            return color[color.length-1];
	}
	return getOtherColor(color[color.length-1],color1,color2);
    }

    return getGenerators;
}
	
function bee(color1,color2){

    let size1 = 20;
    let size2 = 50;
    let width = 3;
    const pred1 = predGrandmaTexture(size1,size2/6,1,color1,color2);
    const pred2 = predHex(size2,width,color1,color2);
    const pred3 = predZigzag(5*size2/4,width,color1,color2);
    const f1 = (x,y) => {return [x,y];};
    const f2 = (x,y) => {return [x%size1,y%size1];};
    return generator([pred2,pred3,pred1],[f1,f2,f2],color1,color2);
}

function getColormap(f,colormap_,min,max,axis){

    return colormap.colormaps[colormap_](f,min,max,axis);
}

    

function predTest(color1,color2){

    let size1 = 20;
    let size2 = 50;
    let width = 3;
    const pred1 = predZigzag(size1,1,color1,color2);
    const pred2 = predVichy(10,color1,color2);
    const pred3 = predGrandmaTexture(5*size2/12,size1/7,width,color1,color2);
    const f1 = (x,y) => {return [x,y];};
    return generator([pred1,pred2,pred3],[f1,f1,f1],color1,color2);
}

function voronoi(center,color){


    function voronoi_(x,y){
	let array = center.map((i)=>{return helpers.norm(i,[x,y]);})
	let min;
	let index;
	for (let i =0  ; i<array.length ; i++){
	    if (i==0) {
		min = array[i];
		index = 0;
	    }
	    else if (array[i] < min){
		min = array[i];
		index = i ;
	    }
	}
	return color[index];
    }
    return voronoi_;
}

function voronoiRandom(height,width,number){

    let array=[];
    let color=[];
    for (let i = 0 ; i < number ; i++){
	array.push([Math.random()*width,Math.random()*height]);
	color.push(helpers.getColor(255*Math.random(),255*Math.random(),255*Math.random(),255));
    }
    return voronoi(array,color);
}

function hexagone(height,width,size){

    let array=[];
    let color=[];
    for (let i = 0 ; i < 1.5*Math.floor(height/size) ; i++){
	for (let j = 0 ; j < 1.5*Math.floor(width/size) ; j++){
	    if (geometric.isEven(i)){
		array.push([-1*size+j*size,i*size]);
	    }
	    else {
		array.push([-1*3/2*size+j*size,i*size]);
	    }
	    color.push(helpers.getColor(255*Math.random(),255*Math.random(),255*Math.random(),255));
	}
    }
    return voronoi(array,color);
}

function pentagone(height,width,size){

    let array=[];
    let color=[];
    for (let i = 0 ; i < 3*Math.floor(height/size) ; i++){
	for (let j = 0 ; j < 1.5*Math.floor(width/size) ; j++){
	    if (geometric.isEven(i)){
		array.push([-1*size+j*size+size/3,i*size/2]);
		array.push([-1*size+j*size-size/3,i*size/2]);
		array.push([-1*size+j*size,i*size/2-size/4]);
		array.push([-1*size+j*size,i*size/2+size/4]);
	    }
	    else {
		array.push([-1*3/2*size+j*size,i*size/2+size/4]);
		array.push([-1*3/2*size+j*size,i*size/2-size/4]);
		array.push([-1*3/2*size+j*size-size/3,i*size/2]);
		array.push([-1*3/2*size+j*size+size/3,i*size/2]);
		
	    }
	    color.push(helpers.getColor(255*Math.random(),255*Math.random(),255*Math.random(),255));
	    color.push(helpers.getColor(255*Math.random(),255*Math.random(),255*Math.random(),255));
	    color.push(helpers.getColor(255*Math.random(),255*Math.random(),255*Math.random(),255));
	    color.push(helpers.getColor(255*Math.random(),255*Math.random(),255*Math.random(),255));
	}
    }
    return voronoi(array,color);
}
    
	
    
    



exports.predUni = predUni ;
exports.predRectTriangle = predRectTriangle ;
exports.predIsoTriangle = predIsoTriangle;
exports.predEqTriangle = predEqTriangle;
exports.predQuad = predQuad ;
exports.predDoubleVichy = predDoubleVichy;
exports.predHourglass = predHourglass;
exports.predUnknown = predUnknown;
exports.predHex = predHex;
exports.predGrandmaTexture = predGrandmaTexture;
exports.bee = bee;
exports.predTest = predTest;
exports.getColormap = getColormap;
exports.generator = generator ;
exports.voronoi = voronoi ;
exports.voronoiRandom = voronoiRandom ;
exports.hexagone = hexagone;
exports.pentagone = pentagone;
