
export const $RtcIf = (condition, node) => {
    return condition ? node : null;
}
export const $RtcIfElse = (condition, node, elseNode) => {
    return condition ? node : elseNode;
}
export const $RtcFor = (items, callback) => {
    if (items && Array.isArray(items) && items.length) {
        return items.map(callback);
    } else if (items && typeof items === 'object' && Object.entries(items).length === 0 && items.constructor === Object) {
        return Object.keys(items).map((key, i) => callback(items[key],i, key));
    }
}
export const $RtcModel = (context , key) => {
    return (event) => {
        console.log(' event : ', event);
        let value;
        if (typeof event === 'string') {
            value = event;
        } else {
            value = event.target.value;
        }
        context.setState({ [key]: value });
    }
}

export default {
    $RtcIf,
    $RtcFor,
    $RtcIfElse,
    $RtcModel
}
