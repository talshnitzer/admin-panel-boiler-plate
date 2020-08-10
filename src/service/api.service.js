

import httpService from "./http.service";
import environment from "../shared/env";
// const environment = getEnvVars;

export class ApiService {
    baseApi;
    constructor(path) {
        this.baseApi  = `${environment.apiUrl}/${path}` ;
    }
    get(endpoint = '', params) {
        return httpService.get(`${this.baseApi}/${endpoint}`, params);
    }
    post(endpoint= '', payload){
        return httpService.post(`${this.baseApi}/${endpoint}`, payload)
    }
    put(endpoint = '', payload) {
        return httpService.put(`${this.baseApi}/${endpoint}`, payload)
    }
    delete(endpoint= '', data) {
        return httpService.delete(`${this.baseApi}/${endpoint}`, data)
    }
}


