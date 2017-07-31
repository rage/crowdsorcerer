// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api';
import { Raw } from 'slate';
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { STATUS_NONE } from 'state/submission/reducer';
import { openApiConnectionAction } from 'state/form/actions';
import rootReducer from './reducer';
import { trackLoginStateAction } from './user';
import { setReviewableExerciseAction } from './review';

const STORAGE_NAME = 'redux-state';

export type ThunkArgument = {
  api: Api
};

function saveStateInLocalStorage() {
  return store => next => (action) => {
    next(action);
    const state = store.getState();
    if (state) {
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
      localStorage[STORAGE_NAME] = JSON.stringify(saveableState);
    }
  };
}

function loadStateFromLocalStorage() {
  if (!localStorage[STORAGE_NAME]) {
    return undefined;
  }
  const state = JSON.parse(localStorage[STORAGE_NAME]);
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

export default function makeStore(assignmentId: string, review: boolean) {
  const api = new Api();
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */
  const store = createStore(
    rootReducer(assignmentId), loadStateFromLocalStorage(),
    composeEnhancers(
      applyMiddleware(thunk.withExtraArgument({ api }), saveStateInLocalStorage()),
    ),
  );
  store.dispatch(trackLoginStateAction());
  if (review) {
    store.dispatch(setReviewableExerciseAction(parseInt(assignmentId, 10)));
  } else if (store.getState().submission.status !== STATUS_NONE) {
    store.dispatch(openApiConnectionAction());
  }
  api.syncStore(store);
  return store;
}
