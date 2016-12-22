import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

import Main from './Main';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let store = createStore(rootReducer);

ReactDOM.render((
  <Provider store={store}>
    <Main />
  </Provider>
), document.getElementById('react-app'))