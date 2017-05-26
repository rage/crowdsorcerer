// @flow
export const SUBMIT = 'SUBMIT';
export const ADD_TEST_FIELD = 'ADD_TEST_FIELD';
export const CHANGE_ASSIGNMENT = 'CHANGE_ASSIGNMENT';
export const CHANGE_MODEL_SOLUTION = 'CHANGE_MODEL_SOLUTION';
export const CHANGE_TEST_INPUT = 'CHANGE_TEST_INPUT';
export const CHANGE_TEST_OUTPUT = 'CHANGE_TEST_OUTPUT';

export function addTestFieldAction(field: Array<string>) {
  return {
    field,
    type: ADD_TEST_FIELD,
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

export function submitAction(assignment: string, modelSolution: string, testIo: []) {
  return {
    assignment,
    modelSolution,
    testIo,
    type: SUBMIT,
  };
}

export type AddTestFieldAction = {
  Field: Array<string>,
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
  type: string
};
