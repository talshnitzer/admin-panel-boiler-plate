// import getEnvVars from "../shared/env";
// import {ISingInPayload} from "../shared/interfaces/auth.interfaces";
// const environment = getEnvVars;
// import * as SecureStore from 'expo-secure-store';
// import * as Facebook from 'expo-facebook';
// import * as Google from 'expo-google-app-auth';
// import {LogInResult} from "expo-google-app-auth";
// import Store from "../redux/store";
// import {USER_CHANGE, USER_STATE_CHANGE, USER_LOGOUT} from "../redux/constants";
// import { AsyncStorage } from 'react-native';
import httpService from "./http.service";
import environment from "../shared/env";
import Store from "../redux/store";
import {USER_CHANGE} from "../redux/constants";
const USER_AUTH_DATA = 'auth_user';

export class AuthService {

    token = '';

    async login(email, password) {
        return httpService.post(`${environment.apiUrl}/auth/login`, {email, password})
            .then(async ({data}) => {
                console.log('data :' , data);
                if (data) {
                    return this.loginHandler(data);
                } else {
                    return false;
                }
            }).catch(err => {
                console.log(err)
                return false;
            });
    }

    loginHandler(data) {
        data.user.jwtToken = data.token;
        this.token = data.token;
        localStorage.setItem(USER_AUTH_DATA, JSON.stringify({jwtToken: data.token,}));
        //    after save user data + token need to navigate to home screen
        // await helperService.initNecessaryDataForAuthUser();
        return this.initCurrentUser();
    }


    async initCurrentUser() {
        return new Promise(async resolve => {
            const authData = JSON.parse(localStorage.getItem(USER_AUTH_DATA));
            console.log('authData : ', authData);
            if (authData) {
                if (!this.token) this.token = authData.jwtToken;
                let {data: currUser } = await httpService.get(`${environment.apiUrl}/users/current`);
                console.log('currUser :', currUser);
                await localStorage.setItem('rootPage', 'Home');
                // delete user.state;
                Store.dispatch({type: USER_CHANGE, payload: {...currUser}});
                // window.location.replace('/Dashboard');
                // history.push("/Dashboard");
                resolve(true);
            } else {
                await localStorage.setItem('rootPage', 'Login');
                // navigate('Login');
                // history.push("/Login");
                // window.location.replace('/Login');
                resolve(false);
            }
        })
    }

    async accessTokenHandler(config) {
        //If the header does not contain the token and the url not public, redirect to login
        console.log(config.url);
        const accessToken = this.token;
        //if token is found add it to the header
        if (accessToken) {
            if (config.method !== 'OPTIONS') {
                config.headers.authorization = `Bearer ${accessToken}`;
            }
        } else {
            // window.location.replace('login');
        }
    }

    // async signup(payload: ISingInPayload, callback?: (result) => {}): Promise<any> {
    //     return httpService.post(`${environment.apiUrl}/auth/sign-up`, payload)
    //         .then(result => {
    //             if (callback) callback(result);
    //             this.login(payload.email, payload.password);
    //         }).catch((err) => {
    //         //    need to show alert with the error
    //         })
    // }
    //
    // async logout() {
    //     await SecureStore.deleteItemAsync(USER_AUTH_DATA);
    //     Store.dispatch({type: USER_LOGOUT, payload: {}});
    //     navigate('Login');
    // }

    // async singInWithGoogle() {
    //     try {
    //         const response: LogInResult = await Google.logInAsync({
    //             iosClientId: `65123993707-1lev8g5khv07e6velj40jdtkerdq2rct.apps.googleusercontent.com`,
    //             androidClientId: `65123993707-05dclmv1ia7rcj7v8nb08gkplablvmbu.apps.googleusercontent.com`,
    //             scopes: ['profile', 'email'],
    //         });
    //         const { type, user, accessToken } = response as any;
    //         if (type === 'success') {
    //             /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
    //             const payload = {
    //                 email: user.email,
    //                 firstName: user.givenName,
    //                 name: user.displayName,
    //                 lastName: user.familyName,
    //                 userId: user.id,
    //                 picture: user.photoUrl,
    //                 accessToken: accessToken,
    //             };
    //             return httpService.post(`${environment.apiUrl}/auth/google-login`, payload)
    //                 .then(({ data }) => {
    //                     this.loginHandler(data);
    //                 })
    //         }
    //     } catch (e) {
    //
    //     }
    // }
    // async signInWithFacebook() {
    //     try {
    //         // need to put this data in config file
    //         await Facebook.initializeAsync('437456900293562', 'tantra');
    //         const fbResponse = await Facebook.logInWithReadPermissionsAsync({
    //             permissions: ['public_profile', 'user_birthday', 'email', 'user_age_range', 'user_gender' ],
    //         });
    //
    //          const calculateAge = (birthday) =>{ // birthday is a date
    //             const ageDifMs = Date.now() - birthday.getTime();
    //             const ageDate = new Date(ageDifMs); // miliseconds from epoch
    //             return Math.abs(ageDate.getUTCFullYear() - 1970);
    //         };
    //
    //         const { type, token } = (fbResponse as any);
    //         if (type === 'success') {
    //             // Get the user's name using Facebook's Graph API
    //             const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    //             const user = (await response.json());
    //             const resp = await fetch(`https://graph.facebook.com/${user.id}?fields=id,email,birthday,name,picture.height(2048),first_name,last_name,gender&access_token=${token}`);
    //             const fbUser = (await resp.json());
    //
    //             const payload = {
    //                 email: fbUser.email,
    //                 age: calculateAge(new Date(fbUser.birthday)),
    //                 birthday: fbUser.birthday,
    //                 firstName: fbUser.first_name,
    //                 name: fbUser.name,
    //                 lastName: fbUser.last_name,
    //                 gender: fbUser.gender,
    //                 userId: fbUser.id,
    //                 picture: fbUser.picture.data.url,
    //                 accessToken: token,
    //             };
    //
    //             httpService.post(`${environment.apiUrl}/auth/fb-login`, payload)
    //                 .then(({data}) => {
    //                     this.loginHandler(data);
    //                 }).catch((error) => {
    //                 console.log(error.response);
    //             })
    //             // Alert.alert('Logged in!', `Hi ${fbUser.name}!`);
    //         } else {
    //
    //         }
    //     } catch ({ message }) {
    //         alert(`Facebook Login Error: ${message}`);
    //     }
    // }
    //
}

// const authService = new AuthService();
//
// export default authService;
