import React from 'react';
import './css/index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));

// registerServiceWorker();
