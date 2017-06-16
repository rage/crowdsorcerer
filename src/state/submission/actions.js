// @flow

export const POST_EXERCISE = 'POST_EXERCISE';
export const POST_SUCCESSFUL = 'POST_SUCCESSFUL';
export const POST_UNSUCCESSFUL = 'POST_UNSUCCESSFUL';
export const UPDATE_SUBMISSION_STATUS = 'UPDATE_SUBMISSION_STATUS';
export const RESET_SUBMISSION_STATUS = 'RESET_SUBMISSION_STATUS';
export const CONNECTION_TERMINATED_PREMATURELY = 'CONNECTION_TERMINATED_PREMATURELY';

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

export function postUnsuccessfulAction(message: string) {
  return {
    message,
    type: POST_UNSUCCESSFUL,
  };
}

export function updateSubmissionStatusAction(data: Object) {
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
