

export const $DurationToMinutes = (value) => {
    if (!value) return;
    value = +Number(value).toFixed();
    const minutes = Math.floor(value / 60);
    //  return minutes + ':' + (value - minutes * 60);
    return minutes.toString().padStart(2, '0') + ':' + (value - minutes * 60).toString().padStart(2, '0');
}

export const $MaxStringLength = ( str ,max) => {
    if (!str) return;
    if (str && !max) return str;
    if ( str.length > max) return str.substr(0, max + 1) + '...';

    return str;
}


export default {
    $DurationToMinutes,
}
