// @flow
import { createReducer } from 'redux-create-reducer';
import { SUBMIT, ADD_TEST_IO } from 'state/actions';
import type { SubmitAction, AddTestIOAction } from 'state/actions';
import prefixer from 'utils/class-name-prefixer';

export type State = {
  assignment: string,
  modelSolution: string,
  inputOutput: [],
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
  [ADD_TEST_IO](state: State, action: AddTestIOAction): State {
    return {
      ...state,
      ...{
        inputOutput: IO,
      },
    };
  },
});
