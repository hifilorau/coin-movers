import React, { Component } from 'react';
import Main from './components/Main';
import Header from './components/Header';
import { getCoinData } from './api-calls';

// this component will be rendered by our <___Router>
class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
          bitcoin: {}
      }; // <- set up react state
    }

    componentDidMount() {
        this.pullBitcoinData();
        this.bitcoinInterval = setInterval(this.pullBitcoinData, 60000)
    }

    componentWillUnmount() {
        clearInterval(this.bitcoinInterval)
    }

    pullBitcoinData = () => {
        getCoinData('bitcoin').then(
          response => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }
              response.json().then(data => {
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
          <div className="app-outer-wrapper">
            <Header
                bitcoin={this.state.bitcoin}
            />
            <Main
                bitcoin={this.state.bitcoin}
            />
          </div>
          )
    }
}

export default App
