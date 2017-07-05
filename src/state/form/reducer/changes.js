// @flow
import { createReducer } from 'redux-create-reducer';
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
  CHANGE_ERRORS_VISIBILITY,
} from 'state/form';
import type {
    AddTestFieldAction,
    RemoveTestFieldAction,
    TestInputChangeAction,
    TestOutputChangeAction,
    AssignmentChangeAction,
    ModelSolutionChangeAction,
    AddHiddenRowAction,
    DeleteHiddenRowAction,
} from 'state/form';
import { Raw } from 'slate';

import type { State } from './index';

const initialState = {
  assignment: Raw.deserialize({
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'Tämä on tarpeeksi pitkä tehtävänanto',
          },
        ],
      },
    ],
  }, { terse: true }),
  modelSolution: 'System.out.println("moi"); \n return "Hello " + input;',
  inputOutput: [new IO('testi', 'Hello asdf'), new IO('asdfasdf', 'Hello asdfasdfasdfdf')],
  solutionRows: [],
  valid: false,
  errors: new Map(),
  showErrors: false,
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
    const previousSolution = state.modelSolution.split('\n');
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
        modelSolution: action.modelSolution,
        solutionRows: newSolutionRows,
      },
    };
  },
  [CHANGE_ASSIGNMENT](state: State, action: AssignmentChangeAction): State {
    return {
      ...state,
      ...{
        assignment: action.assignment,
      },
    };
  },
  [CHANGE_TEST_INPUT](state: State, action: TestInputChangeAction): State {
    const newInputOutput = state.inputOutput.map((io, i) => {
      if (i === action.index) {
        return io.changeInput(action.testInput);
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
    const newInputOutput = state.inputOutput.map((io, i) => {
      if (i === action.index) {
        return io.changeOutput(action.testOutput);
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
  [CHANGE_ERRORS_VISIBILITY](state: State): State {
    return {
      ...state,
      ...{
        showErrors: !state.showErrors,
      },
    };
  },
});
