// @flow
import reduceReducers from 'reduce-reducers';
import FormValue from 'domain/form-value';
import changes from './changes';
import validity from './validity';

export type Review = {
  question:string,
  review: ?number
}

export type State = {
  reviews: Array<FormValue<Review>>,
  comment: FormValue<string>,
  sendingStatus: string,
  valid: boolean,
  showErrors: boolean,
  reviewable: number,
}

export default reduceReducers(changes, validity);
