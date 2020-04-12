import React from "react";

const DisplayPrice = (props) => {
    return (
      <div className="green statistic">
        <div className="value">
          {props.rate}       
        </div>
        <div className="label">{props.code}</div>
      </div>
    );
  }


export default DisplayPrice;
