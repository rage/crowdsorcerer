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
  reviews: ?FormValue<Array<Review>>,
  comment: FormValue<string>,
  valid: boolean,
  showErrors: boolean,
  reviewable: ?number,
  done: boolean,
}

export default reduceReducers(changes, validity);
