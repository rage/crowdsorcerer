// @flow

import Api from 'utils/api/index';

import { combineReducers } from 'redux';

import form from './form';
import submission from './submission';
import assignment from './assignment';
import user from './user';
import review from './review';
import type { State as FormState } from './form';
import type { State as SubmissionState } from './submission';
import type { State as AssignmentState } from './assignment';
import type { State as UserState } from './user';
import type { State as ReviewState } from './review';

/* eslint-disable no-use-before-define */
export type ThunkAction = (dispatch: Dispatch, getState: GetState, arguments: ThunkArguments) => any;
/* eslint-enable no-use-before-define */
export type Action = { type: string, payload?: any } | ThunkAction | Promise<any>;

export type State = {
  form: FormState,
  submission: SubmissionState,
  assignment: AssignmentState,
  user: UserState,
  review: ReviewState,
}
export type Dispatch = (action: Action) => any;

export type ThunkArguments = {
  api: Api,
};

export type GetState = () => State;

export default (assignmentId: string) => combineReducers({
  form,
  submission,
  assignment: assignment(assignmentId),
  user,
  review,
});
