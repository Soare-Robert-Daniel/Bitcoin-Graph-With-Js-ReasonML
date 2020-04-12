import coindeskAPI from '../apis/coindesk'

export const fetchPrices = () => async (dispatch) => {
    const response = await coindeskAPI.get("/currentprice.json");

    dispatch({
        type: "FETCH_PRICES",
        payload: response.data
    })
}

export const fetchPricesLast31Days = () => async (dispatch) => {
  const response = await coindeskAPI.get("/historical/close.json");

  dispatch({
    type: "FETCH_PRICES_31_DAYS",
    payload: response.data,
  });
};