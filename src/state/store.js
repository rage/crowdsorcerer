// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api/index';
import rootReducer from './reducer';
import { trackLoginStateAction } from './user';

export type ThunkArgument = {
  api: Api
};

export default function makeStore(assignmentId: string, review: boolean) {
  const api = new Api();
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */
  const store = createStore(
    rootReducer(assignmentId),
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument({ api })),
    ),
  );
  store.dispatch(trackLoginStateAction());
  if (review) {
    // get exercise id and form state from backend
    // store.dispatch();
  }
  api.syncStore(store);
  return store;
}
