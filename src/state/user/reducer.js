// @flow
import { createReducer } from 'redux-create-reducer';
import {
  LOGIN_STATE_CHANGED,
} from 'state/user';
import type {
    LoginStateChangedAction,
} from 'state/user/actions';
import loggedIn from 'utils/logged-in';

export type State = {
  loggedIn: boolean,
}

const initialState = {
  loggedIn: loggedIn(),
};

export default createReducer(initialState, {
  [LOGIN_STATE_CHANGED](state: State, action: LoginStateChangedAction): State {
    return {
      ...state,
      loggedIn: action.loggedIn,
    };
  },
});
