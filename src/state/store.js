// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api';
import { Raw } from 'slate';
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { STATUS_NONE } from 'state/submission/reducer';
<<<<<<< da2856bebbe22f6a0e2839b752ad9a1cd3fb1601
import { openWebSocketConnectionAction } from 'state/submission/actions';
=======
import { openApiConnectionAction } from 'state/submission/actions';
import { getAssignmentInfoAction } from 'state/form/actions';
>>>>>>> Add save to localstorage by assignment
import rootReducer from './reducer';
import { trackLoginStateAction } from './user';
import { setReviewableExerciseAction } from './review';

<<<<<<< da2856bebbe22f6a0e2839b752ad9a1cd3fb1601
=======
const STORAGE = 'crowdsorcerer-redux-state';
let STORAGE_NAME;

>>>>>>> Add save to localstorage by assignment
export type ThunkArgument = {
  api: Api
};

function saveStateInLocalStorage(storageName: string) {
  return store => next => (action) => {
    next(action);
    const state = store.getState();
<<<<<<< da2856bebbe22f6a0e2839b752ad9a1cd3fb1601
=======
    if (!state) {
      return;
    }
>>>>>>> Add save to localstorage by assignment
    const saveableState = {
      ...state,
      ...{
        form: {
          ...state.form,
          ...{
            assignment: {
              value: Raw.serialize(state.form.assignment.get(), { terse: true }),
              errors: state.form.assignment.errors,
            },
          },
        },
      },
    };
<<<<<<< da2856bebbe22f6a0e2839b752ad9a1cd3fb1601
    localStorage[storageName] = JSON.stringify(saveableState);
=======
    localStorage[STORAGE_NAME] = JSON.stringify(saveableState);
>>>>>>> Add save to localstorage by assignment
  };
}

function loadStateFromLocalStorage(storageName: string) {
  if (!localStorage[storageName]) {
    return undefined;
  }
  const state = JSON.parse(localStorage[storageName]);
  const assignmentValue = Raw.deserialize(state.form.assignment.value, { terse: true });
  const ios = state.form.inputOutput.map((io) => {
    const input = new FormValue(io.input.value, io.input.errors);
    const output = new FormValue(io.output.value, io.output.errors);
    return new IO(input, output);
  });
  return {
    ...state,
    ...{
      form: {
        ...state.form,
        ...{
          assignment: new FormValue(assignmentValue, state.form.assignment.errors),
          modelSolution: new FormValue(state.form.modelSolution.value, state.form.modelSolution.errors),
          inputOutput: ios,
          tags: new FormValue(state.form.tags.value, state.form.tags.errors),
        },
      },
      review: {
        ...state.review,
        ...{
          comment: new FormValue(state.review.comment.value, state.review.errors),
          reviews: state.review.reviews.map(review => new FormValue(review.value, review.errors)),
        },
      },
    },
  };
}

export default function makeStore(assignment: string, review: boolean) {
  const storageName = `crowdsorcerer-redux-state-${assignment}`;
  const assignmentId = parseInt(assignment, 10);
  const api = new Api();
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */
  const store = createStore(
    rootReducer(assignmentId), loadStateFromLocalStorage(storageName),
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument({ api }), saveStateInLocalStorage(storageName)),
    ),
  );
  store.dispatch(trackLoginStateAction());
  if (review) {
    store.dispatch(setReviewableExerciseAction(parseInt(assignmentId, 10)));
  } else if (store.getState().submission.status !== STATUS_NONE) {
    store.dispatch(openWebSocketConnectionAction());
  }
  api.syncStore(store);
  return store;
}
