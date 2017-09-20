// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import Api from 'utils/api';
import ReduxActionAnalytics from 'redux-action-analytics';
import * as storejs from 'store';
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { STATUS_NONE } from 'state/submission/';
import { openWebSocketConnectionAction } from 'state/submission/actions';
import { getAssignmentInfoAction } from 'state/form/actions';
import applicationStateNotComplete from 'utils/application-state-not-complete';
import { Raw } from 'slate';
import rootReducer from './reducer';
import { trackLoginStateAction } from './user';
import { resetReviewableAction, setReviewableExerciseAction } from './review';
import type PeerReviewQuestion from './review';
import type { ExerciseJSON, Tag } from './form';

export type ThunkArgument = {
  api: Api
};

function saveStateInLocalStorage(storageName: string) {
  return store => next => (action) => {
    next(action);
    const state = store.getState();
    const saveableState = {
      ...state,
      form: {
        ...state.form,
        assignment: {
          value: Raw.serialize(state.form.assignment.get(), { terse: true }),
          errors: state.form.assignment.errors,
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
  if (applicationStateNotComplete(state)) {
    return undefined;
  }
  console.info('state from localstorage');
  const assignmentValue = Raw.deserialize(state.form.assignment.value, { terse: true });
  const ios = state.form.inputOutput.map((io) => {
    const input = new FormValue(io.input.value, io.input.errors);
    const output = new FormValue(io.output.value, io.output.errors);
    return new IO(input, output);
  });
  return {
    ...state,
    form: {
      ...state.form,
      assignment: new FormValue(assignmentValue, state.form.assignment.errors),
      inputOutput: ios,
      tags: new FormValue(state.form.tags.value, state.form.tags.errors),
      modelSolution: {
        ...state.form.modelSolution,
        editableModelSolution: state.form.modelSolution.editableModelSolution
                ? new FormValue(state.form.modelSolution.editableModelSolution.value,
                  state.form.modelSolution.editableModelSolution.errors)
                : undefined,
      },
    },
    review: {
      ...state.review,
      comment: new FormValue(state.review.comment.value, state.review.comment.errors),
      reviews: state.review.reviews ? new FormValue(state.review.reviews.value, state.review.reviews.errors) : undefined,
    },
  };
}

export default function makeStore(
  assignment: string,
  review: boolean,
  exerciseJSON: ExerciseJSON,
  peerReviewQuestions: Array<PeerReviewQuestion>,
  tags: Array<Tag>,
  storeCount: number,
  ) {
  let storageName = `crowdsorcerer-redux-state-${assignment}`;
  const assignmentId = parseInt(assignment, 10);
  const api = new Api();
  let identifier = `assignment-${assignment}`;
  if (review) {
    identifier += '-review';
    storageName += `-review-${storeCount}`;
  }
  const analytics = new ReduxActionAnalytics(
    'https://usage.testmycode.io/api/v0/data',
    'crowdsorcerer',
    identifier,
    10000,
    () => {
      const user = storejs.get('tmc.user');
      if (user === undefined) {
        return {};
      }
      return {
        username: user.username,
      };
    });
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */
  const store = createStore(
    rootReducer(assignmentId), loadStateFromLocalStorage(storageName),
    composeEnhancers(
      applyMiddleware(
        analytics.getMiddleware(),
        thunk.withExtraArgument({ api }),
        saveStateInLocalStorage(storageName)),
    ),
  );
  store.dispatch(trackLoginStateAction());
  if (review && store.getState().review.reviews === undefined) {
    store.dispatch(setReviewableExerciseAction(exerciseJSON, peerReviewQuestions, tags));
  } else if (store.getState().submission.status !== STATUS_NONE) {
    store.dispatch(openWebSocketConnectionAction());
  } else if (applicationStateNotComplete(store.getState())) {
    store.dispatch(resetReviewableAction);
    store.dispatch(getAssignmentInfoAction());
  }
  api.syncStore(store);
  return store;
}

