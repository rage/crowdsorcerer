// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api';
import { save, load } from 'redux-localstorage-simple';
import rootReducer from './reducer';
import { trackLoginStateAction } from './user';
import { setReviewableExerciseAction } from './review';

export type ThunkArgument = {
  api: Api
};

export default function makeStore(assignmentId: string, review: boolean) {
  const api = new Api();
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */
  const initial = JSON.parse(localStorage.getItem('redux_localstorage_simple'));
  const store = createStore(
    rootReducer(assignmentId), initial,
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument({ api }), save()),
    ),
  );
  store.dispatch(trackLoginStateAction());
  if (review) {
    // get exercise id and form state from backend
    store.dispatch(setReviewableExerciseAction(parseInt(assignmentId, 10)));
  }
  api.syncStore(store);
  return store;
}
