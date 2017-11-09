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
        showModal: false,
        newCoinId: "",
        masterArray: [],
        newCoinAmount: "",
        soldCoinId: "",
        soldCoinAmount: "",
        newCoin: {},
        soldCoin: {},
        watchList: [],
        ownedList: [],
        activeArray: [],
        totalValue: "",
        newCoinPurchasePrice: "",
        coinmatch: false,
        activeFilter: "owned",
    };
    this.watchList = [];
    this.newCoin = {};
    this.soldCoin = {};
    this.handleNewCoinIdChange = this.handleNewCoinIdChange.bind(this);
    this.handleSoldCoinIdChange = this.handleSoldCoinIdChange.bind(this);
    this.handleSoldCoinAmountChange = this.handleSoldCoinAmountChange.bind(this);
    this.handleNewCoinAmountChange = this.handleNewCoinAmountChange.bind(this);
    this.handleSoldCoinIdChange = this.handleSoldCoinIdChange.bind(this);
    this.handleNewCoinPurchasePrice = this.handleNewCoinPurchasePrice.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getData()
    this.dataInterval = setInterval(this.getData, 160000);
    this.filterData(this.state.activeFilter);
  }


  updateCoin = (newCoin, oldCoin)  => {
      console.log(newCoin);
      console.log(oldCoin);
      for (var value of this.state.masterArray) {
          if (newCoin.id === value.id) {
              // this.setState( {coinmatch:true}, () => {
                console.log('do update math');
                this.getData();
                break;
              // })
            }
           else {
                console.log(newCoin);
                fire.database().ref('watchList').push( newCoin );
                this.getData();
                break;
            }
        }

              // })
      }
      // }
  //  }
      // console.log(this.state.coinmatch);
      // if (this.state.coinmatch === true) {
      //   //  this.updateCoin(this.newCoin, this.soldCoin);
      // } else {
      //     fire.database().ref('watchList').push( this.newCoin );
      // }
      // let watchListRef = fire.database().ref('watchList').limitToLast(100);
      // watchListRef.on('value', snapshot => {
      //   /* Update React state when message is added at Firebase Database */
      //   let newData = this.snapshotToArray(snapshot);
      //   this.setState( {watchList:newData} );
      // })
      // let updateRef = fire.database().ref('watchList').child(coin);
      // console.log(updateRef);
      // updateRef.update({
      //     key: value
      // });
  // }

  convertUSDtoBTC = usd => {
      let btcPrice = usd / this.props.bitcoin.price_usd;
      return btcPrice;
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
                 item.price_btc = this.convertUSDtoBTC(item.price_usd)
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
         returnArr.push(item);
     });
     console.log(returnArr);
      this.setState( {activeArray:returnArr, totalValue: totalValue, masterArray:returnArr}, () => {
          return console.log(this.state.activeArray);
      } );
      console.log(this.state.activeArray);
     return returnArr;
   };

  handleNewCoinIdChange(event) {
   this.setState({newCoinId: event.target.value});
  }

  handleSoldCoinIdChange(event) {
   this.setState({soldCoinId: event.target.value});
  }

  handleNewCoinAmountChange(event) {
   this.setState({newCoinAmount: event.target.value});
  }

  handleSoldCoinAmountChange(event) {
   this.setState({soldCoinAmount: event.target.value});
  }

  handleNewCoinPurchasePrice(event) {
   this.setState({newCoinPurchasePrice: event.target.value});
  }

 handleSubmit(event) {
   let newData = [];
   event.preventDefault();
   this.newCoin.id = this.state.newCoinId;
   this.newCoin.amount = this.state.newCoinAmount;
   this.newCoin.purchasePrice = this.state.newCoinPurchasePrice;
   this.soldCoin.id =  this.state.soldCoinId;
   this.soldCoin.amount = this.state.soldCoinAmount;

  //  this.updateCoin(this.newCoin, this.soldCoin);
   this.updateCoin(this.newCoin, this.soldCoin);
  //  if (this.state.coinmatch === true) {
  //      /*   find                               */
  //  } else {
  //      fire.database().ref('watchList').push( this.newCoin );
  //  }
  //  let watchListRef = fire.database().ref('watchList').limitToLast(100);
   this.getData();
   this.setState( {watchList:newData} );
   this.hideModal();
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
            <input placeholder="Sold Coin ID" type="text" value={this.state.soldCoinId} onChange={this.handleSoldCoinIdChange}/>
            <input  placeholder="Amount Spent" type="text" value={this.state.soldCoinAmount} onChange={this.handleSoldCoinAmountChange}/>
            <input  placeholder="Purchase Price USD" type="text" value={this.state.newCoinPurchasePrice} onChange={this.handleNewCoinPurchasePrice}/>
            <button className="modal-button">Add Coin</button>
          </form>
        </div>
      </div>
    )
  }

  componentWillUnmount() {
      clearInterval(this.dataInterval)
  }

  filterData = (activeFilter) => {
     console.log(this.state.masterArray)
     let newArray = this.state.masterArray.filter((data) => {
        if (activeFilter === 'owned' ) {
         this.setState({activeFilter})
         return data.amount > 0
        }
        if (activeFilter === 'watch' ) {
        this.setState({activeFilter})
         return data.amount == 0
        }
    })
      console.log(newArray)
      this.setState( {activeArray: newArray} )
  }

  getData = () => {
      let watchListRef = fire.database().ref('watchList').limitToLast(100);
      watchListRef.on('value', snapshot => {
        /* Update React state when message is added at Firebase Database */
       let newData = this.snapshotToArray(snapshot);
       this.filterData(this.state.activeFilter);
      })
  }


  render() {
    const columns = [{
        Header: 'Coin Name',
        accessor: 'name'
    }, {
        Header: 'Price USD',
        accessor: 'price_usd',
        className: 'right-align',
        width: 90,
        Cell: row => (<div>
        ${Number(row.value).toFixed(2)}
        </div>
        )
    },
    {
        Header: 'Price BTC',
        accessor: 'price_btc',
        className: 'right-align',
        width: 100,
        Cell: row => (<div>
        {Number(row.value).toFixed(6)}
        </div>
        )
    }, {
      Header: '1 Hr %',
      accessor: 'percent_change_1h',
      width: 80,
      className: 'right-align',
      Cell: row => (<div>
      {row.value}%
      </div>
      )
    },{
      Header: '24 hr %',
      accessor: 'percent_change_24h',
      className: 'right-align',
      width: 80,
      Cell: row => (<div>
      {row.value}%
      </div>
      )
    }, {
        Header: '7 Day %',
        accessor: 'percent_change_7d',
        className: 'right-align',
        width: 80,
        Cell: row => (<div>
        {row.value}%
        </div>
        )
    },{
        Header: 'Count',
        accessor: 'amount',
        width: 80,
        className: 'right-align'
    }, {
        Header: 'Total $',
        accessor: 'valueFixed',
        className: 'right-align',
        Cell: row => (<div>
        ${row.value}
        </div>
        )
    }, {
        Header: 'Link',
        accessor: 'link',
        width: 60,
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

            <h2 className="total-value">
                Trading Value: ${this.state.totalValue}
                <span className="value-btc"> btc {(this.state.totalValue/this.props.bitcoin.price_usd).toFixed(3)} </span>
            </h2>
            <button className="add-coin" onClick={ () => this.showModal() }>+ COIN</button>
          </div>
          <div class="filter">
              <button onClick={ () => this.filterData('owned') }>Owned</button>
              <button onClick={ () => this.filterData('watch') }>Watch</button>
          </div>
          <div className="react-table-outer">
              <ReactTable
                  data={this.state.activeArray}
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
              <li><a target="_blank" rel="noopener noreferrer" className="exchange-link" href="https://cryptopia.co.nz">Cryptopia</a></li>
              <li><a target="_blank" rel="noopener noreferrer" className="exchange-link" href="https://bittrex.com">Bittrex</a></li>
              <li><a target="_blank" rel="noopener noreferrer" className="exchange-link" href="https://hitbtc.com/exchange">HitBTCse </a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default BitTools;
