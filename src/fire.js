import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDr-l9D8zwxeBBdoaFtdEU4s7uO3I-7BEQ",
    authDomain: "coin-movers.firebaseapp.com",
    databaseURL: "https://coin-movers.firebaseio.com",
    projectId: "coin-movers",
    storageBucket: "coin-movers.appspot.com",
    messagingSenderId: "503332142929"
  };
var fire = firebase.initializeApp(config);
export default fire;
