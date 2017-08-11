// @flow
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { State as sState } from 'slate';
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import {
  startSendAction,
  postSuccessfulAction,
  postUnsuccessfulAction,
  authenticationError,
  setExerciseAction,
  openWebSocketConnectionAction,
} from 'state/submission';

export const ADD_TEST_FIELD = 'ADD_TEST_FIELD';
export const REMOVE_TEST_FIELD = 'REMOVE_TEST_FIELD';
export const CHANGE_ASSIGNMENT = 'CHANGE_ASSIGNMENT';
export const CHANGE_MODEL_SOLUTION = 'CHANGE_MODEL_SOLUTION';
export const CHANGE_TEST_INPUT = 'CHANGE_TEST_INPUT';
export const CHANGE_TEST_OUTPUT = 'CHANGE_TEST_OUTPUT';
export const ADD_HIDDEN_ROW = 'ADD_HIDDEN_ROW';
export const DELETE_HIDDEN_ROW = 'DELETE_HIDDEN_ROW';
export const CHANGE_FORM_ERRORS_VISIBILITY = 'CHANGE_FORM_ERRORS_VISIBILITY';
export const ADD_TAG = 'ADD_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';
export const SET_FORM_STATE = 'SET_FORM_STATE';
export const SET_TAG_SUGGESTIONS = 'SET_TAG_SUGGESTIONS';

export function addTestFieldAction() {
  return {
    field: new IO(),
    type: ADD_TEST_FIELD,
  };
}

export function removeTestFieldAction(index: number) {
  return {
    index,
    type: REMOVE_TEST_FIELD,
  };
}

export function assignmentChangeAction(assignment: sState) {
  return {
    assignment,
    type: CHANGE_ASSIGNMENT,
  };
}

export function modelSolutionChangeAction(modelSolution: string) {
  return {
    modelSolution,
    type: CHANGE_MODEL_SOLUTION,
  };
}

export function testInputChangeAction(testInput: string, index: number) {
  return {
    testInput,
    index,
    type: CHANGE_TEST_INPUT,
  };
}

export function testOutputChangeAction(testOutput: string, index: number) {
  return {
    testOutput,
    index,
    type: CHANGE_TEST_OUTPUT,
  };
}

export function changeFormErrorVisibilityAction() {
  return {
    type: CHANGE_FORM_ERRORS_VISIBILITY,
  };
}

type testIO = {
  input: string,
  output: string,
};

type formStateJSON = {
  code: string,
  testIO: Array<testIO>,
  description: string,
};

export function setFormState(state: formStateJSON) {
  const newState = {};
  newState.modelSolution = new FormValue(state.code);
  newState.inputOutput = state.testIO.map(io => new IO(new FormValue(io.input), new FormValue(io.output)));
  newState.assignment = state.description;
  return {
    newState,
    type: SET_FORM_STATE,
  };
}

type Tag = {
  name: string,
};

export function setTagSuggestions(newTags: Array<Tag>) {
  const tagSuggestions = newTags.map(tag => tag.name);
  return {
    tagSuggestions,
    type: SET_TAG_SUGGESTIONS,
  };
}

export function submitFormAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    dispatch(startSendAction());
    api.postForm(getState().form, getState().assignment)
    .then(
      (response) => {
        // status 400 == exercise already being processed
        dispatch(setExerciseAction(response.exercise.id));
        dispatch(postSuccessfulAction());
        dispatch(openWebSocketConnectionAction());
      },
      (error) => {
        if (error.status === 403) {
          dispatch(authenticationError());
        } else {
          dispatch(postUnsuccessfulAction());
        }
      },
    );
  };
}

export function formSubmitButtonPressedAction() {
  return function submitter(dispatch: Dispatch, getState: GetState) {
    dispatch(changeFormErrorVisibilityAction());
    const state = getState();
    if (!state.form.valid) {
      return;
    }
    dispatch(submitFormAction());
  };
}

export function addHiddenRow(row: number) {
  return {
    row,
    type: ADD_HIDDEN_ROW,
  };
}

export function deleteHiddenRow(row: number) {
  return {
    row,
    type: DELETE_HIDDEN_ROW,
  };
}

export function addTagAction(tag: string) {
  return {
    tag,
    type: ADD_TAG,
  };
}

export function removeTagAction(tagIndex: number) {
  return {
    tagIndex,
    type: REMOVE_TAG,
  };
}

export type AddTestFieldAction = {
  field: IO,
  type: string
};

export type RemoveTestFieldAction = {
  index: number,
  type: number
};

export type AssignmentChangeAction = {
  assignment: sState,
  type: sState
};

export type ModelSolutionChangeAction = {
  modelSolution: string,
  type: string
};

export type TestInputChangeAction = {
  testInput: string,
  type: string
};

export type TestOutputChangeAction = {
  testOutput: string,
  type: string
};

export type AddHiddenRowAction = {
  row: number,
  type: string
};

export type DeleteHiddenRowAction = {
  row: number,
  type: string
};

export type ChangeErrorsVisibilityAction = {
  type: string
};

export type AddTagAction = {
  tag: string,
  type: string,
};

export type RemoveTagAction = {
  tagIndex: number,
  type: string,
};

type ReviewForm = {
   assignment: sState,
   modelSolution: FormValue<string>,
   inputOutput: Array<IO>,
 };

export type SetFormStateAction = {
  newState: ReviewForm,
  type: string,
};

export type SetTagSuggestions = {
  tagSuggestions: Array<string>,
  type: string,
};
