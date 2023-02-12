import axios from 'axios'
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

    USER_SUBMIT_ORDER_REQUEST,
    USER_SUBMIT_ORDER_SUCCESS,
    USER_SUBMIT_ORDER_FAIL,

    USER_SHARES_REQUEST,
    USER_SHARES_SUCCESS,
    USER_SHARES_FAIL,

 } from '../constants/userConstants'

// Actions are imported and used in screens 

/** *
 * INTRODUCTION TO userActions.js (and actions in general)
 * 
 * Actions are called somewhere in the screens, they usually perform some action
 * that involves data in the backend (GET,PUT,etc)
 * 
 * Data: 
 *  Data can be passed from where this action is called in a couple different ways 
 *  which you see used differently in different actions
 * 
 * 1. Pass through parameters one by one 
 *      Like how login does it, look at where the login action is called in LoginScreen 
 * 2. Pass through a singlar parameter which is an object 
 *      Like how updateUserActions does it (used in ProfileScreen) 
 *      The object 'user' is given attributes when it is called in ProfileScreen 
 * 
 * Then, the 'data' variable is defined using the information passed from a screen, 
 * and whatever backend view url and config you specify 
 * 
*/

export const login = (email, password) => async (dispatch) => {
    try{ 
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const config = {
            headers:{
                'Content-type':'application/json'
            }
        }

        const {data} = await axios.post(
            '/api/users/login/',
            { 'username':email, 'password':password }, 
            config
            )

        dispatch({
            type:USER_LOGIN_SUCCESS, 
            payload:data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch(error){
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}

export const logout = () => (dispatch) => { 
    localStorage.removeItem('userInfo')
    dispatch({ type:USER_LOGOUT })
    dispatch({ type:USER_DETAILS_RESET })

}




export const register = (name, email, password) => async (dispatch) => {
    try{ 
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        const config = {
            headers:{
                'Content-type':'application/json'
            }
        }

        const {data} = await axios.post(
            '/api/users/register/',
            { 'name':name, 'email':email, 'password':password }, 
            config
            )

        dispatch({
            type:USER_REGISTER_SUCCESS, 
            payload:data
        })

        dispatch({
            type:USER_LOGIN_SUCCESS, 
            payload:data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch(error){
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}


export const getUserDetails = (type) => async (dispatch, getState) => {
    try{ 
        dispatch({
            type: USER_DETAILS_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get(
            `/api/users/${type}/`,
            config
        )

        dispatch({
            type:USER_DETAILS_SUCCESS, 
            payload:data
        })

    } catch(error){
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}



export const updateUserProfile = (user) => async (dispatch, getState) => {
    try{ 
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        })

        // this says to update user we do need to be logged in
        const {
            userLogin: { userInfo },
        } = getState()

        // sending token into header for authorization
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // shows its a put request
        const {data} = await axios.put(
            `/api/users/profile/update/`,
            user,
            config
        )

        // sending the payload 
        dispatch({
            type:USER_UPDATE_PROFILE_SUCCESS, 
            payload:data
        })

        // logging in the user with new data 
        dispatch({
            type:USER_LOGIN_SUCCESS, 
            payload:data
        })

        // sets local storage with new user information 
        localStorage.setItem('userInfo', JSON.stringify(data))


    } catch(error){
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}


export const submitUserOrder = (order) => async (dispatch, getState) => {
    // order 
    // 'id':user.id,
    // 'pk': pk  
    // 'buy_sell' : buy_sell (will be implemented)

    try{ 
        dispatch({
            type: USER_SUBMIT_ORDER_REQUEST
        })

        // this says to update user we do need to be logged in
        const {
            userLogin: { userInfo },
        } = getState()

        // sending token into header for authorization
        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // shows its a put request
        const {data} = await axios.put(
            `/api/users/profile/submitOrder/`,
            order,
            config
        )

        // sending the payload 
        dispatch({
            type:USER_SUBMIT_ORDER_SUCCESS, 
            payload:data
        })

        

        // sets local storage with new user information 
        localStorage.setItem('userInfo', JSON.stringify(data))


    } catch(error){
        dispatch({
            type: USER_SUBMIT_ORDER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}



export const getUserShares = (type) => async (dispatch, getState) => {
    try{ 
        dispatch({
            type: USER_SHARES_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.get(
            `/api/users/${type}/`,
            config
        )

        dispatch({
            type: USER_SHARES_SUCCESS, 
            payload: data 
           
        })

    } catch(error){
        dispatch({
            type: USER_SHARES_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}


