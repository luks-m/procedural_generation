const helpers = require('./helpers.js')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let randGen = (x, y) => helpers.getColor(getRandomInt(255), getRandomInt(255), getRandomInt(255), getRandomInt(255));

exports.randGen = randGen;