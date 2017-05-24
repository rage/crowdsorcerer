// @flow
export const SUBMIT = 'SUBMIT';
export const ADD_TEST_IO = 'ADD_TEST_IO';

export function addTestIOAction(input: string, output: string) {
  return {
    input,
    output,
    type: ADD_TEST_IO,
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

export type AddTestIOAction = {
    input: string,
    output: string,
    type: string
};

export type SubmitAction = {
    assignment: string,
    modelSolution: string,
    testIo: [],
    type: string
};
