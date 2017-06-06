// @flow
export const SUBMIT = 'SUBMIT';
export const ADD_TEST_FIELD = 'ADD_TEST_FIELD';
export const REMOVE_TEST_FIELD = 'REMOVE_TEST_FIELD';
export const CHANGE_ASSIGNMENT = 'CHANGE_ASSIGNMENT';
export const CHANGE_MODEL_SOLUTION = 'CHANGE_MODEL_SOLUTION';
export const CHANGE_TEST_INPUT = 'CHANGE_TEST_INPUT';
export const CHANGE_TEST_OUTPUT = 'CHANGE_TEST_OUTPUT';
export const ADD_HIDDEN_ROW = 'ADD_HIDDEN_ROW';
export const DELETE_HIDDEN_ROW = 'DELETE_HIDDEN_ROW';

export function addTestFieldAction(field: Array<string>) {
  return {
    field,
    type: ADD_TEST_FIELD,
  };
}

export function removeTestFieldAction() {
  return {
    type: REMOVE_TEST_FIELD,
  };
}

export function assignmentChangeAction(assignment: string) {
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

export function submitAction(
  assignment: string,
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
  field: Array<string>,
  type: string
};

export type AssignmentChangeAction = {
  assignment: string,
  type: string
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
  assignment: string,
  modelSolution: string,
  testIo: Array<Array<string>>,
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
