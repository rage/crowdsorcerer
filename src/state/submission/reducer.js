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
  AUTHENTICATION_ERROR,
  FINISH,
  SET_EXERCISE_ID,
  STATUS_ERROR,
  STATUS_NONE,
  STATUS_IN_PROGRESS,
  STATUS_FINISHED,
  EXERCISE_NOT_FOUND,
  ASSIGNMENT_NOT_FOUND,
} from './actions';
import type {
    UpdateSubmissionStatusAction,
    SetExerciseAction,
} from './actions';
import type { ErrorMessage } from './index';

export type ErrorResult = {
  OK: boolean, errors: Array<ErrorMessage>,
};

export type State = {
  exerciseId: number,
  status: string,
  message: string,
  progress: number,
  result: ErrorResult,
};

const CONNECTION_POST_SENDING_MSG = 'Sending submission';
const CONNECTION_POST_SUCCESSFUL_MSG = 'Submission sent';
const CONNECTION_POST_UNSUCCESSFUL_MSG = 'Could not send the submission. Please try again later.';
const CONNECTION_TERMINATED_MSG = 'Connection error';
const INTERNAL_ERROR_MSG = 'An internal error occured.';
const AUTHENTICATION_ERROR_MSG = 'Your TMC account is not valid, please log in again.';
const EXERCISE_NOT_FOUND_MSG = 'No reviewable exercises found.';
const ASSIGNMENT_NOT_FOUND_MSG = 'Assignment not found.';

const initialState = {
  status: STATUS_NONE,
  message: '',
  progress: undefined,
  result: { OK: false, errors: [] },
  exerciseId: undefined,
};

export default createReducer(initialState, {
  [POST_EXERCISE](state: State): State {
    return {
      ...state,
      progress: 0,
      message: CONNECTION_POST_SENDING_MSG,
      status: STATUS_IN_PROGRESS,
    };
  },
  [POST_SUCCESSFUL](state: State): State {
    return {
      ...state,
      message: CONNECTION_POST_SUCCESSFUL_MSG,
      status: STATUS_IN_PROGRESS,
    };
  },
  [POST_UNSUCCESSFUL](state: State): State {
    return {
      ...state,
      message: CONNECTION_POST_UNSUCCESSFUL_MSG,
      status: STATUS_ERROR,
    };
  },
  [AUTHENTICATION_ERROR](state: State): State {
    return {
      ...state,
      message: AUTHENTICATION_ERROR_MSG,
      status: STATUS_ERROR,
    };
  },
  [UPDATE_SUBMISSION_STATUS](state: State, action: UpdateSubmissionStatusAction): State {
    let errors = [];
    if (action.data.result.errors) {
      errors = action.data.result.errors.map((obj) => {
        const header = obj.header;
        const messages = obj.messages;

        let i;
        for (i = 0; i < messages.length; i++) {
          messages[i].message = messages[i].message.replace(/<linechange>/g, '\n');
        }

        return {
          header,
          messages,
        };
      });
    }
    return {
      ...state,
      message: action.data.message,
      progress: action.data.progress,
      status: action.data.status,
      result: {
        OK: action.data.result.OK,
        errors,
      },
    };
  },
  [FINISH](state: State): State {
    return {
      ...state,
      result: { OK: true, errors: [] },
      status: STATUS_FINISHED,
    };
  },
  [RESET_SUBMISSION_STATUS](state: State): State {
    return {
      ...state,
      message: '',
      progress: undefined,
      status: STATUS_NONE,
      result: { OK: false, errors: [] },
    };
  },
  [CONNECTION_TERMINATED_PREMATURELY](state: State): State {
    return {
      ...state,
      message: CONNECTION_TERMINATED_MSG,
      status: STATUS_ERROR,
    };
  },
  [INVALID_DATA_ERROR](state: State): State {
    return {
      ...state,
      message: INTERNAL_ERROR_MSG,
      status: STATUS_ERROR,
    };
  },
  [SET_EXERCISE_ID](state: State, action: SetExerciseAction): State {
    return {
      ...state,
      exerciseId: action.exerciseId,
    };
  },
  [EXERCISE_NOT_FOUND](state: State): State {
    return {
      ...state,
      status: STATUS_ERROR,
      message: EXERCISE_NOT_FOUND_MSG,
    };
  },
  [ASSIGNMENT_NOT_FOUND](state: State): State {
    return {
      ...state,
      status: STATUS_ERROR,
      message: ASSIGNMENT_NOT_FOUND_MSG,
    };
  },
});
