// @flow

import Api from 'utils/api';

import { combineReducers } from 'redux';

import formReducer from 'reducers/form-reducer';
import type { State as FormState } from 'reducers/form-reducer';

/* eslint-disable no-use-before-define */
export type ThunkAction = (dispatch: Dispatch, getState: GetState, arguments: ThunkArguments) => any;
/* eslint-enable no-use-before-define */
export type Action = { type: string, payload?: any } | ThunkAction | Promise<any>;

export type State = {
  formReducer: FormState,
}
export type Dispatch = (action: Action) => any;

export type ThunkArguments = {
  api: Api,
};

export type GetState = () => State;

export default combineReducers({
  formReducer,
});
