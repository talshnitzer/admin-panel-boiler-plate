import httpService from "./http.service";

import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { HelperService } from "./helper.service";

export const authService           = new AuthService();
export const helperService         = new HelperService();

export const mapsApiService        = new ApiService('users');
export const usersApiService       = new ApiService('users');
export const stagesApiService      = new ApiService('users');
export const videoApiService       = new ApiService('users');
export const teachersApiService    = new ApiService('users');
export const categoriesApiService  = new ApiService('users');
export const invitationApiService  = new ApiService('users');
export const enterprisesApiService = new ApiService('enterprises');

export default {
    httpService,
    authService,
    helperService,
    mapsApiService,
    usersApiService,
    stagesApiService,
    invitationApiService,
    videoApiService,
    teachersApiService,
    categoriesApiService,
    enterprisesApiService
}
