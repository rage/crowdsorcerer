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
  },
  done: false,
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
          return new IO(new FormValue(action.testInput), new FormValue(io.output.get()), io.hash());
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
          return new IO(new FormValue(io.input.get()), new FormValue(action.testOutput), io.hash());
        }
        return io;
      });
    return {
      ...state,
      inputOutput: newInputOutput,
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
    return {
      ...state,
      tagSuggestions: action.tagSuggestions,
      modelSolution: {
        ...state.modelSolution,
        editableModelSolution: new FormValue(plate),
        readOnlyModelSolutionLines: action.readOnlyLines,
        solutionRows: new FormValue([]),
        boilerplate: { code: plate, readOnlyLines: action.readOnlyLines },
      },
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
});
