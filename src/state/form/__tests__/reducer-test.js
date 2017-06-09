// @flow
import test from 'ava';
import reducers from 'state/reducer';
import IO from 'domain/io';
import {
  ADD_TEST_FIELD,
  CHANGE_ASSIGNMENT,
  CHANGE_MODEL_SOLUTION,
  CHANGE_TEST_INPUT,
  CHANGE_TEST_OUTPUT,
  ADD_HIDDEN_ROW,
  DELETE_HIDDEN_ROW,
  REMOVE_TEST_FIELD,
} from 'state/form';

const oneLineSolution = 'print("Hello");';
const twoLineSolution = `print('Hello');
return world;`;
const threeLineSolution = `print('Hello');
System.out.println('Yo!');
return world;`;
const simpleAssignment = 'Type something';

test('Add a single empty field to intial state test input/output array', (t) => {
  const state = reducers(
    { form: { assignment: '', modelSolution: '', inputOutput: [new IO()], solutionRows: [] } },
    { field: new IO(), type: ADD_TEST_FIELD },
  );

  t.deepEqual(state.form.inputOutput, [new IO(), new IO()]);
});

test('Add new test input to the first test input/output array', (t) => {
  const state = reducers(
    { form: { assignment: '', modelSolution: '', inputOutput: [new IO(), new IO()], solutionRows: [] } },
    { testInput: 'Test', index: 0, type: CHANGE_TEST_INPUT },
  );

  t.deepEqual(state.form.inputOutput[0].input, 'Test');
  t.deepEqual(state.form.inputOutput[0].output, '');
});

test('Add new test output to the first test input/output array', (t) => {
  const state = reducers(
    { form: { assignment: '', modelSolution: '', inputOutput: [new IO('Test', ''), new IO()], solutionRows: [] } },
    { testOutput: 'Hello', index: 0, type: CHANGE_TEST_OUTPUT },
  );

  t.deepEqual(state.form.modelSolution, '');
  t.deepEqual(state.form.inputOutput[0].input, 'Test');
  t.deepEqual(state.form.inputOutput[0].output, 'Hello');
});

test('Add new hidden row to selection adds to solutionsRows in state', (t) => {
  const state = reducers(
    { form: { assignment: '', modelSolution: twoLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [] } },
    { row: 0, type: ADD_HIDDEN_ROW },
  );

  t.deepEqual(state.form.solutionRows, [0]);
});

test('Delete hidden row from selection deletes form solutionRows in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: twoLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [0, 1] },
    },
    { row: 0, type: DELETE_HIDDEN_ROW },
  );

  t.deepEqual(state.form.solutionRows, [1]);
});

test('Changing assigment changes assignment in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: twoLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [0, 1] },
    },
    { assignment: simpleAssignment, type: CHANGE_ASSIGNMENT },
  );

  t.deepEqual(state.form.assignment, simpleAssignment);
});

test('Changing model solution changes model solution in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: '', inputOutput: [new IO(), new IO()], solutionRows: [0, 1] },
    },
    { modelSolution: twoLineSolution, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution, twoLineSolution);
});

test('Remove a one selected line from model solution changes model solution and selected solution rows in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: threeLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [1, 2] },
    },
    { modelSolution: twoLineSolution, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution, twoLineSolution);
  t.deepEqual(state.form.solutionRows, [1]);
});

test('Remove two selected lines from model solution changes model solution and selected solution rows in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: threeLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [1, 2] },
    },
    { modelSolution: oneLineSolution, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution, oneLineSolution);
  t.deepEqual(state.form.solutionRows, [0]);
});

test('Remove model solution changes model solution in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: oneLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [0] },
    },
    { modelSolution: '', type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution, '');
});

test('Change model solution without selected rows changes model solution in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: twoLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [] },
    },
    { modelSolution: oneLineSolution, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution, oneLineSolution);
});

test('Add new line to model solution changes model solution in state', (t) => {
  const state = reducers(
    { form:
      { assignment: '', modelSolution: twoLineSolution, inputOutput: [new IO(), new IO()], solutionRows: [0] },
    },
    { modelSolution: threeLineSolution, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution, threeLineSolution);
  t.deepEqual(state.form.solutionRows, [0]);
});

test('Remove a single empty field from intial state test input/output array', (t) => {
  const state = reducers(
    { form: { assignment: '', modelSolution: '', inputOutput: [new IO(), new IO()], solutionRows: [] } },
    { index: 0, type: REMOVE_TEST_FIELD },
  );

  t.deepEqual(state.form.inputOutput, [new IO()]);
});

test('Remove only field from intial state test input/output array', (t) => {
  const state = reducers(
    { form: { assignment: '', modelSolution: '', inputOutput: [new IO()], solutionRows: [] } },
    { index: 0, type: REMOVE_TEST_FIELD },
  );

  t.deepEqual(state.form.inputOutput, [new IO()]);
});

