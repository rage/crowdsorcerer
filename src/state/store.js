// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api';
import { Raw } from 'slate';
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { STATUS_NONE } from 'state/submission/reducer';
import { openWebSocketConnectionAction } from 'state/submission/actions';
import { getAssignmentInfoAction } from 'state/form/actions';
import rootReducer from './reducer';
import { trackLoginStateAction } from './user';
import { setReviewableExerciseAction, resetReviewableAction } from './review';

export type ThunkArgument = {
  api: Api
};

function saveStateInLocalStorage(storageName: string) {
  return store => next => (action) => {
    next(action);
    const state = store.getState();
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
    localStorage[storageName] = JSON.stringify(saveableState);
  };
}

function loadStateFromLocalStorage(storageName: string) {
  const storedState = localStorage[storageName];
  if (!storedState) {
    return undefined;
  }
  const state = JSON.parse(storedState);
  console.info('state from localstorage');
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
          inputOutput: ios,
          tags: new FormValue(state.form.tags.value, state.form.tags.errors),
          modelSolution: {
            ...state.form.modelSolution,
            ...{
              editableModelSolution: state.form.editableModelSolution
                ? new FormValue(state.form.modelSolution.editableModelSolution.value,
                  state.form.modelSolution.editableModelSolution.errors)
                : undefined,
            },
          },
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
  let storageName = `crowdsorcerer-redux-state-${assignment}`;
  const peerReview = review ? 'review' : 'exercise';
  storageName = `${storageName}-${peerReview}`;
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
    store.dispatch(setReviewableExerciseAction());
  } else if (store.getState().submission.status !== STATUS_NONE) {
    store.dispatch(openWebSocketConnectionAction());
  } else if (store.getState().form.modelSolution === undefined) {
    store.dispatch(resetReviewableAction);
    store.dispatch(getAssignmentInfoAction());
  }
  api.syncStore(store);
  return store;
}

