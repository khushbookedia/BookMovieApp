import {createStore} from "redux";



const initialState = {
    "movieId": ""
}

function movieReducer (state=initialState, action){

    switch (action.type){
        case "set_movieId":
            return {...state, "movieId":action.payload}
        default:
            return state;
    }
}

export default createStore(movieReducer);