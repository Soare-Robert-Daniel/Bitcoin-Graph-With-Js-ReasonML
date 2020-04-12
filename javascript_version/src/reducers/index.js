import { combineReducers } from "redux";

const priceReducer = (state = [], action) => {
    switch (action.type) {
        case "FETCH_PRICES":
            return action.payload
    
        default:
            return state
    }
}

const price31DaysReducer = (state = [], action) => {
    switch (action.type) {
      case "FETCH_PRICES_31_DAYS":
        return action.payload

      default:
        return state
    }
}

export default combineReducers({
    prices: priceReducer,
    prices31Days: price31DaysReducer
})