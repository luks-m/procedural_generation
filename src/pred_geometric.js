function isEven(x){

    return (x%2 === 0);
}

function isOdd(x){

    return (x%2 !== 0);
}
	
function sameParity(x,y){
    return (isEven(x) && isEven(y)) || (isOdd(x) && isOdd(y)) ;  
}

function predTrue(x,y,size,width){
 
    return x===x && y===y && size===size && width===width;
}

function predFalse(x,y,size,width){

    return x!==x && y!==y && size!==size && width!==width;
}

function predTopLine(x,y,size,width){

    return x%size < width && y===y ;
}

function predBottomLine(x,y,size,width){

    return (size-x%size) < width && y===y;  
}

function predLeftLine(x,y,size,width){

    return y%size < width && x===x;
}

function predRightLine(x,y,size,width){

    return (size-y%size) < width && x===x;  
}

function predCornerTopRight(x,y,size,width){

    return (x%size) > (y%size) - width;
}

function predCornerTopLeft(x,y,size,width){

    return (size-x%size) > (y%size) - width;
}

function predCornerBottomRight(x,y,size,width){

    return (x%size) > (size-y%size) - width;
}

function predCornerBottomLeft(x,y,size,width){

    return (x%size) < (y%size) + width;
}

function predDiagBottomRightTopLeft(x,y,size,width){

    return !predCornerBottomLeft(x,y,size,-width/2) && !predCornerTopRight(x,y,size,-width/2);
}

function predDiagBottomLeftTopRight(x,y,size,width){

    return !predCornerBottomRight(x,y,size,-width/2) && !predCornerTopLeft(x,y,size,-width/2);
}

function whichPart(x,y,size){

    return [Math.floor(x/size),Math.floor(y/size)];
}

function isSquareDiag(x,y,size){

    return (x===0 || x===size) && (y===0 || y===size);
}

exports.isEven = isEven;
exports.isOdd = isOdd;
exports.sameParity = sameParity;
exports.predTrue = predTrue;
exports.predFalse = predFalse;
exports.predTopLine = predTopLine;
exports.predBottomLine = predBottomLine;
exports.predLeftLine = predLeftLine;
exports.predRightLine = predRightLine;
exports.predCornerTopRight = predCornerTopRight;
exports.predCornerTopLeft = predCornerTopLeft;
exports.predCornerBottomRight = predCornerBottomRight;
exports.predCornerBottomLeft = predCornerBottomLeft;
exports.predDiagBottomRightTopLeft = predDiagBottomRightTopLeft;
exports.predDiagBottomLeftTopRight = predDiagBottomLeftTopRight;
exports.whichPart = whichPart;
exports.isSquareDiag = isSquareDiag;
