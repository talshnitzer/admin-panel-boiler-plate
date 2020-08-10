

export const stateObjectHandlerClassComp = function(objectKey) {
    return (key, value) => this.setState({[objectKey]: {...this.state[objectKey], [key]: value}});
}

export const stateObjectHandlerFuncComp = (handler) => {
    return (key, value, prevValue) => handler({...prevValue, [key]: value});
}

export const objectToFormData = (object, form = new FormData(), ignoredKeys = []) => {
    Object.keys(Object.assign({}, object)).forEach( key => {
        const value = object[key];
        // if the current key is not include in ignored keys
        if (!ignoredKeys.includes(key)) form.append(key,value);
    });
    return form;
}
