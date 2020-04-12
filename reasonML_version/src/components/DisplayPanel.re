type price = {
    rate: string,
    code: string
};

type currency = {
  usd: price,
  eur: price,
  gbp: price
}

type time = {
  updated: string
};

type currentPrice = {
  bpi: currency,
  time: time
};

type state = {
  prices: list(price),
  time: time
};

type actions = 
  | FetchPrices(currentPrice);

let reducers = ( _, action) => {
  switch (action) {
  | FetchPrices(payload) => {prices: [payload.bpi.usd, payload.bpi.eur, payload.bpi.gbp], time: payload.time}
  };
}

module Decode = {
  let decodePrice = (price) => Json.Decode.{
    rate: price |> field("rate", string),
    code: price |> field("code", string, )
  };

  let decodeCurrency = (curr) => Json.Decode.{
    usd: curr |> field("USD", decodePrice),
    eur: curr |> field("EUR", decodePrice),
    gbp: curr |> field("GBP", decodePrice),
  };

  let decodeTime = (time) => Json.Decode.{
    updated: time |> field("updated", string)
  };

  let decodePrice = (currPrice) => Json.Decode.{
    bpi: currPrice |> field("bpi", decodeCurrency),
    time: currPrice |> field("time", decodeTime)
  }

};

let getPrices = (dispatch) => {
  Js.Promise.(
    Axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")
    |> then_(response => FetchPrices(response##data |> Decode.decodePrice)  |> dispatch |> resolve)
    |> catch(error => resolve(Js.log(error)))
  ) |> ignore
};

[@react.component]
let make = () => {

    let (state, dispatch) = React.useReducer(reducers,{prices: [{rate: "", code: ""}], time: {updated: ""}});

    React.useEffect0( () => {
      getPrices(dispatch) |> ignore;
      let timerId = Js.Global.setInterval(() => getPrices(dispatch), 10 * 1000);
      Some(() => Js.Global.clearInterval(timerId));
      });

    <div>
       
        <div className="ui segment">
          <div className="ui red top attached label">
            {"Auto Update is On" |> React.string}
          </div>
          <div className="ui three row centered grid">
            <div className="row"> <h1> { ReasonReact.string("Bitcoin Prices")} </h1> </div>
            <div className="row">
              <div className="ui vertical statistics"> 
              {
                state.prices
                |> List.mapi((index,{rate, code}) => <DisplayPrice key={index |> string_of_int} rate code />)
                |> Array.of_list
                |> ReasonReact.array;
              }

              </div>
            </div>
            <div className="row">
              <div
                className="ui animated green button"
                tabIndex=0
                onClick={ _ => getPrices(dispatch) |> ignore}>
                <div className="visible content"> {"Update Now" |> ReasonReact.string} </div>
                <div className="hidden content">
                  <i className="right sync icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="ui blue big bottom right attached label">
            {state.time.updated |> React.string}
          </div>
        </div>
    </div>;
}