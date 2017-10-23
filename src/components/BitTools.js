// src/components/About/index.js
import React, { Component } from 'react';
import '../css/App.css';
import 'react-table/react-table.css';
import '../css/bitTools.css';
import { getCoinData } from '../api-calls';
import fire from '../fire';
import ReactTable from 'react-table';

class BitTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
        newCoinId: "",
        newCoinAmount: "",
        newCoin: {},
        watchList: [],
        totalValue: ""
    };
    this.watchList = [];
    this.newCoin = {};
    this.handleNewCoinIdChange = this.handleNewCoinIdChange.bind(this);
    this.handleNewCoinAmountChange = this.handleNewCoinAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    //   fire.database().ref('watchList').remove();
     let watchListRef = fire.database().ref('watchList').limitToLast(100);
     watchListRef.on('value', snapshot => {
       /* Update React state when message is added at Firebase Database */
      let newData = this.snapshotToArray(snapshot);
    //    this.setState( {watchList:newData} );
     })
  }

   snapshotToArray = snapshot => {
     let returnArr = [];
     let totalValue = 0;
     let totalValueFixed = 0;

     snapshot.forEach(childSnapshot => {
         let item = childSnapshot.val();
         item.key = childSnapshot.key;
         getCoinData(item.id).then(
           response => {
             if (response.status !== 200) {
               console.log('Looks like there was a problem. Status Code: ' +
                 response.status);
               return;
             }
               response.json().then(data => {
                 data = data[0]
                 item.price_usd = data.price_usd
                 item.name = data.name
                 item.valueInUSD = item.amount * item.price_usd
                 totalValue = totalValue + item.valueInUSD
                 totalValueFixed = totalValue.toFixed(2)
                 this.setState( {totalValue:totalValueFixed} );
               return;
             });
           }
         )
         .catch(function(err) {
           console.log('Fetch Error :-S', err);
         });
         console.log(item);
         returnArr.push(item);
     });
     console.log(returnArr);
      this.setState( {watchList:returnArr, totalValue: totalValue} );
      console.log(this.state.watchList);
     return returnArr;
   };

  handleNewCoinIdChange(event) {
   this.setState({newCoinId: event.target.value});
  }

  handleNewCoinAmountChange(event) {
   this.setState({newCoinAmount: event.target.value});
  }

 handleSubmit(event) {
   event.preventDefault();
   this.newCoin.id = this.state.newCoinId;
   this.newCoin.amount = this.state.newCoinAmount;
   fire.database().ref('watchList').push( this.newCoin );
   let watchListRef = fire.database().ref('watchList').limitToLast(100);
   watchListRef.on('value', snapshot => {
     /* Update React state when message is added at Firebase Database */
     let newData = this.snapshotToArray(snapshot);
     this.setState( {watchList:newData} );
   })
  }

  render() {
    console.log(this.state.watchList);
    const columns = [{
        Header: 'Coin Name',
        accessor: 'name'
    }, {
        Header: 'Price (usd)',
        accessor: 'price_usd'
    }, {
        Header: 'Amount Held',
        accessor: 'amount'
    }, {
        Header: 'Total $',
        accessor: 'valueInUSD'
    }

    ];
    return (
      <div className="watch-list-outer">
        <h1>WatchList</h1>
        <div className="add-container">
            <form onSubmit={this.handleSubmit}>
            <input placeholder="coin id" type="text" value={this.state.newCoinId} onChange={this.handleNewCoinIdChange}/>
            <input  placeholder="amount" type="text" value={this.state.newCoinAmount} onChange={this.handleNewCoinAmountChange}/>
            <button>Add Coin</button>
        </form>
        <div className="total-value">{this.state.totalValue}</div>
        </div>
        <div className="react-table-outer">
            <ReactTable
                data={this.state.watchList}
                columns={columns}
                className={"striped, highlight, react-table"}
                defaultPageSize= {10}
            />
        </div>
      </div>
    );
  }
}

export default BitTools;
