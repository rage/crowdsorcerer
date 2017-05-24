// @flow

import Api from 'utils/api';

import { combineReducers } from 'redux';

import writerReducer from 'reducers/writer-reducer';
import type { State as TextState } from 'reducers/writer-reducer';
import { reducer as formReducer } from 'redux-form';

/* eslint-disable no-use-before-define */
export type ThunkAction = (dispatch: Dispatch, getState: GetState, arguments: ThunkArguments) => any;
/* eslint-enable no-use-before-define */
export type Action = { type: string, payload?: any } | ThunkAction | Promise<any>;

export type State = {
  writerReducer: TextState,
}
export type Dispatch = (action: Action) => any;

export type ThunkArguments = {
  api: Api,
};

export type GetState = () => State;

export default combineReducers({
  writerReducer,
  formReducer,
});
