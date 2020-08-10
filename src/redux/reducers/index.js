import {CATEGORIES_CHANGE, PROGRESS_CHANGE, TEACHERS_CHANGE, USER_CHANGE} from '../constants';

const initialState = {
    user: null,
    userState: null,
};

const reducerGenerator = (act, initValue , customLogic) => {
    return (state = initValue || {}, action) => {
        switch(action.type) {
            case act:
                if (customLogic) customLogic(initialState, action);

                if (Array.isArray(initValue)) {
                    return action.payload;
                } else {
                    return {
                        ...state,
                        ...action.payload
                    };
                }
            default:
                return state;
        }
    }
}

export const userReducer = reducerGenerator(USER_CHANGE ,  {}, (initialState, action) => {
    if (action.payload.jwtToken) delete action.payload.jwtToken;
});

// export const userStateReducer       = reducerGenerator(USER_STATE_CHANGE);
export const categoriesReducer         = reducerGenerator(CATEGORIES_CHANGE, []);
export const teachersReducer           = reducerGenerator(TEACHERS_CHANGE, []);
export const uploadingProgressReducer  = reducerGenerator(PROGRESS_CHANGE, {});

