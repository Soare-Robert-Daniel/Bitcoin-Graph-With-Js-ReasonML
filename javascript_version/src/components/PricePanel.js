import React from "react";
import DisplayPrice from "./DisplayPrice";
import { connect } from "react-redux";
import { fetchPrices } from "../actions";

class PricePanel extends React.Component {
  state = {
    autoUpdateInterval: null,
  };

  componentDidMount() {
    this.autoUpdate();
  }

  updatePrices = () => {
    this.props.fetchPrices();
  };

  autoUpdate = () => {
    this.updatePrices();

    this.setState({
      autoUpdateInterval: setInterval(() => {
        this.updatePrices();
      }, 10 * 1000),
    });
  };

  renderPrices() {
    if (!this.props.prices.bpi) {
      return <div>Loading...</div>;
    }

    const prices = [];

    for (const [key, value] of Object.entries(this.props.prices.bpi)) {
      prices.push(
        <DisplayPrice
          key={key}
          rate={value.rate}
          code={value.code}
          description={value.description}
        />
      );
    }

    return prices;
  }

  renderTime() {
    if (!this.props.prices.time) {
      return null;
    }

    return this.props.prices.time.updated;
  }

  render() {
    return (
      <div className="ui segment" style={{ marginTop: "30px" }}>
        <div className="ui red top attached label">
          <p>Auto Update is On</p>
        </div>
        <div className="ui three row centered grid">
          <div className="row">
            <h1>Bitcoin Prices</h1>
          </div>
          <div className="row">
            <div className="ui vertical statistics">{this.renderPrices()}</div>
          </div>
          <div className="row">
            <div
              className="ui animated green button"
              tabIndex="0"
              onClick={this.updatePrices}
            >
              <div className="visible content">Update Now</div>
              <div className="hidden content">
                <i className="right sync icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="ui blue big bottom right attached label">
          {this.renderTime()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    prices: state.prices,
  };
};

export default connect(mapStateToProps, { fetchPrices })(PricePanel);
