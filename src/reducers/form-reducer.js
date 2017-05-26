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
} from 'state/actions';
import type {
  SubmitAction,
    AddTestFieldAction,
    TestInputChangeAction,
    TestOutputChangeAction,
    AssignmentChangeAction,
    ModelSolutionChangeAction,
} from 'state/actions';

export type State = {
  assignment: string,
  modelSolution: string,
  inputOutput: Array<Array<string>>,
}

const initialState = {
  assignment: 'opettele reactia',
  modelSolution: 'git push force',
  inputOutput: [['irene', 'hv irene'], ['henrik', 'moi henrik']],
};

export default createReducer(initialState, {
  [SUBMIT](state: State, action: SubmitAction): State {
    return {
      assignment: action.assignment,
      modelSolution: action.modelSolution,
      inputOutput: action.testIo,
    };
  },
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
});
