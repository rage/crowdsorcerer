// @flow
import IO from 'domain/io';
import { State as sState } from 'slate';
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import { startSendAction, sendReceivedAction, sendFailAction } from 'state/submission';

export const SUBMIT = 'SUBMIT';
export const ADD_TEST_FIELD = 'ADD_TEST_FIELD';
export const REMOVE_TEST_FIELD = 'REMOVE_TEST_FIELD';
export const CHANGE_ASSIGNMENT = 'CHANGE_ASSIGNMENT';
export const CHANGE_MODEL_SOLUTION = 'CHANGE_MODEL_SOLUTION';
export const CHANGE_TEST_INPUT = 'CHANGE_TEST_INPUT';
export const CHANGE_TEST_OUTPUT = 'CHANGE_TEST_OUTPUT';
export const ADD_HIDDEN_ROW = 'ADD_HIDDEN_ROW';
export const DELETE_HIDDEN_ROW = 'DELETE_HIDDEN_ROW';

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

export function createSubmitAction(
  assignment: sState,
  modelSolution: string,
  testIo: Array<Array<string>>,
  hiddenRows: Array<number>,
  ) {
  return {
    assignment,
    modelSolution,
    testIo,
    hiddenRows,
    type: SUBMIT,
  };
}

export function submitAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    dispatch(startSendAction());
    api.postForm(getState().form)
    .then((success) => {
      dispatch(sendReceivedAction());
      console.info(success);
    }
    , (error) => {
      console.error(error);
      dispatch(sendFailAction());
    });
    api.createSubscription(() => {
      console.info('dispatch action to change prosessing state');
    });
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

export type SubmitAction = {
  assignment: sState,
  modelSolution: string,
  testIo: Array<IO>,
  hiddenRows: Array<number>,
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
