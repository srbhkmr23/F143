import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import reducer from './common/reducer';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import InnovecsysRoute from './common/core/innovecsysRoute';
import registerServiceWorker from './registerServiceWorker';

window.jQuery = window.$ = require('jquery');

require('bootstrap');

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
  <InnovecsysRoute store={store} />,
  document.getElementById('root')
);
registerServiceWorker();
