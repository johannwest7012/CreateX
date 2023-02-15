import {CREATOR_LIST_REQUEST, 
    CREATOR_LIST_SUCCESS, 
    CREATOR_LIST_FAIL,

    CREATOR_DETAILS_REQUEST, 
    CREATOR_DETAILS_SUCCESS, 
    CREATOR_DETAILS_FAIL,

} from '../constants/creatorConstants'
import axios from 'axios'


export const listCreators = () => async (dispatch) => { 
try{
    dispatch({ type: CREATOR_LIST_REQUEST })
    const { data } = await axios.get('/api/creators/')
    dispatch({
        type:CREATOR_LIST_SUCCESS, 
        payload: data
    })

} catch(error){
    dispatch({
        type: CREATOR_LIST_FAIL,
        payload: error.response && error.response.data.detail 
            ? error.response.data.detail
            : error.message,
    })

}
}

export const listCreatorDetails = (id) => async (dispatch) => { 
try{
    dispatch({ type: CREATOR_DETAILS_REQUEST })
    const { data } = await axios.get(`/api/creators/${id}`)
    dispatch({
        type:CREATOR_DETAILS_SUCCESS, 
        payload: data
    })

} catch(error){
    dispatch({
        type: CREATOR_DETAILS_FAIL,
        payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
    })

}
}