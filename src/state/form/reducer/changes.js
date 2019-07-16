// @flow
import { createReducer } from 'redux-create-reducer';
import FormValue from 'domain/form-value';
import IO from 'domain/io';
import {
  ADD_TEST_FIELD,
  REMOVE_TEST_FIELD,
  CHANGE_ASSIGNMENT,
  CHANGE_MODEL_SOLUTION,
  CHANGE_TEST_INPUT,
  CHANGE_TEST_OUTPUT,
  ADD_HIDDEN_ROW,
  DELETE_HIDDEN_ROW,
  CHANGE_FORM_ERRORS_VISIBILITY,
  REMOVE_TAG,
  ADD_TAG,
  NEW_EXERCISE_RECEIVED,
  ASSIGNMENT_INFO_RECEIVED,
  RESET_TO_BOILERPLATE,
  SET_SHOW_CODE_TEMPLATE,
  FORM_DONE,
  TEST_TYPE_CHANGED,
  CHANGE_UNIT_TESTS,
  ADD_MARKERS,
  DELETE_MARKERS,
  CHANGE_TEST_IN_TEST_ARRAY,
  CHANGE_TEST_NAME,
  CHANGE_PREVIEW_STATE,
  ADD_TEST_INPUT_LINE,
  REMOVE_TEST_INPUT_LINE,
} from 'state/form/actions';
import type {
    AddTestFieldAction,
    RemoveTestFieldAction,
    TestInputChangeAction,
    TestOutputChangeAction,
    AssignmentChangeAction,
    ModelSolutionChangeAction,
    AddHiddenRowAction,
    DeleteHiddenRowAction,
    AddTagAction,
    RemoveTagAction,
    NewExerciseReceivedAction,
    AssignmentInfoReceivedAction,
    SetShowCodeTemplateAction,
    TestTypeChangedAction,
    ChangeUnitTestsAction,
    AddMarkersAction,
    ChangeTestInTestArrayAction,
    ChangeTestNameAction,
    ChangePreviewStateAction,
    ResetCodeToBoilerplateAction,
    AddTestInputLineAction,
    RemoveTestInputLineAction,
} from 'state/form/actions';
import { Raw } from 'slate';
import getReadOnlyLines from 'utils/get-read-only-lines';
import getCleanPlate from '../../../utils/get-clean-plate';
import type { State } from './index';

let testInputCounter = 0;

const initialState: State = {
  assignment: new FormValue(Raw.deserialize({
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
  }, { terse: true })),
  valid: false,
  showErrors: false,
  tagSuggestions: [],
  tags: new FormValue([]),
  inputOutput: [new IO(new FormValue([{ content: '', id: testInputCounter }]), new FormValue(''))],
  modelSolution: {
    solutionRows: new FormValue([]),
    editableModelSolution: undefined,
    boilerplate: { code: '', readOnlyLines: [] },
    readOnlyModelSolutionLines: [],
    readOnlyModelSolution: undefined,
    readOnlyCodeTemplate: undefined,
    showTemplate: false,
    markers: [],
  },
  unitTests: {
    editableUnitTests: undefined,
    boilerplate: {
      code: '',
      readOnlyLines: [],
    },
    readOnlyLines: [],
    markers: [],
    testArray: [],
  },
  done: false,
  testingType: '',
  previewState: false,
};

testInputCounter++;

// left here for future purposes
// const supportedTestTypes = ['contains', 'notContains', 'equals'];

const handleMarkers = (stateMarkers: Array<Object>, change: Object) => {
    // - if a line with marked char is edited remove markers from that line
    // - if a line is added/removed move all markers after it
  let markers = stateMarkers;
  for (let i = 0; i < stateMarkers.length; i++) {
    const m = stateMarkers[i];
    if (m.line === change.from.line
      || (m.line > change.from.line && m.line <= change.to.line)
      || (change.removed[1] && m.line === change.to.line && m.char < change.to.ch
        && change.removed[1].length >= change.from.ch - m.char)
          ) {
      markers = markers.filter(marker => marker !== m);
    } else if (change.from.line < m.line) {
      const line = m.line;
      const char = m.char;

      if (!(change.from.line === line && change.from.ch >= char)) {
        m.line += change.text.length - change.removed.length;
      }
    }
  }
  return markers;
};

export default createReducer(initialState, {
  [ADD_TEST_FIELD](state: State, action: AddTestFieldAction): State {
    return {
      ...state,
      inputOutput: [...state.inputOutput, action.field],
      unitTests: {
        ...state.unitTests,
        testArray: [...state.unitTests.testArray,
          { name: new FormValue('<placeholderTestName>'),
            code: state.unitTests.boilerplate.code,
            input: '<placeholderInput>',
            output: '<placeholderOutput>' },
        ],
      },
    };
  },

  [REMOVE_TEST_FIELD](state: State, action: RemoveTestFieldAction): State {
    let inputOutput;
    let testArray;

    if (state.inputOutput.length === 1) {
      inputOutput = [new IO()];
      testArray = [{
        name: new FormValue('<placeholderTestName>'),
        code: state.unitTests.boilerplate.code,
        input: '<placeholderInput>',
        output: '<placeholderOutput>',
      }];
    } else {
      inputOutput = [
        ...state.inputOutput.slice(0, action.index),
        ...state.inputOutput.slice(action.index + 1),
      ];
      testArray = [
        ...state.unitTests.testArray.slice(0, action.index),
        ...state.unitTests.testArray.slice(action.index + 1),
      ];
    }

    return {
      ...state,
      inputOutput,
      unitTests: {
        ...state.unitTests,
        testArray,
      },
    };
  },
  [CHANGE_MODEL_SOLUTION](state: State, action: ModelSolutionChangeAction): State {
    // controls the movement of marked model solution rows when model solution is changed
    const modelSolution = state.modelSolution.editableModelSolution;
    if (modelSolution === undefined || modelSolution === null) {
      return state;
    }
    // prevent the removal of the last editable line
    const change = action.change;
    const startLine = change.from.line;
    let newSolutionRows = state.modelSolution.solutionRows.get();
    let newReadOnlyRows = state.modelSolution.readOnlyModelSolutionLines;
    const rowsInOldModelSolution = modelSolution.get().split('\n');
    const rowsInNewModelSolution = action.modelSolution.split('\n');
    const solutionLengthDifferenceToNew = rowsInNewModelSolution.length - rowsInOldModelSolution.length;

    const markers = handleMarkers(state.modelSolution.markers, change);

    if (solutionLengthDifferenceToNew < 0) {
        // text was removed
        // removed contains the deleted text
      const solutionLengthDifference = change.removed.length - change.text.length;
        // deleted the removed marked lines
      const deletedRowLength = solutionLengthDifference - 1;
      newSolutionRows = newSolutionRows.filter(row => row <= startLine || row > startLine + deletedRowLength);
      newSolutionRows = newSolutionRows.map((row) => {
        if (row >= startLine + solutionLengthDifference) {
          if (row - solutionLengthDifference >= 0) {
            return row - solutionLengthDifference;
          }
          return 0;
        }
        return row;
      });
      newReadOnlyRows = state.modelSolution.readOnlyModelSolutionLines.map((row) => {
        if (row >= startLine + solutionLengthDifference) {
          if (row - solutionLengthDifference >= 0) {
            return row - solutionLengthDifference;
          }
          return 0;
        }
        return row;
      });
    } else if (solutionLengthDifferenceToNew >= 0) {
        // text was added
        // text contains the added text
      let solutionLengthDifference = change.text.length ? change.text.length - 1 : 0;
      if (change.removed && change.removed.length === 2) {
        solutionLengthDifference--;
      }
      newSolutionRows = state.modelSolution.solutionRows.get().map((row) => {
        if (row > startLine || (row === startLine && change.from.sticky === null)) {
          return row + solutionLengthDifference;
        }
        return row;
      });
      newReadOnlyRows = state.modelSolution.readOnlyModelSolutionLines.map((row) => {
        if (row >= startLine) {
          return row + solutionLengthDifference;
        }
        return row;
      });
    }
    return {
      ...state,
      modelSolution: {
        ...state.modelSolution,
        editableModelSolution: new FormValue(action.modelSolution),
        solutionRows: new FormValue(newSolutionRows),
        readOnlyModelSolutionLines: newReadOnlyRows,
        markers,
      },
    };
  },
  [CHANGE_ASSIGNMENT](state: State, action: AssignmentChangeAction): State {
    return {
      ...state,
      assignment: new FormValue(action.assignment),
    };
  },
  [CHANGE_TEST_INPUT](state: State, action: TestInputChangeAction): State {
    const newInputOutput = state.inputOutput
      .map((io, i) => {
        if (i === action.index) {
          const newInput = io.input.get().map((line) => {
            if (line.id === action.lineNumber) {
              return { content: action.testInput, id: action.lineNumber };
            }
            return line;
          });


          return new IO(new FormValue(newInput), new FormValue(io.output.get()), io.type, io.hash());
        }
        return io;
      });

    return {
      ...state,
      inputOutput: newInputOutput,
    };
  },
  [CHANGE_TEST_OUTPUT](state: State, action: TestOutputChangeAction): State {
    const newInputOutput = state.inputOutput
      .map((io, i) => {
        if (i === action.index) {
          return new IO(new FormValue(io.input.get()), new FormValue(action.testOutput), io.type, io.hash());
        }
        return io;
      });
    return {
      ...state,
      inputOutput: newInputOutput,
    };
  },
  [CHANGE_UNIT_TESTS](state: State, action: ChangeUnitTestsAction): State {
    // controls the movement of marked unit test code rows when unit test code is changed
    const unitTests = state.unitTests.editableUnitTests;
    if (unitTests === undefined || unitTests === null) {
      return state;
    }
    // prevent the removal of the last editable line
    const change = action.change;
    const startLine = change.from.line;
    let newReadOnlyRows = state.unitTests.readOnlyLines;
    const rowsInOldUnitTests = unitTests.get().split('\n');
    const rowsInNewUnitTests = action.unitTests.split('\n');
    const lengthDifferenceToNew = rowsInNewUnitTests.length - rowsInOldUnitTests.length;

    const markers = handleMarkers(state.unitTests.markers, change);

    if (lengthDifferenceToNew < 0) {
      // text was removed
      const lengthDifference = change.removed.length - change.text.length;
      newReadOnlyRows = state.unitTests.readOnlyLines.map((row) => {
        if (row >= startLine + lengthDifference) {
          if (row - lengthDifference >= 0) {
            return row - lengthDifference;
          }
          return 0;
        }
        return row;
      });
    } else if (lengthDifferenceToNew >= 0) {
      // text was added
      let lengthDifference = change.text.length ? change.text.length - 1 : 0;
      if (change.removed && change.removed.length === 2) {
        lengthDifference--;
      }
      newReadOnlyRows = state.unitTests.readOnlyLines.map((row) => {
        if (row >= startLine) {
          return row + lengthDifference;
        }
        return row;
      });
    }
    return {
      ...state,
      unitTests: {
        ...state.unitTests,
        editableUnitTests: new FormValue(action.unitTests),
        readOnlyLines: newReadOnlyRows,
        markers,
      },
    };
  },
  [ADD_HIDDEN_ROW](state: State, action: AddHiddenRowAction): State {
    if (state.modelSolution.readOnlyModelSolutionLines.includes(action.row)) {
      return state;
    }
    return {
      ...state,
      modelSolution: {
        ...state.modelSolution,
        solutionRows: new FormValue([...state.modelSolution.solutionRows.get(), action.row]),
      },
    };
  },
  [DELETE_HIDDEN_ROW](state: State, action: DeleteHiddenRowAction): State {
    const i = state.modelSolution.solutionRows.get().findIndex(x => x === action.row);
    return {
      ...state,
      modelSolution: {
        ...state.modelSolution,
        solutionRows: new FormValue(
          [...state.modelSolution.solutionRows.get().slice(0, i),
            ...state.modelSolution.solutionRows.get().slice(i + 1)],
        ),
      },
    };
  },
  [CHANGE_FORM_ERRORS_VISIBILITY](state: State): State {
    return {
      ...state,
      showErrors: !state.showErrors,
    };
  },
  [ADD_TAG](state: State, action: AddTagAction): State {
    const newTag = action.tag.trim().toLowerCase();
    if (newTag === '' || state.tags.get().includes(newTag)) {
      return state;
    }
    return {
      ...state,
      tags: new FormValue([...state.tags.get(), newTag]),
    };
  },
  [REMOVE_TAG](state: State, action: RemoveTagAction): State {
    return {
      ...state,
      tags: new FormValue([...state.tags.get().slice(0, action.tagIndex), ...state.tags.get().slice(action.tagIndex + 1)]),
    };
  },
  [NEW_EXERCISE_RECEIVED](state: State, action: NewExerciseReceivedAction): State {
    let testArray;
    if (action.newState.tests) {
      testArray = action.newState.tests.map((test) => {
        const name = new FormValue(test.test_name);
        return {
          name,
          type: test.assertion_type,
          code: test.test_code,
        };
      });
    }

    const inputOutput = action.newState.inputOutput.map((io, index) => {
      const newIo = new IO(
        new FormValue(io.input.get()),
        new FormValue(io.output.get()),
        action.newState.tests.length > 0 ? action.newState.tests[index].assertion_type : 'contains');
      return newIo;
    });

    let editableUnitTests;
    if (action.newState.testingType === 'unit_tests' || action.newState.testingType === 'whole_test_code_for_set_up_code') {
      editableUnitTests = new FormValue(action.newState.tests[0].test_code);
    }

    return {
      ...state,
      valid: false,
      assignment: new FormValue(Raw.deserialize(action.newState.assignment, { terse: true })),
      showErrors: false,
      inputOutput,
      tags: new FormValue([]),
      tagSuggestions: action.newState.tagSuggestions,
      modelSolution: {
        ...state.modelSolution,
        readOnlyModelSolution: action.newState.readOnlyModelSolution,
        readOnlyCodeTemplate: action.newState.readOnlyCodeTemplate,
      },
      unitTests: {
        ...state.unitTests,
        editableUnitTests,
        testArray,
      },
      testingType: action.newState.testingType,
    };
  },
  [ASSIGNMENT_INFO_RECEIVED](state: State, action: AssignmentInfoReceivedAction): State {
    let unitTests = { ...state.unitTests };
    if (action.testTemplate) {
      const testTemplate = getCleanPlate(action.testTemplate);
      unitTests = {
        ...state.unitTests,
        editableUnitTests: new FormValue(testTemplate),
        readOnlyLines: action.readOnlyUnitTestsLines,
        boilerplate: {
          code: testTemplate,
          readOnlyLines: action.readOnlyUnitTestsLines,
        },
        testArray: action.testArray,
      };
    }

    const plate = getCleanPlate(action.boilerplate);

    return {
      ...state,
      tagSuggestions: action.tagSuggestions,
      modelSolution: {
        ...state.modelSolution,
        editableModelSolution: new FormValue(plate),
        readOnlyModelSolutionLines: action.readOnlyModelSolutionLines,
        solutionRows: new FormValue([]),
        boilerplate: { code: plate, readOnlyLines: action.readOnlyModelSolutionLines },
      },
      unitTests,
      testingType: action.testingType,
    };
  },
  [RESET_TO_BOILERPLATE](state: State, action: ResetCodeToBoilerplateAction): State {
    const plate = getCleanPlate(action.boilerplate);
    const readOnlyLines = getReadOnlyLines(action.boilerplate);
    return {
      ...state,
      modelSolution: {
        ...state.modelSolution,
        editableModelSolution: new FormValue(plate),
        readOnlyModelSolutionLines: readOnlyLines,
        solutionRows: new FormValue([], state.modelSolution.solutionRows.errors),
        boilerplate: { code: plate, readOnlyLines },
      },
    };
  },
  [SET_SHOW_CODE_TEMPLATE](state: State, action: SetShowCodeTemplateAction): State {
    return {
      ...state,
      modelSolution: {
        ...state.modelSolution,
        showTemplate: action.show,
      },
    };
  },
  [FORM_DONE](state: State): State {
    return {
      ...state,
      done: true,
    };
  },
  [TEST_TYPE_CHANGED](state: State, action: TestTypeChangedAction): State {
    const inputOutput = state.inputOutput.map((io, i) => {
      if (i === action.index) {
        return new IO(io.input, io.output, action.newType, io.hash());
      }
      return io;
    });
    return {
      ...state,
      inputOutput,
    };
  },
  [ADD_MARKERS](state: State, action: AddMarkersAction): State {
    if (action.markers.some(m => m.inSourceCode)) {
      return {
        ...state,
        modelSolution: {
          ...state.modelSolution,
          markers: action.markers.map(m => (
            {
              line: m.line,
              char: m.char,
            }
          )),
        },
      };
    }
    return {
      ...state,
      unitTests: {
        ...state.unitTests,
        markers: action.markers.map(m => (
          {
            line: m.line,
            char: m.char,
          }
        )),
      },
    };
  },
  [DELETE_MARKERS](state: State): State {
    return {
      ...state,
      unitTests: {
        ...state.unitTests,
        markers: [],
      },
      modelSolution: {
        ...state.modelSolution,
        markers: [],
      },
    };
  },

  [CHANGE_TEST_IN_TEST_ARRAY](state: State, action: ChangeTestInTestArrayAction): State {
    let tests = [];

    for (let i = 0; i < state.unitTests.testArray.length; i++) {
      const test = state.unitTests.testArray[i];

      if (i === action.index) {
        const newInput = state.inputOutput[i].input.get();
        const newOutput = state.inputOutput[i].output.get();

        const modifiedTest = {
          ...test,
          input: newInput,
          output: newOutput,
        };

        tests = [...tests, modifiedTest];
      } else {
        tests = [...tests, test];
      }
    }

    return {
      ...state,
      unitTests: {
        ...state.unitTests,
        testArray: tests,
      },
    };
  },

  [CHANGE_TEST_NAME](state: State, action: ChangeTestNameAction): State {
    let tests = [];

    for (let i = 0; i < state.unitTests.testArray.length; i++) {
      const test = state.unitTests.testArray[i];

      if (i === action.index) {
        const modifiedTest = {
          ...test,
          name: new FormValue(action.name),
        };

        tests = [...tests, modifiedTest];
      } else {
        tests = [...tests, test];
      }
    }


    return {
      ...state,
      unitTests: {
        ...state.unitTests,
        testArray: tests,
      },
    };
  },

  [CHANGE_PREVIEW_STATE](state: State, action: ChangePreviewStateAction): State {
    return {
      ...state,
      previewState: action.state,
    };
  },

  [ADD_TEST_INPUT_LINE](state: State, action: AddTestInputLineAction): State {
    const newInputOutput = state.inputOutput
    .map((io, i) => {
      if (i === action.index) {
        io.input.get().push({ content: '', id: testInputCounter });
        testInputCounter++;

        return new IO(new FormValue(io.input.get()), new FormValue(io.output.get()), io.type, io.hash());
      }
      return io;
    });

    return {
      ...state,
      inputOutput: newInputOutput,
    };
  },

  [REMOVE_TEST_INPUT_LINE](state: State, action: RemoveTestInputLineAction): State {
    const newInputOutput = state.inputOutput.map((io, index) => {
      if (index === action.index) {
        const lines = io.input.get();
        if (lines.length === 1) {
          const newIO = new IO(
            new FormValue([{ content: '', id: testInputCounter }]),
            new FormValue(io.output.get()),
            io.type,
            io.hash());
          testInputCounter++;
          return newIO;
        }

        const newLines = [
          ...lines.slice(0, action.lineNumber),
          ...lines.slice(action.lineNumber + 1),
        ];

        return new IO(new FormValue(newLines), new FormValue(io.output.get()), io.type, io.hash());
      }
      return io;
    });


    return {
      ...state,
      inputOutput: newInputOutput,
    };
  },
});
