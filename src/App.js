import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import fire from './fire';
import { getPriceData, getCoinData } from './api-calls';
import moment from 'moment';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      coins:{},
      bigMovers: [],
      bitcoin: {}
    }; // <- set up react state
  }
  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    // let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    // messagesRef.on('child_added', snapshot => {
    //   /* Update React state when message is added at Firebase Database */
    //   let message = { text: snapshot.val(), id: snapshot.key };
    //   this.setState({ messages: [message].concat(this.state.messages) });
    // })

     let coinsRef = fire.database().ref('coins').orderByKey().limitToLast(100);
     coinsRef.on('child_added', snapshot => {
       /* Update React state when message is added at Firebase Database */
        let newData = { dataset: snapshot.val()};
        let hourlyChange = [...newData.dataset].slice(0);
        hourlyChange.sort(function(a,b) {
          return b.percent_change_1h - a.percent_change_1h;
       })
       this.setState({ bigMovers:hourlyChange })
     })

     fire.database().ref('coins').remove();

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
              fire.database().ref('coins').push( data );
              this.setState({ bitcoin:data[0] });
              console.log(this.state.bitcoin[0]);
            return;
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }

// createColor() {
//   return '#'+Math.floor(Math.random()*16777215).toString(16);
// }

 renderBigMovers() {
   return this.state.bigMovers.map((data) => {
     if (parseInt(data.market_cap_usd) > 1000000 && data.percent_change_1h > 5) {
        return (
          <li key={ data.id } className="movers">
            <a className="movers-link" target="_blank" href={"https://coinmarketcap.com/currencies/" + data.id + "/"}>
                <div className="center-content">
                      <div className="hourly-change">{data.percent_change_1h + "%"}</div>
                      <div className="coin-name">{data.name}</div>
                      <div className="coin-price">{"$" + data.price_usd}</div>
                </div>
            </a>
            <div className="daily-change">{data.percent_change_24h + "%"}</div>
            <div className="daily-change-label">24hr +/-</div>
            {/* <div className="market-size">{"$" + parseInt(data.market_cap_usd).toFixed(0) } </div> */}
                        <div className="market-size">{ this.formatMoney(data.market_cap_usd) } </div>
            <div className="last-updated">{ this.convertEpochToDate(data.last_updated) } </div>
          </li>
        );
      }
  });
 }

 formatMoney(n) {
  //  return "$" + parseInt(n).toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
     return formatter.format(parseInt(n));
 }

 convertEpochToDate(epoch) {
    const dateObj = Date(epoch);
    return moment(dateObj).format('MMM Do, h:mm');
 }

  addMessage(e){
    e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push( this.inputEl.value );
    this.inputEl.value = ''; // <- clear the input
  }

   calculateCoin = (e) => {
    e.preventDefault();
    console.log('query data');
   }

  render() {
    return (
      <div>
        <div className="header">
          <h1 className="">Coins on the Move</h1>
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
