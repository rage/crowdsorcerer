// @flow

import * as storejs from 'store';
import { createReducer } from 'redux-create-reducer';
import {
  LOGIN_STATE_CHANGED,
} from 'state/user';
import type {
    LoginStateChangedAction,
} from 'state/user/actions';

export type State = {
  loggedIn: boolean,
}

function loggedIn(): boolean {
  const tmcUser = storejs.get('tmc.user');
  if (tmcUser === undefined || !Object.prototype.hasOwnProperty.call(tmcUser, 'accessToken')) {
    return false;
  }
  return tmcUser.accessToken.length > 0;
}

const initialState = {
  loggedIn: loggedIn(),
};

export default createReducer(initialState, {
  [LOGIN_STATE_CHANGED](state: State, action: LoginStateChangedAction): State {
    return {
      ...state,
      ...{
        loggedIn: action.loggedIn,
      },
    };
  },
});
