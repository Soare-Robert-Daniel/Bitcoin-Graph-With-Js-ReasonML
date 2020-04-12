import React from "react";

import PricePanel from "./PricePanel";
import DisplayChart from "./DisplayChart";

export default class App extends React.Component {
  render() {
    return (
      <div className="ui centered grid container">
        <PricePanel /> 
        <DisplayChart />
      </div>
    );
  }
}
