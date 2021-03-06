// @flow
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { State as sState } from 'slate';
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import type { Change } from 'state/form/reducer';
import {
  startSendAction,
  postSuccessfulAction,
  postUnsuccessfulAction,
  authenticationError,
  setExerciseAction,
  openWebSocketConnectionAction,
  assignmentNotFoundAction,
  connectionTerminatedPrematurelyAction,
} from 'state/submission/actions';
import getReadOnlyLines from 'utils/get-read-only-lines';

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
export const NEW_EXERCISE_RECEIVED = 'NEW_EXERCISE_RECEIVED';
export const RESET_TO_BOILERPLATE = 'RESET_TO_BOILERPLATE';
export const SET_READ_ONLY_SOLUTION_LINES = 'SET_READ_ONLY_SOLUTION_LINES';
export const ASSIGNMENT_INFO_RECEIVED = 'ASSIGNMENT_INFO_RECEIVED';
export const SET_BOILERPLATE = 'SET_BOILERPLATE';
export const SET_SHOW_CODE_TEMPLATE = 'TOGGLE_ SHOW_CODE_TEMPLATE';
export const FORM_DONE = 'FORM_DONE';
export const CHANGE_UNIT_TESTS = 'CHANGE_UNIT_TESTS';
export const TEST_TYPE_CHANGED = 'TEST_TYPE_CHANGED';
export const ADD_MARKERS = 'ADD_MARKERS';
export const DELETE_MARKERS = 'DELETE_MARKERS';
export const CHANGE_TEST_IN_TEST_ARRAY = 'CHANGE_TEST_IN_TEST_ARRAY';
export const CHANGE_TEST_NAME = 'CHANGE_TEST_NAME';
export const CHANGE_PREVIEW_STATE = 'CHANGE_PREVIEW_STATE';

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

export function modelSolutionChangeAction(modelSolution: string, change: Change) {
  return {
    modelSolution,
    change,
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

export type Tag = {
  name: string,
};

export type TestIO = {
  input: string,
  output: string,
  type: string,
};

export type ExerciseJSON = {
  id: number,
  description: string,
  testIO: Array<TestIO>,
  model_solution: string,
  template: string,
  unit_tests: Array<Object>,
};

export function newExerciseReceivedAction(state: ExerciseJSON, tags: Array<Tag>, testingType: string) {
  const newState = {};
  newState.inputOutput = state.testIO.map(io => new IO(new FormValue(io.input), new FormValue(io.output), io.type));
  newState.assignment = state.description;
  newState.readOnlyModelSolution = state.model_solution;
  newState.readOnlyCodeTemplate = state.template;
  newState.tagSuggestions = tags.map(tag => tag.name);
  newState.tests = state.unit_tests;
  newState.testingType = testingType;
  return {
    newState,
    type: NEW_EXERCISE_RECEIVED,
  };
}

export function submitFormAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    dispatch(startSendAction());
    api.postForm(getState().form, getState().assignment)
    .then(
      (response) => {
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

export function assignmentInfoReceivedAction(
  newTags: Array<Tag>, boilerplate: string, testTemplate: ?string, testingType: string,
) {
  const tagSuggestions = newTags.map(tag => tag.name);
  const readOnlyModelSolutionLines = getReadOnlyLines(boilerplate);
  let readOnlyUnitTestsLines;
  if (testTemplate) {
    readOnlyUnitTestsLines = getReadOnlyLines(testTemplate);
  }
  let testArray = [];
  if (testingType === 'io_and_code' || testingType === 'tests_for_set_up_code') {
    testArray = [{
      name: new FormValue('<placeholderTestName>'),
      code: testTemplate,
      input: '<placeholderInput>',
      output: '<placeholderOutput>',
    }];
  }
  return {
    tagSuggestions,
    boilerplate,
    readOnlyModelSolutionLines,
    testTemplate,
    readOnlyUnitTestsLines,
    testingType,
    testArray,
    type: ASSIGNMENT_INFO_RECEIVED,
  };
}

export function resetCodeToBoilerplateAction(boilerplate: String) {
  return {
    boilerplate,
    type: RESET_TO_BOILERPLATE,
  };
}

export function fetchBoilerPlateAction() {
  return async function fetcher(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    api.getAssignmentInformation(getState().assignment.assignmentId)
    .then(
      (response) => {
        dispatch(resetCodeToBoilerplateAction(response.template));
      },
      () => {
        dispatch(connectionTerminatedPrematurelyAction());
      },
    );
  };
}

export function resetToBoilerplateAction() {
  return {
    type: RESET_TO_BOILERPLATE,
  };
}

export function getAssignmentInfoAction() {
  return async function getter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    api.getAssignmentInformation(getState().assignment.assignmentId)
    .then(
      (response) => {
        dispatch(assignmentInfoReceivedAction(
          response.tags, response.template, response.test_template,
          response.exercise_type,
        ));
      },
      (error) => {
        if (error.status === 403) {
          dispatch(authenticationError());
        } else if (error.status === 400) {
          dispatch(assignmentNotFoundAction());
        } else {
          dispatch(connectionTerminatedPrematurelyAction());
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

export function setShowCodeTemplateAction(show: boolean) {
  return {
    show,
    type: SET_SHOW_CODE_TEMPLATE,
  };
}

export function formDoneAction() {
  return {
    type: FORM_DONE,
  };
}

export function testTypeChangedAction(newType: string, index: number) {
  return {
    newType,
    index,
    type: TEST_TYPE_CHANGED,
  };
}

export function unitTestsChangeAction(unitTests: string, change: Change) {
  return {
    unitTests,
    change,
    type: CHANGE_UNIT_TESTS,
  };
}

export function addMarkersAction(markers: Array<Object>) {
  return {
    markers,
    type: ADD_MARKERS,
  };
}

export function deleteMarkersAction() {
  return {
    type: DELETE_MARKERS,
  };
}

export function changeTestInTestArrayAction(index: number) {
  return {
    index,
    type: CHANGE_TEST_IN_TEST_ARRAY,
  };
}

export function changeTestNameAction(name: string, index: number) {
  return {
    name,
    index,
    type: CHANGE_TEST_NAME,
  };
}

export function changePreviewStateAction(state: boolean) {
  return {
    state,
    type: CHANGE_PREVIEW_STATE,
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
  change: Change,
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
   readOnlyModelSolution: string,
   readOnlyCodeTemplate: string,
   inputOutput: Array<IO>,
   tagSuggestions: Array<string>,
   tests: Array<Object>,
   testingType: string
}

export type NewExerciseReceivedAction = {
  newState: ReviewForm,
  type: string,
};

export type AssignmentInfoReceivedAction = {
  boilerplate: string,
  readOnlyModelSolutionLines: number[],
  tagSuggestions: Array<string>,
  testTemplate: ?string,
  readOnlyUnitTestsLines: number[],
  type: string,
  testingType: string,
  testArray: Array<Object>
};

export type SetShowCodeTemplateAction = {
  show: boolean,
  type: string,
};

export type TestTypeChangedAction = {
  index: number,
  newType: string,
  type: string,
};

export type ChangeUnitTestsAction = {
  unitTests: string,
  change: Change,
  type: string,
}

export type AddMarkersAction = {
  markers: Array<Object>,
  type: string
};

export type DeleteMarkersAction = {
  type: string
}

export type ChangeTestInTestArrayAction = {
  index: number,
  type: string
}

export type ChangeTestNameAction = {
  name: string,
  type: string,
}

export type ChangePreviewStateAction = {
  state: boolean,
  type: string,
}

export type ResetCodeToBoilerplateAction = {
  boilerplate: string,
  type: string,
}
