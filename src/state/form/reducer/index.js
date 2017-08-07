// @flow
import reduceReducers from 'reduce-reducers';
import IO from 'domain/io';
import { State as sState } from 'slate';
import FormValue from 'domain/form-value';
import changes from './changes';
import validity from './validity';

export type Change = {
  from: {
    ch: number,
    line: number,
  },
  to: {
    ch: number,
    line: number,
  },
  removed: string,
  text: string,
  origin: string,
};

export type TagType = {
  name: string,
};

export type State = {
  assignment: FormValue<sState>,
  modelSolution: ?FormValue<string>,
  inputOutput: Array<IO>,
  solutionRows: Array<number>,
  valid: boolean,
  showErrors: boolean,
  tags: FormValue<Array<string>>,
  tagSuggestions: Array<string>,
  readOnlyModelSolutionLines: Array<number>,
  boilerplate: {code: string, readOnlyLines: number[] },
};

export default reduceReducers(changes, validity);
