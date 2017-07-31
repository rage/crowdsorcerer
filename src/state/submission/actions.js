// @flow
import Api from 'utils/api/index';

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
  if (data.status === 'finished') {
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
  data: Object,
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

export type Finish = {
  type: string
};

export type SetExerciseAction = {
  exerciseId: number,
  type: string,
};
