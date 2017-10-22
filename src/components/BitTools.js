// src/components/About/index.js
import React, { Component } from 'react';
import '../css/App.css';
import 'react-table/react-table.css';
import '../css/bitTools.css';
import { getCoinData } from '../api-calls';
import fire from '../fire';
import ReactTable from 'react-table';

export const snapshotToArray = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
};

class BitTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
        newCoinId: "",
        newCoinAmount: "",
        newCoin: {},
        watchList: []
    };
    this.watchList = [];
    this.newCoin = {};
    this.handleNewCoinIdChange = this.handleNewCoinIdChange.bind(this);
    this.handleNewCoinAmountChange = this.handleNewCoinAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
     let watchListRef = fire.database().ref('watchList').limitToLast(100);
     watchListRef.on('value', snapshot => {
         console.log(snapshotToArray(snapshot));
       /* Update React state when message is added at Firebase Database */
        let newData = snapshotToArray(snapshot);
       this.setState( {watchList:newData} );
     })
 }

  handleNewCoinIdChange(event) {
   this.setState({newCoinId: event.target.value});
  }

  handleNewCoinAmountChange(event) {
   this.setState({newCoinAmount: event.target.value});
  }

 handleSubmit(event) {
   event.preventDefault();
   getCoinData(this.state.newCoinId).then(
     response => {
       if (response.status !== 200) {
         console.log('Looks like there was a problem. Status Code: ' +
           response.status);
         return;
       }
         response.json().then(data => {
           // fire.database().ref('coins').push( data );
           this.setState({ newCoin:data[0] });
           this.newCoin = this.state.newCoin
           this.newCoin.amount = this.state.newCoinAmount;
           this.newCoin.valueInUSD = this.newCoin.amount * this.newCoin.price_usd
           fire.database().ref('watchList').push( this.newCoin );
           this.setState( {
               newCoinId: "",
               newCountAmount:""
           } )
         return;
       });
     }
   )
   .catch(function(err) {
     console.log('Fetch Error :-S', err);
   });

  }

  // addCoinToWatchList() => {
  //
  // }

  render() {
    // const data = this.state.watchList;
    const columns = [{
        Header: 'Coin Name',
        accessor: 'name'
    }, {
        Header: 'Price (usd)',
        accessor: 'price_usd'
    }, {
        Header: 'Amount Held',
        accessor: 'amount'
    }

    ];
    return (
      <div className="watch-list-outer">
        <h1>WatchList</h1>
        <div className="add-container">
            <form onSubmit={this.handleSubmit}>
            <input placeholder="symbol" type="text" value={this.state.newCoinId} onChange={this.handleNewCoinIdChange}/>
            <input  placeholder="amount" type="text" value={this.state.newCoinAmount} onChange={this.handleNewCoinAmountChange}/>
            <button>Add Coin</button>
        </form>
        </div>
        <div className="react-table-outer">
            <ReactTable
                data={this.state.watchList}
                columns={columns}
            />
        </div>
      </div>
    );
  }
}

export default BitTools;
