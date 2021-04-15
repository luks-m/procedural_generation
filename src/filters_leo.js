function mirror(generator, axe, height, width) {
    if (axe === "x") {
        return (x, y) => generator(width - x, y);
    }
    if (axe === "y") {
        return (x, y) => generator(x, height - y);
    }
    if (axe === "xy") {
        return (x, y) => generator(width - x, height - y);
    }
}

// TODO : Rework filters in order to implement the link between multiple filter
function filters(filters){
    function getfilters(x, y) {
        function getColor(acc, curr) {
            acc = (x, y) => curr(acc(x, y));
            return acc;
        }
        let filter = filters.reduce((acc, curr) => getColor(acc, curr), (x, y) => { return [x, y]; })

        return filter(x, y);
    }
    return getfilters;
}

exports.mirror = mirror;
exports.filters = filters;
