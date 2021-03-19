// ImageHandler = {
//     // Useful base operator for managing construction of the texture
//     OP: {
//         SET: function (x, y) { return y; },
//         ADD: function (x, y) { return x + y; },
//         SUB: function (x, y) { return x - y; },
//         MUL: function (x, y) { return x * y; },
//         DIV: function (x, y) { return x / y; },
//         AND: function (x, y) { return x & y; },
//         XOR: function (x, y) { return x ^ y; },
//         MIN: function (x, y) { return Math.min(x, y); },
//         MAX: function (x, y) { return Math.max(x, y); },
//         RAND: function (max) { return Math.floor(Math.random() * Math.floor(max)); }
//     }
// };

// ImageHandler.Texture = function (width, height) {
//     // [r, g, b, a]
//     this.color = new Float32Array([1,1,1,1]);

//     // container of an image data
//     this.buffer = new ImageHandler.Buffer(width, height);

//     // copy of the image data to manipulate before applying modification to the buffer
//     this.bufferCopy = new ImageHandler.Buffer(width, height);
// };

// ImageHandler.Texture.prototype = {
//     // Apply modification of an edit function
//     apply: function (edit) {
//         edit(this);
//         return this;
//     },
//     // Function to transform this texture to a context.createImageData
//     toImageData: function (context) {
//         let buffer = this.buffer;
//         let array = buffer.array;
//         let imagedata = context.createImageData(buffer.width, buffer.height);
//         let data = imagedata.data;

//         for (let i = 0; i < array.length; i += 4) {
//             data[i] = array[i];
//             data[i + 1] = array[i + 1];
//             data[i + 2] = array[i + 2];
//             data[i + 3] = array[i + 3];
//         }
//         return imagedata;
//     },
//     // Function to put this texture in a canvas
//     toCanvas: function (canvas) {
//         if (canvas === undefined)
//             canvas = document.createElement('canvas');
//         canvas.width = this.buffer.width;
//         canvas.height = this.buffer.height;

//         let context = canvas.getContext('2d');
//         let imagedata = this.toImageData(context);
//         context.putImageData(imagedata, 0, 0);
//         return canvas;
//     }
// };

// ImageHandler.Buffer = function (width, height) {
//     this.width = width;
//     this.height = height;
//     this.array = new Float32Array(width * height * 4);
//     this.color = new Float32Array(4);
// };

// ImageHandler.Buffer.prototype = {
//     // Function copy of the buffer passed in parameters to this.buffer
//     copy: function (buffer) {
//         this.array.set(buffer.array);
//     },
//     // Function returning a pixel [r, g, b, a] of a coordinate x, y
//     getPixelNearest: function (x, y) {
//         if (y >= this.height)
//             y -= this.height;
//         if (y < 0)
//             y += this.height;
//         if (x >= this.width)
//             x -= this.width;
//         if (x < 0)
//             x += this.width;

//         let array = this.array;
//         let color = this.color;
//         let offset = Math.round(y) * this.width * 4 + Math.round(x) * 4;

//         color[0] = array[offset];
//         color[1] = array[offset + 1];
//         color[2] = array[offset + 2];

//         return this.color;
//     }
// };

// ImageHandler.Monochrome = function (object) {
//     let tint = new Float32Array([1, 1, 1, 1]);

//     object.tint = function (r, g, b, a) {
//         tint[0] = r;
//         tint[1] = g;
//         tint[2] = b;
//         tint[3] = a;
//         return this;
//     };

//     object.getTint = function () {
//         return tint;
//     };

//     object.compute = function () {
//         let x = 0, y = 0;
//         let array = this.buffer.array;
//         let width = this.buffer.width;
//         let tint = this.getTint();
//         for (let i = 0; i < array.length; i += 4) {
//             this.buffer.array[i] += this.color[0] * tint[0];
//             this.buffer.array[i + 1] += this.color[1] * tint[1];
//             this.buffer.array[i + 2] += this.color[2] * tint[2];
//             this.buffer.array[i + 3] += this.color[3] * tint[3];
//             if (++x === width) {
//                 x = 0; y++;
//             }
//         }
//         return this;
//     };

//     return object;
// };

// let canvas = document.getElementById('drawing_board');
// let texture = new ImageHandler.Texture(350, 350)
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .apply((object) => new ImageHandler.Monochrome(object).tint(100, 10, 100, 255).compute())
//     .toCanvas(canvas);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function imageGeneration(canvas, width = canvas.width, height = canvas.height, getPixelColor) {
    let context = canvas.getContext("2d");
    let image = context.createImageData(width, height);
    canvas.width = width;
    canvas.height = height;
    let n = 0; // Index inside the image array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++, n += 4) {
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

const width = 500, height = 500;
let canvas = document.getElementById('drawing_board');
imageGeneration(canvas, width, height, (x, y) => { return {red: getRandomInt(255), green: getRandomInt(255), blue: getRandomInt(255), alpha: getRandomInt(255)};});