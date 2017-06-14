// @flow

export const START_SEND = 'START_SEND';
export const SEND_SUCCESSFUL = 'SEND_SUCCESSFUL';
export const SEND_FAIL = 'SEND_FAIL';
export const SEND_RECEIVED = 'RECEIVED';

export function startSendAction() {
  return {
    type: START_SEND,
  };
}

export function sendSuccessfulAction() {
  return {
    type: SEND_SUCCESSFUL,
  };
}

export function sendFailAction() {
  return {
    type: SEND_FAIL,
  };
}

export function sendReceivedAction() {
  return {
    type: SEND_RECEIVED,
  };
}
