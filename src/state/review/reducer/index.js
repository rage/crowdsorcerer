// @flow
import reduceReducers from 'reduce-reducers';
import changes from './changes';
import validity from './validity';

export type State = {
  reviews: Map<string, number>,
  reviewQuestions: Array<string>,
  comment: string,
  sendingStatus: string,
  valid: boolean,
  errors: Map<string, Array<Object>>,
  showErrors: boolean,
  reviewable: number,
}

export default reduceReducers(changes, validity);
