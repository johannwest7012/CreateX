import axios from 'axios'
import { FAVS_ADD_ITEM, FAVS_REMOVE_ITEM } from '../constants/favoritesConstants'

export const addToFavs = (id) => async (dispatch, getState) => { 
    const {data} = await axios.get(`/api/creators/${id}`)

    dispatch({
        type:FAVS_ADD_ITEM,
        payload:{
            creator:data._id,
            name: data.name,
            image: data.image, 
            price: data.price,
            rating: data.rating,
        }
    })

    localStorage.setItem('favItems', JSON.stringify(getState().favorites.favItems))
}

export const removeFromFavs = (id) => (dispatch, getState) => {
    dispatch({
        type: FAVS_REMOVE_ITEM,
        payload: id, 
    })

    localStorage.setItem('favItems', JSON.stringify(getState().favorites.favItems))

}