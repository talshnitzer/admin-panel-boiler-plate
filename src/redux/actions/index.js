
import { USER_CHANGE } from '../constants/index';
import {CATEGORIES_CHANGE, PROGRESS_CHANGE, TEACHERS_CHANGE} from "../constants";

export function changeUser(user) {
    return {
        type: USER_CHANGE,
        payload: user
    }
}
export function updateCategories(payload) {
    return {
        type: CATEGORIES_CHANGE,
        payload
    }
}
export function updateTeachers(payload) {
    return {
        type: TEACHERS_CHANGE,
        payload
    }
}
export function updateUploadProgress(payload) {
    return {
        type: PROGRESS_CHANGE,
        payload
    }
}
