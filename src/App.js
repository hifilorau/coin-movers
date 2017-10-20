import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import fire from './fire';
import { getPriceData, getCoinData } from './api-calls';
import moment from 'moment';
import CoinBox from './coinbox'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

const favorites = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      coins:{},
      bigMovers: [],
      bitcoin: {},
      showBigLosers: false,
      newData: [],
      favorites: []
    }; // <- set up react state
  }
  componentWillMount() {
     let coinsRef = fire.database().ref('coins').orderByKey().limitToLast(10000);
     coinsRef.on('child_added', snapshot => {
       /* Update React state when message is added at Firebase Database */
        let newData = { dataset: snapshot.val(), prevKey: snapshot.key};
       console.log(newData.prevKey);
        let hourlyChange = [...newData.dataset].slice(0);
        hourlyChange.sort(function(a,b) {
          return b.percent_change_1h - a.percent_change_1h;
       })

       this.setState({ bigMovers:hourlyChange })
     })

    //  fire.database().ref('coins').remove();

      getPriceData().then(
        response => {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
            response.json().then(data => {
              fire.database().ref('coins').push( data );
              this.setState({ coins:data });
              // console.log(this.state.coins[0]);
            return data[0];
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });

      getCoinData('bitcoin').then(
        response => {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
            response.json().then(data => {
              // fire.database().ref('coins').push( data );
              this.setState({ bitcoin:data[0] });
            return;
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }

  sortArray(array) {
    array.sort(function(a,b) {
      return b.percent_change_1h - a.percent_change_1h;
   })
  }

  addToFavorites(favorite) {
    favorites.push(favorite);
    console.log(favorites);
  }

 renderBigMovers() {
   let array = this.state.bigMovers;
   this.sortArray(array);
   return array.map((data) => {
     if (this.state.showBigLosers === false && parseInt(data.market_cap_usd, 10) > 1000000 && data.percent_change_1h > 5) {
        return (
          <li key={ data.id } className="movers">
                <div className="center-content">
                  <a className="movers-link" target="_blank" href={"https://coinmarketcap.com/currencies/" + data.id + "/"}>
                      <div className="hourly-change">{data.percent_change_1h + "%"}</div>
                      <div className="coin-name">{data.name}</div>
                      <div className="coin-price">{"$" + data.price_usd}</div>
                    </a>
                </div>
            <div className="daily-change">{data.percent_change_24h + "%"}</div>
            <div className="daily-change-label">24hr +/-</div>
            {/* <div className="market-size">{"$" + parseInt(data.market_cap_usd).toFixed(0) } </div> */}
                        <div className="market-size">{ this.formatMoney(data.market_cap_usd) } </div>
            <div className="last-updated">{ this.convertEpochToDate(data.last_updated) } </div>
            <div onClick={(e) => this.addToFavorites(data) } className="add-favorites">+</div>
          </li>
        );
      }

      if ( this.state.showBigLosers === true && parseInt(data.market_cap_usd, 10) > 1000000 && data.percent_change_1h < -5) {
         return (
           <li key={ data.id } className="movers">
                 <div className="center-content">
                   <a className="movers-link" target="_blank" href={"https://coinmarketcap.com/currencies/" + data.id + "/"}>
                       <div className="hourly-change">{data.percent_change_1h + "%"}</div>
                       <div className="coin-name">{data.name}</div>
                       <div className="coin-price">{"$" + data.price_usd}</div>
                     </a>
                 </div>
             <div className="daily-change">{data.percent_change_24h + "%"}</div>
             <div className="daily-change-label">24hr +/-</div>
             {/* <div className="market-size">{"$" + parseInt(data.market_cap_usd).toFixed(0) } </div> */}
                         <div className="market-size">{ this.formatMoney(data.market_cap_usd) } </div>
             <div className="last-updated">{ this.convertEpochToDate(data.last_updated) } </div>
             <div onClick={(e) => this.addToFavorites(data) } className="add-favorites">+</div>
           </li>
         );
       }
  });
 }

 formatMoney(n) {
  //  return "$" + parseInt(n).toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
     return formatter.format(parseInt(n, 10));
 }

 convertEpochToDate(epoch) {
    const dateObj = Date(epoch);
    return moment(dateObj).format('MMM Do, h:mm');
 }


   showMovers = () => {
    this.setState( {showBigLosers: false} );
   }

   showLosers = () => {
    this.setState( {showBigLosers: true} );
   }

  render() {
    return (
      <div className="app-wrapper">
        <div className="header">
          <h1 className="">Coins on the Move</h1>
          <div className="filter-wrapper">
            <button onClick={ this.showMovers } className="movers-button button">See Movers</button>
            <button onClick= {this.showLosers } className="losers-button button">See Losers</button>
          </div>
          <div className="main-coin-wrapper">
              <div className="coin-label">Current price of Bitcoin: ${ this.state.bitcoin.price_usd }</div>
              {/* <div className="coin">{ this.state.bitcoin.price_usd }</div> */}
          </div>
        </div>
        <div className="mover-outer">
          <ul className="movers-list">
            { this.renderBigMovers() }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
