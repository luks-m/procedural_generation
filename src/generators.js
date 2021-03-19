
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let randGen = (x, y) => { return { red: getRandomInt(255), green: getRandomInt(255), blue: getRandomInt(255), alpha: getRandomInt(255) }; };

exports.randGen = randGen;