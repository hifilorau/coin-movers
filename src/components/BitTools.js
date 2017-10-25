// src/components/About/index.js
import React, { Component } from 'react';
import '../css/App.css';
import 'react-table/react-table.css';
import '../css/bitTools.css';
import { getCoinData } from '../api-calls';
import fire from '../fire';
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';

class BitTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showModal: false,
        newCoinId: "",
        newCoinAmount: "",
        newCoin: {},
        watchList: [],
        totalValue: "",
        newCoinPurchasePrice: ""
    };
    this.watchList = [];
    this.newCoin = {};
    this.handleNewCoinIdChange = this.handleNewCoinIdChange.bind(this);
    this.handleNewCoinAmountChange = this.handleNewCoinAmountChange.bind(this);
    this.handleNewCoinPurchasePrice = this.handleNewCoinPurchasePrice.bind(this);
    // this.handleNewCoinAmountChange = this.handleNewCoinAmountChange.bind(this);
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
                 item.valueFixed = item.valueInUSD.toFixed(2)
                 item.percent_change_1h = Number(data.percent_change_1h)
                 item.percent_change_24h = Number(data.percent_change_24h)
                 item.percent_change_7d = data.percent_change_7d
                 item.link = 'https://coinmarketcap.com/currencies/' + data.id
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

  handleNewCoinPurchasePrice(event) {
   this.setState({newCoinPurchasePrice: event.target.value});
  }

 handleSubmit(event) {
   event.preventDefault();
   this.newCoin.id = this.state.newCoinId;
   this.newCoin.amount = this.state.newCoinAmount;
   this.newCoin.purchasePrice = this.state.newCoinPurchasePrice;
   fire.database().ref('watchList').push( this.newCoin );
   let watchListRef = fire.database().ref('watchList').limitToLast(100);
   watchListRef.on('value', snapshot => {
     /* Update React state when message is added at Firebase Database */
     let newData = this.snapshotToArray(snapshot);
     this.setState( {watchList:newData} );
   })
  }

  showModal() {
    this.setState( { showModal: true } );
    console.log(this.state.showModal);
  }

  hideModal() {
    this.setState( { showModal: false } );
    console.log(this.state.showModal);
  }

  createModal() {
    return (
      <div className="modal-outer">
        <div className="modal-inner">
          <h2 className="modal-title">Coin Details</h2>
          <div className="close-modal" onClick={ ()=> this.hideModal() }>X</div>
          <form onSubmit={this.handleSubmit}>
            <input placeholder="Coinmarket Cap ID" type="text" value={this.state.newCoinId} onChange={this.handleNewCoinIdChange}/>
            <input  placeholder="Amount Owned" type="text" value={this.state.newCoinAmount} onChange={this.handleNewCoinAmountChange}/>
            <input  placeholder="Purchase Price" type="text" value={this.state.newCoinPurchasePrice} onChange={this.handleNewCoinPurchasePrice}/>
            <button className="modal-button">Add Coin</button>
          </form>
        </div>
      </div>
    )
  }


  render() {
    const columns = [{
        Header: 'Coin Name',
        accessor: 'name'
    }, {
        Header: 'Current Price',
        accessor: 'price_usd'
    }, {
      Header: '1 Hr %',
      accessor: 'percent_change_1h',
      Cell: row => (<div>
      {row.value}%
      </div>
      )
    },{
      Header: '24 hr %',
      accessor: 'percent_change_24h',
      Cell: row => (<div>
      {row.value}%
      </div>
      )
    }, {
        Header: '7 Day %',
        accessor: 'percent_change_7d',
        Cell: row => (<div>
        {row.value}%
        </div>
        )
    },{
        Header: 'Amount Held',
        accessor: 'amount'
    }, {
        Header: 'Total $',
        accessor: 'valueFixed',
        Cell: row => (<div>
        ${row.value}
        </div>
        )
    }, {
        Header: 'Link',
        accessor: 'link',
        Cell: row => (<div>
        <a target="_blank" href={row.value}>
         Charts
       </a>
        </div>
        )
    }];
    return (
      <div className="watch-list-outer">
        { this.state.showModal === true && this.createModal() }
        <div className="page-content">
          <div className="add-container">
            <h2 className="bt-title">WatchList</h2>

            <h2 className="total-value">Trading Value: ${this.state.totalValue}</h2>
            <button className="add-coin" onClick={ () => this.showModal() }>+ COIN</button>
          </div>
          <div className="react-table-outer">
              <ReactTable
                  data={this.state.watchList}
                  columns={columns}
                  className={"-striped, -highlight, react-table"}
                  defaultPageSize= {10}
                  defaultSortMethod={(a, b) => {
                      // force null and undefined to the bottom
                      a = (a === null || a === undefined) ? -Infinity : a
                      b = (b === null || b === undefined) ? -Infinity : b
                      // force any string values to lowercase
                      // a = a === 'string' ? a.toLowerCase() : a
                      // b = b === 'string' ? b.toLowerCase() : b
                      a = Number(a)
                      b = Number(b)
                      // Return either 1 or -1 to indicate a sort priority
                      if (a > b) {
                        return 1
                      }
                      if (a < b) {
                        return -1
                      }
                      // returning 0, undefined or any falsey value will use subsequent sorts or the index as a tiebreaker
                      return 0
                    }
                  }
              />
          </div>
          <div className="exchance-links-outer section">
            <h2>My Exchanges</h2>
            <ul className="exchanges">
              <li><a target="_blank" className="exchange-link" href="https://cryptopia.co.nz">Cryptopia</a></li>
              <li><a target="_blank" className="exchange-link" href="https://bittrex.com">Bittrex</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default BitTools;
