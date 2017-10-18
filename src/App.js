import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import fire from './fire';
import { getPriceData } from './api-calls';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      coins:{}
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
        let newData = { dataset: snapshot.val(), id:snapshot.key};
        let hourlyChange = newData.dataset[0].percent_change_1h;
        let coinName = newData.dataset[0].name;
        console.log(hourlyChange + " " + coinName);

     })

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
            //   console.log(this.state.coins[0]);
            return data[0];
          });
        }
      )
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
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
    //   <form onSubmit={this.addMessage.bind(this)}>
     <form onSubmit={this.calculateCoin.bind(this)}>
        <input type="text" ref={ el => this.inputEl = el }/>
        <input type="submit"/>
        <ul>
          { /* Render the list of messages */
            this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
            // this.state.data.map( coin => <li key={coin.id}>{coin.name}{coin.price_usd}</li> )
          }
        </ul>
      </form>
    );
  }
}

export default App;
