import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../css/App.css';
import '../css/header.css';

import { getCoinData } from '../api-calls';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bitcoin: {}
    }; // <- set up react state
  }
  componentWillMount() {
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


  render() {
    return (
      <header>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/bittools'>BitTools</Link></li>
          </ul>
        </nav>
         <div className="bitcoin-price-wrapper">
             <div className="coin-label"><img src="https://bitcoin.org/img/icons/opengraph.png " /></div>
             <div className="bitcoin-price">${ this.state.bitcoin.price_usd }</div>
         </div>
      </header>
    )
   }
}

export default Header
