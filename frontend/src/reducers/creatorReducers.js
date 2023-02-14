import {
    CREATOR_LIST_REQUEST, 
    CREATOR_LIST_SUCCESS, 
    CREATOR_LIST_FAIL,

    CREATOR_DETAILS_REQUEST, 
    CREATOR_DETAILS_SUCCESS, 
    CREATOR_DETAILS_FAIL,
} from '../constants/creatorConstants'
 
export const creatorListReducer = (state = {creators:[]}, action) => { 
    switch(action.type){
        case CREATOR_LIST_REQUEST: 
            return { loading:true, creators:[]}

        case CREATOR_LIST_SUCCESS: 
            return { loading:false, creators: action.payload}
        
        case CREATOR_LIST_FAIL: 
            return { loading:false, error: action.payload}

        default: 
            return state 
    }
}

export const creatorDetailsReducer = (state = {creator:[]}, action) => { 
    switch(action.type){
        case CREATOR_DETAILS_REQUEST: 
            return { loading:true, ...state}

        case CREATOR_DETAILS_SUCCESS: 
            return { loading:false, creator: action.payload}
        
        case CREATOR_DETAILS_FAIL: 
            return { loading:false, error: action.payload}

        default: 
            return state 
    }
}

