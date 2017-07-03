// @flow
import type { Dispatch } from 'state/reducer';

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
  return function tracker(dispatch: Dispatch) {
    window.addEventListener('storage', (event: Event) => {
      if (event.key !== 'tmc.user') {
        return;
      }
      // $FlowFixMe
      const loggedIn = event.newValue !== undefined;
      dispatch(loginStateChangedAction(loggedIn));
    });
  };
}


export type TrackLoginStateAction = {
  (dispatch: Dispatch): void,
}
