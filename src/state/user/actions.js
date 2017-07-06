// @flow
import type { Dispatch, GetState } from 'state/reducer';
import getLoggedIn from 'utils/logged-in';

export const LOGIN_STATE_CHANGED = 'LOGIN_STATE_CHANGED';

export function loginStateChangedAction(loggedIn: boolean) {
  return {
    loggedIn,
    type: LOGIN_STATE_CHANGED,
  };
}

export type LoginStateChangedAction = {
  loggedIn: boolean,
  type: string,
};

export function trackLoginStateAction() {
  return function tracker(dispatch: Dispatch, getState: GetState) {
    setInterval(() => {
      const state = getState();
      const loggedIn = getLoggedIn();
      const stateLoggedIn = state.user.loggedIn;
      if (loggedIn !== stateLoggedIn) {
        dispatch(loginStateChangedAction(loggedIn));
      }
    }, 500);
  };
}

export type TrackLoginStateAction = {
  (): Function,
}

