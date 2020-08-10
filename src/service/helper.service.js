// import {categoriesApiService, usersApiService} from "../services";
// import {Platform, TouchableNativeFeedback, TouchableOpacity} from "react-native";
// import {$RtcIfElse} from "../shared/directives";
// import {USER_STATE_CHANGE} from "../redux/constants";
import imageCompression from 'browser-image-compression';

export class HelperService {

    categoriesIdsToNames;
    constructor() {
        this.categoriesIdsToNames = {};
    }

    initCategoriesIdsToNames(categories) {
        categories.forEach(c => {
            this.categoriesIdsToNames[c.name] = c.id;
            this.categoriesIdsToNames[c.id] = c.name;
        });
    }

    async compressImage(file, options)  {
        const opt = {...{
            maxSizeMB: +(file.size / 1024 / 1024),
            maxIteration: 50,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: 'image/jpeg',
            onProgress: (n) => {}
        }, ...options};
        return await imageCompression(file, opt);
    }


    // initNecessaryDataForAuthUser() {
    //     return new Promise((resolve, reject) => {
    //         console.log('initDataForAuthUser');
    //         Promise.all([
    //             categoriesApiService.get().then(({data}) => data),
    //             usersApiService.get('current').then(({data}) => data)
    //         ]).then(([categories, userData]) => {
    //             this.initCategoriesIdsToNames(categories.data);
    //             console.log(' userData :' , userData);
    //             Store.dispatch({type: USER_STATE_CHANGE, payload: {...userData.state}});
    //             resolve();
    //         }).catch(err => {
    //             console.log('err:' , err.response);
    //         })
    //     })
    // }
}


// const initCategoriesIdsToNames = (categories:Array<any>) => {
//     categories.forEach(c => {
//         categoriesIdsToNames[c.name] = c.id;
//         categoriesIdsToNames[c.id] = c.name;
//     });
// }
//
// export const initNecessaryDataForAuthUser = () => {
//     return new Promise((resolve, reject) => {
//         console.log('initDataForAuthUser');
//         Promise.all([
//             categoriesApiService.get().then(({data}) => data),
//         ]).then(([categories]) => {
//             initCategoriesIdsToNames(categories.data);
//             resolve();
//         })
//     })
// }


// export const categoriesIdsToNames = {};

// export const TouchablePlatformSpecific = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

