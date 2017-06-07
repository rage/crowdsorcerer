// @flow

import Api from 'utils/api';

import { combineReducers } from 'redux';

import form from './form';
import type { State as FormState } from './form';

/* eslint-disable no-use-before-define */
export type ThunkAction = (dispatch: Dispatch, getState: GetState, arguments: ThunkArguments) => any;
/* eslint-enable no-use-before-define */
export type Action = { type: string, payload?: any } | ThunkAction | Promise<any>;

export type State = {
  form: FormState,
}
export type Dispatch = (action: Action) => any;

export type ThunkArguments = {
  api: Api,
};

export type GetState = () => State;

export default combineReducers({
  form,
});
