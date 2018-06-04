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
  RESET_TO_BOILERPLATE,
} from 'state/form';

const boilerplate = '// START LOCK \n import java.util.*; \n // END LOCK';
const oneLineSolution = 'print("Hello");';
const twoLineSolution = `print('Hello');
return world;`;
const threeLineSolution = `print('Hello');
System.out.println('Yo!');
return world;`;
const oneLineChangeAdd = { from: { line: 0, ch: 0 }, text: oneLineSolution.split('\n'), to: { line: 0, ch: 15 } };
const twoLineChangeAdd = { from: { line: 0, ch: 0 }, text: twoLineSolution.split('\n'), to: { line: 1, ch: 12 } };
const threeLineChangeAddToTwoLine = { from: { line: 1, ch: 12 }, text: threeLineSolution.split('\n'), to: { line: 2, ch: 12 } };
const twoToThreeChange =
  { from: { line: 0, ch: 15 }, text: "\nSystem.out.println('Yo!');".split('\n'), to: { line: 2, ch: 12 } };
const threeToTwoChange =
  { from: { line: 0, ch: 15 }, removed: "\nSystem.out.println('Yo!');".split('\n'), to: { line: 2, ch: 12 }, text: [''] };
const oneLineChangeRemoved = {
  from: {
    line: 0,
    ch: 0,
  },
  removed: oneLineSolution.split('\n'),
  text: [''],
  to: {
    line: 0,
    ch: 15,
  },
};
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
      inputOutput: [new IO()],
      modelSolution: {
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
        editableModelSolution: new FormValue(''),
      },
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
      inputOutput: [new IO(), new IO()],
      modelSolution:
      {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO(new FormValue('Test'), new FormValue('')), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    { testOutput: 'Hello', index: 0, type: CHANGE_TEST_OUTPUT },
  );

  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), '');
  t.deepEqual(state.form.inputOutput[0].input.get(), 'Test');
  t.deepEqual(state.form.inputOutput[0].output.get(), 'Hello');
});

test('Add new hidden row to selection adds to solutionsRows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editabelModelSolution: new FormValue(twoLineSolution),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    { row: 0, type: ADD_HIDDEN_ROW },
  );

  t.deepEqual(state.form.modelSolution.solutionRows.get(), [0]);
});

test('Delete hidden row from selection deletes form solutionRows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: twoLineSolution,
        solutionRows: new FormValue([0, 1]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    { row: 0, type: DELETE_HIDDEN_ROW },
  );

  t.deepEqual(state.form.modelSolution.solutionRows.get(), [1]);
});

test('Changing assigment changes assignment in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: twoLineSolution,
        solutionRows: [0, 1],
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([0, 1]),
        readOnlyModelSolutionLines: [] },
    },
    },
    { modelSolution: twoLineSolution, change: twoLineChangeAdd, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), twoLineSolution);
});

test('Removing one selected line from model solution changes model solution and selected solution rows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(threeLineSolution.concat('\n')),
        solutionRows: new FormValue([1, 2]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    {
      modelSolution: threeLineSolution,
      change: { from: { line: 2, ch: 12 }, removed: ['', ''], text: [''], to: { line: 3, ch: 0 } },
      type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), threeLineSolution);
  t.deepEqual(state.form.modelSolution.solutionRows.get(), [1]);
});

test('Removing two selected lines from model solution changes model solution and selected solution rows in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(threeLineSolution),
        solutionRows: new FormValue([0, 1, 2]),
        readOnlyModelSolutionLines: [],
      },
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

  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), oneLineSolution);
  t.deepEqual(state.form.modelSolution.solutionRows.get(), [0]);
});

test('Removing model solution changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(oneLineSolution),
        readOnlyModelSolutionLines: [],
        solutionRows: new FormValue([]),
      },
    },
    },
    { modelSolution: '', change: oneLineChangeRemoved, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), '');
});

test('Change model solution without selected rows changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(threeLineSolution),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    {
      modelSolution: twoLineSolution,
      change: { from: { line: 1, ch: 0 }, removed: ["System.out.println('Yo!')"], text: [''], to: { line: 1, ch: 25 } },
      type: CHANGE_MODEL_SOLUTION,
    },
  );

  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), twoLineSolution);
});

test('Add new line to model solution changes model solution in state', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(twoLineSolution),
        solutionRows: new FormValue([0]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    { modelSolution: threeLineSolution, change: threeLineChangeAddToTwoLine, type: CHANGE_MODEL_SOLUTION },
  );

  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), threeLineSolution);
  t.deepEqual(state.form.modelSolution.solutionRows.get(), [0]);
});

test('Remove a single empty field from intial state test input/output array', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(initialAssignment),
      inputOutput: [new IO(), new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO()],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO(new FormValue('asdf'), new FormValue('asdf'))],
      modelSolution: {
        editableModelSolution: new FormValue('asdf \n asf asdf'),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO(new FormValue('asdf'), new FormValue('asdf'))],
      modelSolution: {
        editableModelSolution: new FormValue('asdf'),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO(new FormValue('asdf'), new FormValue('asdf'))],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
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
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
    },
    },
    { modelSolution: oneLineSolution, change: oneLineChangeAdd, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.valid, false);
});

test('form not valid without tags', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(''),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
      },
      tags: new FormValue([]),
    },
    },
    { modelSolution: oneLineSolution, change: oneLineChangeAdd, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.valid, false);
});

test('resetting to boilerplate overrides old modelSolution', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(oneLineSolution),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [],
        boilerplate: {
          code: boilerplate,
          readOnlyLines: [0],
        },
      },
      tags: new FormValue([]),
    },
    },
    { type: RESET_TO_BOILERPLATE },
  );
  t.deepEqual(state.form.modelSolution.editableModelSolution.get(), boilerplate);
});

test('readOnlyLines move up when lines removed above them', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(threeLineSolution),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [2],
        boilerplate: {
          code: boilerplate,
          readOnlyLines: [1],
        },
      },
      tags: new FormValue([]),
    },
    },
    { modelSolution: twoLineSolution, change: threeToTwoChange, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.modelSolution.readOnlyModelSolutionLines, [1]);
});

test('readOnlyLines move down when lines added above them', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(twoLineSolution),
        solutionRows: new FormValue([]),
        readOnlyModelSolutionLines: [1],
        boilerplate: {
          code: boilerplate,
          readOnlyLines: [1],
        },
      },
      tags: new FormValue([]),
    },
    },
    { modelSolution: threeLineSolution, change: twoToThreeChange, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.modelSolution.readOnlyModelSolutionLines, [2]);
});

test('solutionRows move up when lines removed above them', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(threeLineSolution),
        solutionRows: new FormValue([2]),
        readOnlyModelSolutionLines: [],
        boilerplate: {
          code: boilerplate,
          readOnlyLines: [1],
        },
      },
      tags: new FormValue([]),
    },
    },
    { modelSolution: twoLineSolution, change: threeToTwoChange, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.modelSolution.solutionRows.get(), [1]);
});

test('solutionRows move down when lines added above them', (t) => {
  const state = reducer(
    { form:
    {
      assignment: new FormValue(assignmentWithContent),
      inputOutput: [new IO(new FormValue(''), new FormValue(''))],
      modelSolution: {
        editableModelSolution: new FormValue(twoLineSolution),
        solutionRows: new FormValue([1]),
        readOnlyModelSolutionLines: [],
        boilerplate: {
          code: boilerplate,
          readOnlyLines: [1],
        },
      },
      tags: new FormValue([]),
    },
    },
    { modelSolution: threeLineSolution, change: twoToThreeChange, type: CHANGE_MODEL_SOLUTION },
  );
  t.deepEqual(state.form.modelSolution.solutionRows.get(), [2]);
});
