function lace(x, y) {
    return Math.log(Math.sin(x * x + y * y) / x);
};

function wave(x, y) {
    return Math.sin(x + y ** 2) * Math.sqrt(x ** 2 + y ** 2) / (10);
};

function streched(x, y) {
    return Math.log(Math.abs(x)) + Math.sin(y);
};

function mosaic(x, y) {
    return Math.cos(x * y) * Math.sqrt(x ** 2 + y ** 2) / (x * y - 2 * x ** 2 - y ** 2);
};

function flag(x, y) {
    return Math.sin(x / 10 + y / 10) * (x ** 3) * (y ** 2);
};

function pic(x, y) {
    return Math.sin(x ** 2 + 3 * y ** 2) / (0.1 + Math.sqrt(x ** 2 + y ** 2)) + (x ** 2 + 5 * y ** 2) * Math.exp(1 - (x ** 2 + y ** 2)) / 2;
};

//function f(x,y) {return 1/2*(1-Math.cos(1/(Math.sqrt(x**2+y**2))*Math.sin(x)));}

function mandelbrotSet(max) {
    function mandel(x, y) {
        let c = [x, y];
        let z = [0, 0];
        let i = 0;
        while (Math.sqrt(z[0] ** 2 + z[1] ** 2) < 2 && i < max) {
            z = [c[0] - z[1] ** 2 + z[0] ** 2, c[1] + 2 * z[1] * z[0]];
            i += 1;
        }
        return Math.sqrt(z[0] ** 2 + z[1] ** 2);
    }
    return mandel;
}

function julia(max, c) {
    function mandel(x, y) {
        let z = [x, y];
        let i = 0;
        while (Math.sqrt(z[0] ** 2 + z[1] ** 2) < 2 && i < max) {
            z = [c[0] - z[1] ** 2 + z[0] ** 2, c[1] + 2 * z[1] * z[0]];
            i += 1;
        }
        return Math.sqrt(z[0] ** 2 + z[1] ** 2);
    }
    return mandel;
}

function juliaSquare(max) {
    return julia(max, [0.3, 0.5]);
}

function juliaSpi(max) {
    return julia(max, [0.285, 0.01]);
}

function juliaPeak(max) {
    return julia(max, [-1.4107, 0.0099]);
}

function juliaElec(max) {
    return julia(max, [-0.038, 0.9754]);
}

function juliaCrown(max) {
    return julia(max, [-1.476, 0]);
}

function juliaBubble(max) {
    return julia(max, [-0.4, -0.6]);
}

function juliaDragon(max) {
    return julia(max, [-0.8, 0.156]);
}

function fractale(max, f) {
    function mandelbrotIteration(x, y) {
        let z = [x, y];
        let i = 0;
        while (Math.sqrt(z[0] ** 2 + z[1] ** 2) < 2 && i < max) {
            z = f(z);
            i += 1;
        }
        return Math.sqrt(z[0] ** 2 + z[1] ** 2);
    }
    return mandelbrotIteration;
}


function focused(f, height, width, xmin, xmax, ymin, ymax) {
    let rapport_x = (xmax - xmin) / width;
    let rapport_y = (ymax - ymin) / height;
    return (x, y) => f(xmin + x * rapport_x, ymin + y * rapport_y);
}

function IFS(f, prob, length, N, p) {

    let array = [[0, 0]];
    let z = [0, 0];
    for (let i = 0; i < N; i++) {
        let r = Math.random();
        for (let j = 0; j < length; j++) {
            if (r <= prob[j]) {
                z = f[j](z);
            }
        }
        array.push(z);
    }
    function ifs(x, y) {
        function norm(vec1, vec2) {
            return Math.sqrt((vec1[0] - vec2[0]) ** 2 + (vec1[1] - vec2[1]) ** 2);
        }

        for (let i = 0; i < array.length; i++) {
            if (norm(array[i], [x, y]) < p) {
                return 5;
            }
        }
        return 0;
    }
    return ifs;
}

const juliaShapes = {
                        juliaSquare : juliaSquare,
                        juliaSpi    : juliaSpi,
                        juliaPeak   : juliaPeak,
                        juliaElec   : juliaElec,
                        juliaCrown  : juliaCrown,
                        juliaBubble : juliaBubble,
                        juliaDragon : juliaDragon
                    };

exports.wave = wave;
exports.mandelbrotSet = mandelbrotSet;
exports.julia = julia;
exports.juliaShapes = juliaShapes;
exports.fractale = fractale;
exports.IFS = IFS;
exports.focused = focused;
