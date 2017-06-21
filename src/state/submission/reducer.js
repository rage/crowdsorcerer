// @flow
import { createReducer } from 'redux-create-reducer';
import {
  POST_EXERCISE,
  POST_SUCCESSFUL,
  POST_UNSUCCESSFUL,
  UPDATE_SUBMISSION_STATUS,
  RESET_SUBMISSION_STATUS,
  CONNECTION_TERMINATED_PREMATURELY,
  INVALID_DATA_ERROR,
} from 'state/submission';
import type {
    UpdateSubmissionStatusAction,
} from 'state/submission/actions';

export type State = {
  status: string,
  message: string,
  progress: number,
  result: Object,
}

export const STATUS_FINISHED = 'finished';
export const STATUS_ERROR = 'error';
export const STATUS_IN_PROGRESS = 'in progress';
export const STATUS_NONE = '';

const CONNECTION_POST_SENDING_MSG = 'Lähetetään tietoja';
const CONNECTION_POST_SUCCESSFUL_MSG = 'Tietojen lähetys onnistui';
const CONNECTION_POST_UNSUCCESSFUL_MSG = 'Tietojen lähetys ei onnistunut. Yritä hetken päästä uudelleen.';
const CONNECTION_TERMINATED_MSG = 'Yhteysvirhe';
const INTERNAL_ERROR_MSG = 'Tapahtui sisäinen yhteysvirhe.';

const initialState = {
  status: STATUS_NONE,
  message: '',
  progress: undefined,
  result: {},
};

export default createReducer(initialState, {
  [POST_EXERCISE](state: State): State {
    return {
      ...state,
      ...{
        message: CONNECTION_POST_SENDING_MSG,
        status: STATUS_IN_PROGRESS,
      },
    };
  },
  [POST_SUCCESSFUL](state: State): State {
    return {
      ...state,
      ...{
        message: CONNECTION_POST_SUCCESSFUL_MSG,
        status: STATUS_IN_PROGRESS,
      },
    };
  },
  [POST_UNSUCCESSFUL](state: State): State {
    return {
      ...state,
      ...{
        message: CONNECTION_POST_UNSUCCESSFUL_MSG,
        status: STATUS_ERROR,
      },
    };
  },
  [UPDATE_SUBMISSION_STATUS](state: State, action: UpdateSubmissionStatusAction): State {
    return {
      ...state,
      ...{
        message: action.data.message,
        progress: action.data.progress,
        status: action.data.status,
        result: action.data.result,
      },
    };
  },
  [RESET_SUBMISSION_STATUS](): State {
    return {
      message: '',
      progress: 0,
      status: STATUS_NONE,
      result: {},
    };
  },
  [CONNECTION_TERMINATED_PREMATURELY](state: State): State {
    return {
      ...state,
      ...{
        message: CONNECTION_TERMINATED_MSG,
        status: STATUS_ERROR,
      },
    };
  },
  [INVALID_DATA_ERROR](state: State): State {
    return {
      ...state,
      ...{
        message: INTERNAL_ERROR_MSG,
        status: STATUS_ERROR,
      },
    };
  },
});
