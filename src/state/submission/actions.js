// @flow
import Api from 'utils/api/index';
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import { formDoneAction } from 'state/form/actions';
import type { ErrorMessage } from './index';

export const STATUS_FINISHED = 'finished';
export const STATUS_ERROR = 'error';
export const STATUS_IN_PROGRESS = 'in progress';
export const STATUS_NONE = '';

export const POST_EXERCISE = 'POST_EXERCISE';
export const POST_SUCCESSFUL = 'POST_SUCCESSFUL';
export const POST_UNSUCCESSFUL = 'POST_UNSUCCESSFUL';
export const UPDATE_SUBMISSION_STATUS = 'UPDATE_SUBMISSION_STATUS';
export const RESET_SUBMISSION_STATUS = 'RESET_SUBMISSION_STATUS';
export const CONNECTION_TERMINATED_PREMATURELY = 'CONNECTION_TERMINATED_PREMATURELY';
export const INVALID_DATA_ERROR = 'INVALID_DATA_ERROR';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const FINISH = 'FINISH';
export const SET_EXERCISE_ID = 'SET_EXERCISE_ID';
export const EXERCISE_NOT_FOUND = 'EXERCISE_NOT_FOUND';
export const ASSIGNMENT_NOT_FOUND = 'ASSIGNMENT_NOT_FOUND';

export function startSendAction() {
  return {
    type: POST_EXERCISE,
  };
}

export function postSuccessfulAction() {
  return {
    type: POST_SUCCESSFUL,
  };
}

export function postUnsuccessfulAction() {
  return {
    type: POST_UNSUCCESSFUL,
  };
}

export function setExerciseAction(exerciseId: number) {
  return {
    exerciseId,
    type: SET_EXERCISE_ID,
  };
}

export function finishAction() {
  return {
    type: FINISH,
  };
}

export function authenticationError() {
  return {
    type: AUTHENTICATION_ERROR,
  };
}

export function updateSubmissionStatusAction(data: Object, api: Api) {
  if (data.status === STATUS_FINISHED) {
    api.deleteSubscription();
  }
  return {
    data,
    type: UPDATE_SUBMISSION_STATUS,
  };
}

export function resetSubmissionStatusAction() {
  return {
    type: RESET_SUBMISSION_STATUS,
  };
}

export function connectionTerminatedPrematurelyAction() {
  return {
    type: CONNECTION_TERMINATED_PREMATURELY,
  };
}

export function invalidDataErrorAction() {
  return {
    type: INVALID_DATA_ERROR,
  };
}

export function exerciseNotFoundAction() {
  return {
    type: EXERCISE_NOT_FOUND,
  };
}

export function assignmentNotFoundAction() {
  return {
    type: ASSIGNMENT_NOT_FOUND,
  };
}

export type ResultData = {
  status: string,
  message: string,
  progress: number,
  result: {
    OK: boolean,
    errors: Array<ErrorMessage>,
  },
};

export function openWebSocketConnectionAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    api.createSubscription((data: ResultData) => {
      dispatch(updateSubmissionStatusAction(data, api));
      if (data.status === STATUS_FINISHED && data.result.OK) {
        if (getState().reviewable === undefined) {
          dispatch(formDoneAction());
        }
      }
    }, () => {
      if (getState().submission.status !== STATUS_FINISHED) {
        dispatch(connectionTerminatedPrematurelyAction());
      }
    }, () => {
      dispatch(invalidDataErrorAction());
    }, getState().submission.exerciseId);
  };
}

export type StartSendAction = {
  type: string
};

export type PostSuccessfulAction = {
  type: string
};

export type PostUnsuccessfulAction = {
  message: string,
  type: string
};

export type UpdateSubmissionStatusAction = {
  data: ResultData,
  type: string
};

export type ResetSubmissionStatusAction = {
  type: string
};

export type ConnectionTerminatedPrematurelyAction = {
  type: string
};

export type InvalidDataErrorAction = {
  type: string
};

export type AuthenticationErrorAction = {
  type: string
};

export type FinishAction = {
  type: string
};

export type SetExerciseAction = {
  exerciseId: number,
  type: string,
};
