// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api';
import rootReducer from './reducer';

export type ThunkArgument = {
  api: Api
}

export default function makeStore() {
  const api = new Api();
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */
  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument({ api })),
    ),
  );
  api.syncStore(store);
  return store;
}
