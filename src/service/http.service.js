import axios from 'axios';
// @ts-ignore
import * as Promise from 'bluebird';
import { authService }  from './index';
import {globals} from "../index";
// import promise from 'promise';



class HttpService {
    axios;
    constructor(httpInterceptingHandler, httpResponseErrorHandler) {
        this.axios = axios.create();
        this.axios.interceptors.request.use(httpInterceptingHandler);
        this.axios.interceptors.response.use(response => response, httpResponseErrorHandler);
    }
    // CRUD
    get(url , params) {
        return this.axios.get(url, {params});
    }
    post(url, payload) {
        return this.axios.post(url, payload)
    }
    put(url, payload) {
        return this.axios.put(url, payload)
    }
    delete(url, data) {
        return this.axios.delete(url, {data})
    }
}


const httpInterceptingHandler = async (config) => {
    await authService.accessTokenHandler(config);
    return config;
};
const httpResponseErrorHandler = (data) => {
    const response = data && data.response;
    if (response) {
        const {data: resp} = response;
        if (resp.error) {
            globals.growlRef.show({severity: 'error', summary: 'Error Message', detail: (typeof resp.error === 'string') ? resp.error  : ''});
            console.log(resp.error);
            return Promise.reject(resp.error);
            // Alert.alert('Error', resp.error);
        }
    } else {
        return Promise.reject();
    }
};

const httpService = new HttpService(httpInterceptingHandler, httpResponseErrorHandler);
export default httpService;



// var axiosInstance = axios.create();
//
// axiosInstance.interceptors.request.use(
//     function (config) {
//     // Do something before request is sent
//     //If the header does not contain the token and the url not public, redirect to login
//     var accessToken = getAccessTokenFromCookies();
//
//     //if token is found add it to the header
//     if (accessToken) {
//         if (config.method !== 'OPTIONS') {
//             config.headers.authorization = accessToken;
//         }
//     }
//     return config;
// }, function (error) {
//     // Do something with request error
//     return promise.reject(error);
// });


