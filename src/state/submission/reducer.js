// @flow
import { createReducer } from 'redux-create-reducer';
import {
  START_SEND,
  SEND_RECEIVED,
  SEND_SUCCESSFUL,
  SEND_FAIL,
} from 'state/submission';
import type {
    startSendAction,
    sendSuccessfulAction,
    sendFailAction,
} from 'state/submission/actions';

export type State = {
  sendingStatus: string,
}

const SEND_STATUS_NONE = 'NONE';
const SEND_STATUS_ONGOING = 'ONGOING';
const SEND_STATUS_RECEIVED = 'RECEIVED';
const SEND_STATUS_SUCCESSFUL = 'SUCCESSFUL';
const SEND_STATUS_FAIL = 'FAIL';

const initialState = {
  sendingStatus: SEND_STATUS_NONE,
};

export default createReducer(initialState, {
  [START_SEND](state: State, action: startSendAction): State {
    return {
      ...state,
      ...{
        sendingStatus: SEND_STATUS_ONGOING,
      },
    };
  },
  [SEND_RECEIVED](state: State, action: startSendAction): State {
    return {
      ...state,
      ...{
        sendingStatus: SEND_STATUS_RECEIVED,
      },
    };
  },
  [SEND_SUCCESSFUL](state: State, action: sendSuccessfulAction): State {
    return {
      ...state,
      ...{
        sendingStatus: SEND_STATUS_SUCCESSFUL,
      },
    };
  },
  [SEND_FAIL](state: State, action: sendFailAction): State {
    return {
      ...state,
      ...{
        sendingStatus: SEND_STATUS_FAIL,
      },
    };
  },
});
