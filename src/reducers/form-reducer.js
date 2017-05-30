// @flow
import { createReducer } from 'redux-create-reducer';
import prefixer from 'utils/class-name-prefixer';
import {
  SUBMIT,
  ADD_TEST_FIELD,
  CHANGE_ASSIGNMENT,
  CHANGE_MODEL_SOLUTION,
  CHANGE_TEST_INPUT,
  CHANGE_TEST_OUTPUT,
  ADD_HIDDEN_ROW,
  DELETE_HIDDEN_ROW,
} from 'state/actions';
import type {
    SubmitAction,
    AddTestFieldAction,
    TestInputChangeAction,
    TestOutputChangeAction,
    AssignmentChangeAction,
    ModelSolutionChangeAction,
    AddHiddenRowAction,
    DeleteHiddenRowAction,
} from 'state/actions';

export type State = {
  assignment: string,
  modelSolution: string,
  inputOutput: Array<Array<string>>,
  solutionRows: Array<number>,
}

const initialState = {
  assignment: '',
  modelSolution: '',
  inputOutput: [['', ''], ['', '']],
  solutionRows: [],
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
  [CHANGE_MODEL_SOLUTION](state: State, action: ModelSolutionChangeAction): State {
    return {
      ...state,
      ...{
        modelSolution: action.modelSolution,
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
        return [action.testInput, io[1]];
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
        return [io[0], action.testOutput];
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
});
