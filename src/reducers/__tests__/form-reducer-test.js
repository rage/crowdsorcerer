import test from 'ava';
import reducers from 'state/reducer';
import {
  ADD_TEST_FIELD,
  CHANGE_ASSIGNMENT,
  CHANGE_MODEL_SOLUTION,
  CHANGE_TEST_INPUT,
  CHANGE_TEST_OUTPUT,
  ADD_HIDDEN_ROW,
  DELETE_HIDDEN_ROW,
} from 'state/actions';

const twoLineSolution = `print('Hello');
return world`;
const simpleAssignment = 'Type something';

test('Add a single empty field to intial state test input/output array', (t) => {
  const state = reducers(
    { formReducer: { assignment: '', modelSolution: '', inputOutput: [['', ''], ['', '']], solutionRows: [] } },
    { field: ['', ''], type: ADD_TEST_FIELD },
  );

  t.deepEqual(state.formReducer.inputOutput, [['', ''], ['', ''], ['', '']]);
});

test('Add new test input to the first test input/output array', (t) => {
  const state = reducers(
    { formReducer: { assignment: '', modelSolution: '', inputOutput: [['', ''], ['', '']], solutionRows: [] } },
    { testInput: 'Test', index: 0, type: CHANGE_TEST_INPUT },
  );

  t.deepEqual(state.formReducer.inputOutput, [['Test', ''], ['', '']]);
});

test('Add new test output to the first test input/output array', (t) => {
  const state = reducers(
    { formReducer: { assignment: '', modelSolution: '', inputOutput: [['Test', ''], ['', '']], solutionRows: [] } },
    { testOutput: 'Hello', index: 0, type: CHANGE_TEST_OUTPUT },
  );

  t.deepEqual(state.formReducer.modelSolution, '');
  t.deepEqual(state.formReducer.inputOutput, [['Test', 'Hello'], ['', '']]);
});

test('Add new hidden row to selection adds to solutionsRows in state', (t) => {
  const state = reducers(
    { formReducer: { assignment: '', modelSolution: twoLineSolution, inputOutput: [['', ''], ['', '']], solutionRows: [] } },
    { row: 0, type: ADD_HIDDEN_ROW },
  );

  t.deepEqual(state.formReducer.solutionRows, [0]);
});

test('Delete hidden row from selection deletes form solutionRows in state', (t) => {
  const state = reducers(
    { formReducer:
      { assignment: '', modelSolution: twoLineSolution, inputOutput: [['', ''], ['', '']], solutionRows: [0, 1] },
    },
    { row: 0, type: DELETE_HIDDEN_ROW },
  );

  t.deepEqual(state.formReducer.solutionRows, [1]);
});

test('Changing assigment changes assignment in state', (t) => {
  const state = reducers(
    { formReducer:
      { assignment: '', modelSolution: twoLineSolution, inputOutput: [['', ''], ['', '']], solutionRows: [0, 1] },
    },
    { assignment: simpleAssignment, type: CHANGE_ASSIGNMENT },
  );

  t.deepEqual(state.formReducer.assignment, simpleAssignment);
});


test('Changing model solution changes model solution in state', (t) => {
  const state = reducers(
    { formReducer:
      { assignment: '', modelSolution: '', inputOutput: [['', ''], ['', '']], solutionRows: [0, 1] },
    },
    { modelSolution: twoLineSolution, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.formReducer.modelSolution, twoLineSolution);
});
