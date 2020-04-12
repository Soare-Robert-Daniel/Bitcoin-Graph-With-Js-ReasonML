import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { connect } from "react-redux";
import { fetchPricesLast31Days } from "../actions";

class DisplayChart extends React.Component {
  componentDidMount() {
    this.props.fetchPricesLast31Days();
  }

  getData = () => {
    const data = [];

    if (!this.props.prices.bpi) {
      return [
        {
          id: "bitcoin",
          data: data,
        },
      ];
    }

    for (const [date, value] of Object.entries(this.props.prices.bpi)) {
      data.push({
        x: date,
        y: value,
      });
    }

    return [{
      id: "bitcoin",
      data: data
    }];
  };

  render() {
    const data = this.getData();
    return (
      <div
        className="ui segment"
        style={{
          marginTop: "30px",
          width: "1200px",
          height: "600px",
          paddingBottom: "50px",
        }}
      >
        <h1>Bitcoin Price In The Last 31 Days (USD)</h1>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 80, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 70,
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "price",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          colors={{ scheme: "nivo" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { prices: state.prices31Days };
};

export default connect(mapStateToProps, { fetchPricesLast31Days })(
  DisplayChart
);
