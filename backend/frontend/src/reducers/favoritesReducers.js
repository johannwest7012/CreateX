
import { FAVS_ADD_ITEM, FAVS_REMOVE_ITEM } from '../constants/favoritesConstants'


export const favoritesReducer = (state = {favItems : []}, action) => {
    switch(action.type){

        case FAVS_ADD_ITEM: 
            const item = action.payload 
            const existsItem = state.favItems.find(x => x.creator === item.creator)
                
            if (existsItem){
                return{
                    ...state,
                    favItems: state.favItems.map(x =>
                        x.creator === existsItem.creator ? item : x
                    )
                }
            }else{
                return{
                    // returns original state, original favItems, and adds in the 
                    // new item to the array
                    ...state,
                    favItems:[...state.favItems, item]
                }
            }

        case FAVS_REMOVE_ITEM:
            return { 
                ...state, 
                favItems:state.favItems.filter(x => x.creator !== action.payload)
                
            }

        default: 
            return state
    }
}