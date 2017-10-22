import React from 'react';
import Main from './components/Main';
import Header from './components/Header';

// this component will be rendered by our <___Router>
const App = () => (
  <div className="app-outer-wrapper">
    <Header />
    <Main />
  </div>
)

export default App
