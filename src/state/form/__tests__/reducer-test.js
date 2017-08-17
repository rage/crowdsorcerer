// @flow
import test from 'ava';
import reducers from 'state/reducer';
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import { Raw } from 'slate';
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
const oneLineChangeAdd = { from: { line: 0, ch: 0 }, text: oneLineSolution.split('\n'), to: { line: 0, ch: 15 } };
const twoLineChange = { from: { line: 0, ch: 0 }, text: twoLineSolution.split('\n'), to: { line: 1, ch: 12 } };
const threeLineChange = { from: { line: 0, ch: 0 }, text: threeLineSolution.split('\n'), to: { line: 2, ch: 12 } };
const simpleAssignment = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'Type something',
        },
      ],
    },
  ],
}, { terse: true });

const initialAssignment = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: '',
        },
      ],
    },
  ],
}, { terse: true });

const emptyTest1 = new IO();
emptyTest1.input.errors = ['Kenttä ei voi olla tyhjä.'];
emptyTest1.output.errors = ['Kenttä ei voi olla tyhjä.'];

const emptyTest2 = new IO();
emptyTest2.input.errors = ['Kenttä ei voi olla tyhjä.'];
emptyTest2.output.errors = ['Kenttä ei voi olla tyhjä.'];

const reducer = reducers(1);

const assignmentWithContent = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'Tämä on tarpeeksi pitkä malliratkaisu',
        },
      ],
    },
  ],
}, { terse: true });

test('Add a single empty field to intial state test input/output array', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(''),
      inputOutput: [new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { field: new IO(), type: ADD_TEST_FIELD },
  );
  t.deepEqual(state.form.inputOutput, [emptyTest1, emptyTest2]);
});

test('Add new test input to the first test input/output array', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(''),
      inputOutput: [new IO(), new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { testInput: 'Test', index: 0, type: CHANGE_TEST_INPUT },
  );
  t.deepEqual(state.form.inputOutput[0].input.get(), 'Test');
  t.deepEqual(state.form.inputOutput[0].output.get(), '');
});

test('Add new test output to the first test input/output array', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(''),
      inputOutput: [new IO(new FormValue('Test'), new FormValue('')), new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { testOutput: 'Hello', index: 0, type: CHANGE_TEST_OUTPUT },
  );

  t.deepEqual(state.form.modelSolution.get(), '');
  t.deepEqual(state.form.inputOutput[0].input.get(), 'Test');
  t.deepEqual(state.form.inputOutput[0].output.get(), 'Hello');
});

test('Add new hidden row to selection adds to solutionsRows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(twoLineSolution),
      inputOutput: [new IO(), new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { row: 0, type: ADD_HIDDEN_ROW },
  );

  t.deepEqual(state.form.solutionRows, [0]);
});

test('Delete hidden row from selection deletes form solutionRows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: twoLineSolution,
      inputOutput: [new IO(), new IO()],
      solutionRows: [0, 1],
      readOnlyModelSolutionLines: [],
    },
    },
    { row: 0, type: DELETE_HIDDEN_ROW },
  );

  t.deepEqual(state.form.solutionRows, [1]);
});

test('Changing assigment changes assignment in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: twoLineSolution,
      inputOutput: [new IO(), new IO()],
      solutionRows: [0, 1],
      readOnlyModelSolutionLines: [],
    },
    },
    { assignment: simpleAssignment, type: CHANGE_ASSIGNMENT },
  );

  t.deepEqual(state.form.assignment.get(), simpleAssignment);
});

test('Changing model solution changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(''),
      inputOutput: [new IO(), new IO()],
      solutionRows: [0, 1],
      readOnlyModelSolutionLines: [] },
    },
    { modelSolution: twoLineSolution, change: twoLineChange, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.get(), twoLineSolution);
});

test('Removing one selected line from model solution changes model solution and selected solution rows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(threeLineSolution.concat('\n')),
      inputOutput: [new IO(), new IO()],
      solutionRows: [1, 2],
      readOnlyModelSolutionLines: [],
    },
    },
    {
      modelSolution: threeLineSolution,
      change: { from: { line: 2, ch: 12 }, removed: ['', ''], text: [''], to: { line: 3, ch: 0 } },
      type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.get(), threeLineSolution);
  t.deepEqual(state.form.solutionRows, [1]);
});

test('Removing two selected lines from model solution changes model solution and selected solution rows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(threeLineSolution),
      inputOutput: [new IO(), new IO()],
      solutionRows: [0, 1, 2],
      readOnlyModelSolutionLines: [],
    },
    },
    {
      modelSolution: oneLineSolution,
      change: {
        from: { line: 1, ch: 0 },
        removed: ["System.out.println('Yo!')", 'return world;', ''],
        text: [''],
        to: { line: 3, ch: 0 },
      },
      type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.get(), oneLineSolution);
  t.deepEqual(state.form.solutionRows, [0]);
});

test('Remove model solution changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(oneLineSolution),
      inputOutput: [new IO(), new IO()],
      readOnlyModelSolutionLines: [],
      solutionRows: [0] },
    },
    { modelSolution: '', change: oneLineChangeAdd, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.get(), '');
});

test('Change model solution without selected rows changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(threeLineSolution),
      inputOutput: [new IO(), new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    {
      modelSolution: twoLineSolution,
      change: { from: { line: 1, ch: 0 }, removed: ["System.out.println('Yo!')"], text: [''], to: { line: 1, ch: 25 } },
      type: CHANGE_MODEL_SOLUTION,
    },
  );

  t.deepEqual(state.form.modelSolution.get(), twoLineSolution);
});

test('Add new line to model solution changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(twoLineSolution),
      inputOutput: [new IO(), new IO()],
      solutionRows: [0],
      readOnlyModelSolutionLines: [],
    },
    },
    { modelSolution: threeLineSolution, change: threeLineChange, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.get(), threeLineSolution);
  t.deepEqual(state.form.solutionRows, [0]);
});

test('Remove a single empty field from intial state test input/output array', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(''),
      inputOutput: [new IO(), new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { index: 0, type: REMOVE_TEST_FIELD },
  );
  t.deepEqual(state.form.inputOutput, [emptyTest1]);
});

test('Remove only field from intial state test input/output array', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue(''),
      inputOutput: [new IO()],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { index: 0, type: REMOVE_TEST_FIELD },
  );
  t.deepEqual(state.form.inputOutput, [emptyTest1]);
});

test('form not valid without assignment', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: new FormValue('asdf \n asf asdf'),
      inputOutput: [new IO(new FormValue('asdf'), new FormValue('asdf'))],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { testInput: 'Test', index: 0, type: CHANGE_TEST_INPUT },
  );
  t.deepEqual(state.form.valid, false);
});

test('form not valid without assignment', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      modelSolution: 'asdf \n asf asdf',
      inputOutput: [new IO(new FormValue('asdf'),
      new FormValue('asdf'))],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { testInput: 'Test', index: 0, type: CHANGE_TEST_INPUT },
  );
  t.deepEqual(state.form.valid, false);
});

test('form not valid without model solution', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      modelSolution: new FormValue(''),
      inputOutput: [new IO(new FormValue('asdf'), new FormValue('asdf'))],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { testInput: 'Test', index: 0, type: CHANGE_TEST_INPUT },
  );
  t.deepEqual(state.form.valid, false);
});

test('form not valid without tests', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      modelSolution: new FormValue(''),
      inputOutput: [],
      solutionRows: [],
      readOnlyModelSolutionLines: [],
    },
    },
    { modelSolution: oneLineSolution, change: oneLineChangeAdd, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.valid, false);
});
