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
  SET_FORM_STATE,
  SET_TAG_SUGGESTIONS,
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
    SetFormStateAction,
    SetTagSuggestions,
} from 'state/form/actions';
import { Raw } from 'slate';

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
            text: 'asdf asdf asdf sdf dfas sdf asdf',
          },
        ],
      },
    ],
  }, { terse: true })),
  modelSolution: new FormValue('System.out.println("moi"); \n return "Hello " + input;'),
  inputOutput: [new IO(new FormValue('meikä'), new FormValue('Hello meikä'))],
  solutionRows: [],
  valid: false,
  showErrors: false,
  tagSuggestions: ['for-each', 'while', 'for-loop', 'java', 'javascript'],
  tags: new FormValue(['oon tägi']),
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
    const previousSolution = state.modelSolution.get().split('\n');
    const newSolution = action.modelSolution.split('\n');
    let newSolutionRows = state.solutionRows;
    let newSolutionDifferenceToPrevious = newSolution.length - previousSolution.length;
    if (state.solutionRows.length > 0) {
      if (newSolutionDifferenceToPrevious < 0) {
        newSolutionDifferenceToPrevious = Math.abs(newSolutionDifferenceToPrevious);
        let i = 0;
        for (; i < newSolution.length; i++) {
          if (newSolution[i].localeCompare(previousSolution[i]) !== 0) {
            break;
          }
        }
        const removedSolutionRows = [];
        const endRow = i + newSolutionDifferenceToPrevious;
        for (; i < endRow; i++) {
          if (state.solutionRows.includes(i)) {
            removedSolutionRows.push(i);
          }
        }
        newSolutionRows = state.solutionRows.filter(row => (
          !removedSolutionRows.includes(row)
        ));
        newSolutionRows = newSolutionRows.map((row) => {
          if (row >= i) {
            if (row - newSolutionDifferenceToPrevious >= 0) {
              return row - newSolutionDifferenceToPrevious;
            }
            return 0;
          }
          return row;
        });
      } else if (newSolutionDifferenceToPrevious > 0) {
        let i = 0;
        for (; i < previousSolution.length; i++) {
          if (previousSolution[i].localeCompare(newSolution[i]) !== 0) {
            break;
          }
        }
        newSolutionRows = newSolutionRows.map((row) => {
          if (row >= i) {
            return row + newSolutionDifferenceToPrevious;
          }
          return row;
        });
      }
    }
    return {
      ...state,
      ...{
        modelSolution: new FormValue(action.modelSolution),
        solutionRows: newSolutionRows,
      },
    };
  },
  [CHANGE_ASSIGNMENT](state: State, action: AssignmentChangeAction): State {
    return {
      ...state,
      ...{
        assignment: new FormValue(action.assignment),
      },
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
      ...{
        inputOutput: newInputOutput,
      },
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
      ...{
        inputOutput: newInputOutput,
      },
    };
  },
  [ADD_HIDDEN_ROW](state: State, action: AddHiddenRowAction): State {
    return {
      ...state,
      ...{
        solutionRows: [...state.solutionRows, action.row],
      },
    };
  },
  [DELETE_HIDDEN_ROW](state: State, action: DeleteHiddenRowAction): State {
    const i = state.solutionRows.findIndex(x => x === action.row);
    return {
      ...state,
      ...{
        solutionRows: [...state.solutionRows.slice(0, i), ...state.solutionRows.slice(i + 1)],
      },
    };
  },
  [CHANGE_FORM_ERRORS_VISIBILITY](state: State): State {
    return {
      ...state,
      ...{
        showErrors: !state.showErrors,
      },
    };
  },
  [ADD_TAG](state: State, action: AddTagAction): State {
    const newTag = action.tag.trim().toLowerCase();
    if (newTag === '' || state.tags.get().includes(newTag)) {
      return state;
    }
    return {
      ...state,
      ...{
        tags: new FormValue([...state.tags.get(), newTag]),
      },
    };
  },
  [REMOVE_TAG](state: State, action: RemoveTagAction): State {
    return {
      ...state,
      ...{
        tags: new FormValue([...state.tags.get().slice(0, action.tagIndex), ...state.tags.get().slice(action.tagIndex + 1)]),
      },
    };
  },
  [SET_FORM_STATE](state: State, action: SetFormStateAction): State {
    return {
      ...state,
      ...{
        valid: true,
        assignment: new FormValue(Raw.deserialize(action.newState.assignment, { terse: true })),
        showErrors: false,
        modelSolution: action.newState.modelSolution,
        inputOutput: action.newState.inputOutput,
        tags: new FormValue([]),
      },
    };
  },
  [SET_TAG_SUGGESTIONS](state: State, action: SetTagSuggestions): State {
    return {
      ...state,
      ...{
        tagSuggestions: action.tagSuggestions,
      },
    };
  },
});
