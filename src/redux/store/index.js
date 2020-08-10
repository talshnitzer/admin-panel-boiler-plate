import { createStore, combineReducers } from 'redux';
import {categoriesReducer, teachersReducer, userReducer, uploadingProgressReducer} from '../reducers';
import {USER_LOGOUT} from "../constants";


const appReducer = combineReducers({
    /* your app’s top-level reducers */
    user: userReducer,
    categories: categoriesReducer,
    teachers: teachersReducer,
    uploadingProgress: uploadingProgressReducer,
})

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined;
        localStorage.clear();
    }

    return appReducer(state, action)
}

const Store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

export default Store;
