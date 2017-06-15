// @flow
import reduceReducers from 'reduce-reducers';
import IO from 'domain/io';
import { State as sState } from 'slate';
import FormValue from 'domain/form-value';
import changes from './changes';
import validity from './validity';

export type TagType = {
  name: string,
};

export type State = {
  assignment: FormValue<sState>,
  modelSolution: FormValue<string>,
  inputOutput: Array<FormValue<IO>>,
  solutionRows: Array<number>,
  valid: boolean,
  showErrors: boolean,
  tags: Array<string>,
  tagSuggestions: Array<string>,
};

export default reduceReducers(changes, validity);
