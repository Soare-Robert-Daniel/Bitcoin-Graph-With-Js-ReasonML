type point = {
  x: string,
  y: float
};

type dataLine = {
  id: string,
  data: array(point),
};

type dataChart = array(dataLine);

type dayPrice = {
    date: string,
    price: float
};

type prices31Days = array(dayPrice);

module Decoder = {
    let decodeDayPrice = (day) => Json.Decode.{
        date: day |> field("date", string),
        price: day |> field("price", Json.Decode.float)
    };

    let decodePrices31Days = (prices) => prices |> Json.Decode.array(decodeDayPrice);
};


let parsePrices = (data) => {
    let format = [%bs.raw {|
        function(data) {
            var newData = [];

            for (var key of Object.keys(data)) {
                newData.push({date: key, price: data[key]});
            }

            return newData;
        }
    |}];

    data 
    |> format 
    |> Decoder.decodePrices31Days
    |> Array.map( (dayPrice) => {x: dayPrice.date, y: dayPrice.price} )
};


type payload = array(point);

type action =
  | FetchPrices31Days(payload);


let getPrices31Days = (dispatch) => {
  Js.Promise.(
    Axios.get("https://api.coindesk.com/v1/bpi/historical/close.json")
    |> then_(response => FetchPrices31Days(response##data##bpi |> parsePrices) |> dispatch |> resolve)
    |> catch(error => resolve(Js.log(error)))
  )
  |> ignore;
};



type state = {
    data: payload
};


let reducers = ( _, action) => {
    switch (action) {
    | FetchPrices31Days(data) => {data: data}
    };
};


[@react.component]
let make = () => {

    let (state, dispatch) = React.useReducer(reducers, {data: [||]});

  React.useEffect0( () => {
      getPrices31Days(dispatch) |> ignore; None;
  });

  let data: Js.Json.t =
    [|
      {
        id: "bitcoin",
        data: state.data,
      },
    |]
    |> Js.Json.stringifyAny
    |> Belt.Option.getExn
    |> Js.Json.parseExn;

  data |> Js.Console.log;

  <div> <DisplayChart data /> </div>;
};
