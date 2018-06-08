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
} from 'state/form/actions';
import { Raw } from 'slate';
import { isReadOnlyTag } from 'utils/get-read-only-lines';
import type { State } from './index';


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
  inputOutput: [new IO(new FormValue(''), new FormValue(''))],
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
  },
  done: false,
  exerciseType: '',
};

const supportedTestTypes = ['positive', 'negative'];

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
      ...{
        inputOutput: [...state.inputOutput, action.field],
      },
    };
  },

  [REMOVE_TEST_FIELD](state: State, action: RemoveTestFieldAction): State {
    let inputOutput;
    if (state.inputOutput.length === 1) {
      inputOutput = [new IO()];
    } else {
      inputOutput = [
        ...state.inputOutput.slice(0, action.index),
        ...state.inputOutput.slice(action.index + 1),
      ];
    }
    return {
      ...state,
      ...{
        inputOutput,
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
      newSolutionRows = newSolutionRows.filter(row => row < startLine || row > startLine + deletedRowLength);
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
        if (row >= startLine) {
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
          return new IO(new FormValue(action.testInput), new FormValue(io.output.get()), io.type, io.hash());
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
    return {
      ...state,
      valid: false,
      assignment: new FormValue(Raw.deserialize(action.newState.assignment, { terse: true })),
      showErrors: false,
      inputOutput: action.newState.inputOutput,
      tags: new FormValue([]),
      tagSuggestions: action.newState.tagSuggestions,
      modelSolution: {
        ...state.modelSolution,
        readOnlyModelSolution: action.newState.readOnlyModelSolution,
        readOnlyCodeTemplate: action.newState.readOnlyCodeTemplate,
      },
    };
  },
  [ASSIGNMENT_INFO_RECEIVED](state: State, action: AssignmentInfoReceivedAction): State {
    const cleanPlate = [];
    if (action.boilerplate) {
      action.boilerplate.split('\n').forEach((row) => {
        if (!isReadOnlyTag(row)) {
          cleanPlate.push(row);
        }
      });
    }
    const plate = cleanPlate.join('\n');

    let unitTests = { ...state.unitTests };
    const cleanTestTemplate = [];
    if (action.testTemplate) {
      action.testTemplate.split('\n').forEach((row) => {
        if (!isReadOnlyTag(row)) {
          cleanTestTemplate.push(row);
        }
      });
      const testTemplate = cleanTestTemplate.join('\n');
      unitTests = {
        ...state.unitTests,
        editableUnitTests: new FormValue(testTemplate),
        readOnlyLines: action.readOnlyUnitTestsLines,
        boilerplate: {
          code: testTemplate,
          readOnlyLines: action.readOnlyUnitTestsLines,
        },
      };
    }

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
      exerciseType: action.exerciseType,
    };
  },
  [RESET_TO_BOILERPLATE](state: State): State {
    return {
      ...state,
      modelSolution: {
        ...state.modelSolution,
        editableModelSolution: new FormValue(state.modelSolution.boilerplate.code),
        readOnlyModelSolutionLines: state.modelSolution.boilerplate.readOnlyLines,
        solutionRows: new FormValue([]),
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
        let newType = action.oldType;
        supportedTestTypes.forEach((type, j) => {
          if (type === action.oldType) {
            if (j < supportedTestTypes.length - 1) {
              newType = supportedTestTypes[j + 1];
            } else {
              newType = supportedTestTypes[0];
            }
          }
        });
        return new IO(io.input, io.output, newType, io.hash());
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
});
