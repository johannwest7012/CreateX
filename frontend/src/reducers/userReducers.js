import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,

    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_RESET,

    USER_SUBMIT_ORDER_REQUEST,
    USER_SUBMIT_ORDER_SUCCESS,
    USER_SUBMIT_ORDER_FAIL,

    USER_SHARES_REQUEST,
    USER_SHARES_SUCCESS,
    USER_SHARES_FAIL,

    USER_ORDER_HISTORY_REQUEST,
    USER_ORDER_HISTORY_SUCCESS,
    USER_ORDER_HISTORY_FAIL,

 } from '../constants/userConstants'


 export const userLoginReducer = (state = {}, action) => { 
    switch(action.type){
        case USER_LOGIN_REQUEST: 
            return { loading:true}

        case USER_LOGIN_SUCCESS: 
            return { loading:false, userInfo: action.payload}
        
        case USER_LOGIN_FAIL: 
            return { loading:false, error: action.payload}

        case USER_LOGOUT: 
            return {}

        default: 
            return state 
    }
}


export const userRegisterReducer = (state = {}, action) => { 
    switch(action.type){
        case USER_REGISTER_REQUEST: 
            return { loading:true}

        case USER_REGISTER_SUCCESS: 
            return { loading:false, userInfo: action.payload}
        
        case USER_REGISTER_FAIL: 
            return { loading:false, error: action.payload}

        case USER_LOGOUT: 
            return {}

        default: 
            return state 
    }
}


export const userDetailsReducer = (state = {user:{}}, action) => { 
    switch(action.type){
        case USER_DETAILS_REQUEST: 
            return { ...state, loading:true } 

        case USER_DETAILS_SUCCESS: 
            return { loading:false, user: action.payload }
        
        case USER_DETAILS_FAIL: 
            return { loading:false, error: action.payload }

        case USER_DETAILS_RESET: 
            return { user: {} }
        default: 
            return state 
    }
}



export const userUpdateProfileReducer = (state = {}, action) => { 
    switch(action.type){
        case USER_UPDATE_PROFILE_REQUEST: 
            return { loading:true } 

        case USER_UPDATE_PROFILE_SUCCESS: 
            return { loading:false, success:true, userInfo: action.payload }
        
        case USER_UPDATE_PROFILE_FAIL: 
            return { loading:false, error: action.payload }

        case USER_UPDATE_PROFILE_RESET:
            return {}

        default: 
            return state 
    }
}



export const userSubmitOrderReducer = (state = {}, action) => { 
    switch(action.type){
        case USER_SUBMIT_ORDER_REQUEST: 
            return { loading:true } 

        case USER_SUBMIT_ORDER_SUCCESS: 
            return { loading:false, success:true}
        
        case USER_SUBMIT_ORDER_FAIL: 
            return { loading:false, error: action.payload }

        default: 
            return state 
    }
}



export const userSharesReducer = (state = {shares: []}, action) => { 
    switch(action.type){
        case USER_SHARES_REQUEST: 
            return { loading:true } 

        case USER_SHARES_SUCCESS: 
            return { loading:false, success:true, shares: action.payload}
        
        case USER_SHARES_FAIL: 
            return { loading:false, error: action.payload }

        default: 
            return state 
    }
}

export const userOrderHistoryReducer = (state = {order_history: []}, action) => { 
    switch(action.type){
        case USER_ORDER_HISTORY_REQUEST: 
            return { loading:true } 

        case USER_ORDER_HISTORY_SUCCESS: 
            return { loading:false, success:true, order_history: action.payload}
        
        case USER_ORDER_HISTORY_FAIL: 
            return { loading:false, error: action.payload }

        default: 
            return state 
    }
}