import 'babel-polyfill';
import 'whatwg-fetch';
// import '../node_modules/bootstrap/scss/bootstrap.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import makeStore from 'state/store';

import './styles';
import App from './components/app';

window.initCrowdsorcerer = function initCrowdsorcerer() {
  document.querySelectorAll('.crowdsorcerer-widget').forEach((e) => {
    const assignmentId = e.dataset.assignment;
    const store = makeStore(assignmentId);
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      e,
    );
  });
};
