import React from 'react';
import { render } from 'react-dom';
import App from './containers/App.jsx';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import reducer from './store/reducers';

let store = applyMiddleware(
  thunkMiddleware
  // createLogger()
)(createStore)(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
