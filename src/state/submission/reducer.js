// @flow
import { createReducer } from 'redux-create-reducer';
import {
  POST_EXERCISE,
  POST_SUCCESSFUL,
  POST_UNSUCCESSFUL,
  UPDATE_SUBMISSION_STATUS,
  RESET_SUBMISSION_STATUS,
  CONNECTION_TERMINATED_PREMATURELY,
} from 'state/submission';
import type {
    StartSendAction,
    PostSuccessfulAction,
    PostUnsuccessfulAction,
    UpdateSubmissionStatusAction,
    ResetSubmissionStatusAction,
    ConnectionTerminatedPrematurelyAction,
} from 'state/submission/actions';

export type State = {
  finished: boolean,
  message: string,
  progress: number,
  error: boolean,
}

const POST_EXERCISE_MESSAGE = 'Lähetetään tietoja';
const POST_SUCCESSFUL_MESSAGE = 'Tietojen lähetys onnistui';


const initialState = {
  finished: false,
  message: '',
  progress: undefined,
  error: false,
};

export default createReducer(initialState, {
  [POST_EXERCISE](state: State, action: StartSendAction): State {
    return {
      ...state,
      ...{
        message: POST_EXERCISE_MESSAGE,
      },
    };
  },
  [POST_SUCCESSFUL](state: State, action: PostSuccessfulAction): State {
    return {
      ...state,
      ...{
        message: POST_SUCCESSFUL_MESSAGE,
      },
    };
  },
  [POST_UNSUCCESSFUL](state: State, action: PostUnsuccessfulAction): State {
    return {
      ...state,
      ...{
        message: action.message,
        error: true,
        finished: true,
      },
    };
  },
  [UPDATE_SUBMISSION_STATUS](state: State, action: UpdateSubmissionStatusAction): State {
    return {
      ...state,
      ...{
        message: action.data.message,
        progress: action.data.progress,
        finished: action.data.finished,
        error: action.data.error,
      },
    };
  },
  [RESET_SUBMISSION_STATUS](state: State, action: ResetSubmissionStatusAction): State {
    return {
      message: '',
      progress: 0,
      finished: false,
      error: false,
    };
  },
  [CONNECTION_TERMINATED_PREMATURELY](state: State, action: ConnectionTerminatedPrematurelyAction): State {
    return {
      ...state,
      ...{
        message: 'Connection terminated prematurely :(',
        error: true,
      },
    };
  },
});
