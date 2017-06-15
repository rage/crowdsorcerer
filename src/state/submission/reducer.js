// @flow
import { createReducer } from 'redux-create-reducer';
import {
  POST_EXERCISE,
  POST_SUCCESSFUL,
  POST_UNSUCCESSFUL,
  UPDATE_SUBMISSION_STATUS,
} from 'state/submission';
import type {
    StartSendAction,
    PostSuccessfulAction,
    PostUnsuccessfulAction,
    UpdateSubmissionStatusAction,
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
      },
    };
  },
});
