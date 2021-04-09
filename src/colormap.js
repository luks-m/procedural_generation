const helpers = require('./helpers.js');


function gradient(x,min,max,begin,end){

    let dist = max-min;
    return begin + ((end-begin) * (((x-min)%dist)/dist));
}

function multiGradient(x,min,max,begin,end){

    let dist = max-min;

    let val = (x-min);
    let new_val = 0 ;
    let index = 0 ;
    
    if (val !== 0){	
	index = Math.floor((val%dist)*begin.length/dist);
	new_val = ((val%dist)*begin.length/dist);
    }
    else {
	index  = 0 ;
	new_val = 0;
    }

    return begin[index] + ((end[index]-begin[index]) * (new_val-Math.floor(new_val)));
}

function generalColormap(f,min,max,beginRed,endRed,beginGreen,endGreen,beginBlue,endBlue,beginOpacity,endOpacity){

    function genColormap(x,y){
	let res = f(x,y);
	let red = multiGradient(res,min,max,beginRed,endRed);
	let green = multiGradient(res,min,max,beginGreen,endGreen);
	let blue = multiGradient(res,min,max,beginBlue,endBlue);
	let opacity = multiGradient(res,min,max,beginOpacity,endOpacity);
	return helpers.getColor(red,green,blue,opacity);
    }
    return genColormap;
}

function colormapGreys(f,min,max){

    function greys(x,y){

	return generalColormap(f,min,max,[255],[0],[255],[0],[255],[0],[255],[255])(x,y);
    }
    return greys;
}


function colormapMushroom(f,min,max){

    function mushroom(x,y){

	return generalColormap(f,min,max,[255],[0],[0],[255],[0],[255],[255],[255])(x,y);
    }
    return mushroom;
}

function colormapSpring(f,min,max){

    function spring(x,y){

	return generalColormap(f,min,max,[255],[0],[0],[255],[0],[0],[255],[255])(x,y);
    }
    return spring;
}

function colormapJet(f,min,max){

    function jet(x,y){

	return generalColormap(f,min,max,[255],[0],[0],[0],[0],[255],[255],[255])(x,y);
    }
    return jet;
}

function colormapHSL(f,min,max){

    function hsl(x,y){

	return generalColormap(f,min,max,[240],[240],[0],[255],[97],[97],[255],[255])(x,y);
    }
    return hsl;
}

function colormapLight(f,min,max){

    function light(x,y){

	return generalColormap(f,min,max,[0,0,0,0,125],[0,0,125,255,0],[0,125,255,125,0],[125,255,125,0,0],[255,125,0,0,0,0],[125,0,0,0,0,0],[255],[255])(x,y);
    }
    return light;
}

function colormapIsland(f,min,max){

    function island(x,y){

	return generalColormap(f,min,max,[0,135,249,127,154,128],[0,135,249,127,154,128],[0,206,228,255,205,128],[0,206,228,255,205,128],[255,235,183,0,50,0],[255,235,183,0,50,0],[255],[255])(x,y);
    }
    return island;
}

function colormapIslandD(f,min,max){

    function island(x,y){

	return generalColormap(f,min,max,[0,135,249,127,154,128],[135,249,127,154,128,128],[0,206,228,255,205,128],[206,228,255,205,128,128],[255,235,183,0,50,0],[235,183,0,50,0,0],[255],[255])(x,y);
    }
    return island;
}

function colormapSnow(f,min,max){

    function snow(x,y){

	return generalColormap(f,min,max,[0,0,120,240],[0,120,240,110],[0,0,120,0],[0,120,0,0],[255],[255],[255,120,0,0],[120,0,0,0])(x,y);
    }
    return snow;
}

function colormapHot(f,min,max){

    function hot(x,y){

	return generalColormap(f,min,max,[0,0,120,240],[0,120,240,110],[0,0,120,0],[0,120,0,0],[255,120,0,0],[120,0,0,0],[255],[255])(x,y);
    }
    return hot;
}



const colormaps = {greys:colormapGreys,mushroom:colormapMushroom,hot:colormapHot,spring:colormapSpring,jet:colormapJet,hsl:colormapHSL,light:colormapLight,island:colormapIsland,islandD:colormapIslandD,snow:colormapSnow} ;

exports.colormaps = colormaps;
exports.generalColormap = generalColormap;

