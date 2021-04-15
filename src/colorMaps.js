const helpers = require('./helpers.js');

function multiGradient(x, min, max, varations) {
    let step = varations.length / (max - min);
    let normedValue = (x - min) % (max - min);
    
    let newValue = 0;
    let index = 0;
    if ((x - min) !== 0) {
        index = Math.floor(normedValue * step);
        newValue = (normedValue * step);
    }

    return varations[index][0] + ((varations[index][1] - varations[index][0]) * (newValue - Math.floor(newValue)));
}

function generalColormap(f, min, max, redVariations, greenVariations, blueVariations, alphaVariations) {
    function genColormap(x, y){
        let res = f(x, y);
        let red = multiGradient(res, min, max, redVariations);
        let green = multiGradient(res, min, max, greenVariations);
        let blue = multiGradient(res, min, max, blueVariations);
        let alpha = multiGradient(res, min, max, alphaVariations);
        return helpers.getColor(red, green, blue, alpha);
    }
    return genColormap;
}

function colormapGreys(f, min, max) {
    function greys(x, y) {
        return generalColormap(f,min,max,[[255, 0]], [[255, 0]],[[255, 0]], [[255, 255]])(x, y);
    }
    return greys;
}


function colormapMushroom(f, min, max) {
    function mushroom(x, y) {
        return generalColormap(f, min, max, [[255, 0]], [[0, 255]], [[0, 255]], [[255, 255]])(x, y);
    }
    return mushroom;
}

function colormapSpring(f, min, max) {
    function spring(x, y) {
        return generalColormap(f, min, max, [[255, 0]], [[0, 255]], [[0, 0]], [[255, 255]])(x, y);
    }
    return spring;
}

function colormapJet(f, min, max) {
    function jet(x, y) {
        return generalColormap(f, min, max, [[255, 0]], [[0, 0]], [[0, 255]], [[255, 255]])(x, y);
    }
    return jet;
}

function colormapHSL(f, min, max) {
    function hsl(x, y) {
        return generalColormap(f, min, max, [[240, 240]], [[0, 255]], [[97, 97]], [[255, 255]])(x, y);
    }
    return hsl;
}

function colormapLight(f, min, max) {
    function light(x, y){
        return generalColormap(f, min, max, [[0, 0], [0, 0], [0, 125], [0, 255], [125, 0]], [[0, 125], [125, 255], [255, 125], [125, 0], [0, 0]], [[255, 125], [125, 0], [0, 0], [0, 0], [0, 0], [0, 0]], [[255, 255]])(x, y);
    }
    return light;
}

function colormapIsland(f, min, max) {
    function island(x, y) {
        return generalColormap(f, min, max, [[0, 0], [135, 135], [249, 249], [127, 127], [154, 154], [128, 128]], [[0,0], [206,206], [228,228],[255,255],[205,205],[128,128]],[[255, 255],[235,235],[183, 183],[0,0],[50, 50],[0,0]],[[255,255]])(x, y);
    }
    return island;
}

function colormapIslandD(f, min, max) {
    function island(x, y) {
        return generalColormap(f, min, max, [[0,135], [135,249],[249,127],[127,154],[154,128],[128,128]],[[0,206],[206,228],[228,255],[255,205],[205,128],[128,128]],[[255,235],[235,183],[183,0],[0,50],[50,0],[0,0]],[[255,255]])(x, y);
    }
    return island;
}

function colormapSnow(f, min, max) {
    function snow(x, y) {
        return generalColormap(f, min, max,[[0,0],[0,120],[120,240],[240,110]],[[0,120],[0,0],[120,0],[0,0]], [[255, 255]], [[255,120],[120,0],[0,0],[0,0]])(x,y);
    }
    return snow;
}

function colormapPurple(f, min, max) {
    function purple(x, y) {
        return generalColormap(f,min,max,[[0,0],[0,120],[120,240],[240,110]],[[0,0],[0,120],[120,0],[0,0]],[[255,120],[120,0],[0,0],[0,0]],[[255,255]])(x, y);
    }
    return purple;
}

function colormapHot(f,min,max) {
    function hot(x,y) {
        return generalColormap(f,min,max,[[28,28],[7,7],[0,0],[10,10],[37,37],[75,75],[121,121],[243,243],[203,203],[161,161],[113,113],[67,67],[23,23],[7,7],[1,1],[15,15],[48,48],[92,92],[140,140],[186,186],[222,222],[250,250]],
            [[8,8], [26,26], [59,59], [98,98],[136,136],[176,176],[211,211],[252,252],[142,142],[95,95],[58,58],[26,26],[5,5],[0,0],[11,11],[35,35],[71,71],[112,112],[158,158],[198,198],[227,227],[251,251]],
            [[1,1],[4,4],[8,8],[11,11],[19,19],[22,22],[35,35],[75,75],[123,123],[143,143],[152,152],[166,166],[185,185],[189,189],[207,207],[218,218],[227,227],[237,237],[244,244],[250,250], [247,247], [255,255]],
            [[255, 255]])(x,y);
    }
    return hot;
}



const colormaps = {
                    greys   : colormapGreys,
                    mushroom: colormapMushroom,
                    hot     : colormapHot,
                    spring  : colormapSpring,
                    purple  : colormapPurple,
                    jet     : colormapJet,
                    hsl     : colormapHSL,
                    light   : colormapLight,
                    island  : colormapIsland,
                    islandD : colormapIslandD,
                    snow    : colormapSnow
                };

exports.colormaps = colormaps;
exports.generalColormap = generalColormap;

