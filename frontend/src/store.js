import { legacy_createStore as createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { creatorListReducer, 
        creatorDetailsReducer,
        creatorPriceLogReducer } from './reducers/creatorReducers'
import { favoritesReducer } from './reducers/favoritesReducers'
import {userLoginReducer, 
        userRegisterReducer, 
        userDetailsReducer, 
        userUpdateProfileReducer,
        userSubmitOrderReducer,
        userSharesReducer,
        userOrderHistoryReducer,
    } from './reducers/userReducers'

const reducer = combineReducers({
    creatorList: creatorListReducer,
    creatorDetails: creatorDetailsReducer,
    creatorPriceLog: creatorPriceLogReducer, 
    favorites : favoritesReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer, 
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    //userSubmitOrder: userSubmitOrderReducer,
    userShares: userSharesReducer,
    userOrderHistory: userOrderHistoryReducer,
})

const favItemsFromStorage = localStorage.getItem('favItems') ?
    JSON.parse(localStorage.getItem('favItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const initalState = {
    favorites:{ favItems : favItemsFromStorage },
    userLogin:{ userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer, initalState, composeWithDevTools(applyMiddleware(...middleware)))

export default store 