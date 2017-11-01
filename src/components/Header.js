import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import '../css/App.css';
import '../css/header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
        // bitcoin: {}
    }; // <- set up react state
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
             <div className="bitcoin-price">${ this.props.bitcoin.price_usd }</div>
         </div>
      </header>
    )
   }
}

export default Header
