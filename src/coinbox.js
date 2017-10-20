import React, { Component } from 'react';

class CoinBox extends React.Component {
  render() {
    return (
    <li key={ this.props.data.id } className="movers">
          <div className="center-content">
            <a className="movers-link" target="_blank" href={"https://coinmarketcap.com/currencies/" + this.props.data.id + "/"}>
                <div className="hourly-change">{this.props.data.percent_change_1h + "%"}</div>
                <div className="coin-name">{this.props.data.name}</div>
                <div className="coin-price">{"$" + this.props.data.price_usd}</div>
              </a>
          </div>
      <div className="daily-change">{this.props.data.percent_change_24h + "%"}</div>
      <div className="daily-change-label">24hr +/-</div>
      {/* <div className="market-size">{"$" + parseInt(this.props.data.market_cap_usd).toFixed(0) } </div> */}
                  <div className="market-size">{ this.formatMoney(this.props.data.market_cap_usd) } </div>
      <div className="last-updated">{ this.convertEpochToDate(this.props.data.last_updated) } </div>
      <div onClick={(e) => this.addToFavorites(this.props.data) } className="add-favorites">+</div>
    </li>
  )
  }
}

export default (CoinBox);
