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
  inputOutput: Array<IO>,
  valid: boolean,
  showErrors: boolean,
  tags: FormValue<Array<string>>,
  tagSuggestions: Array<string>,
  modelSolution: {
    solutionRows: Array<number>,
    editableModelSolution: ?FormValue<string>,
    readOnlyModelSolutionLines: Array<number>,
    readOnlyModelSolution: ?string,
    readOnlyCodeTemplate: ?string,
    showTemplate: boolean,
    boilerplate: {
      code: string,
      readOnlyLines: number[]
    },
  }
};

export default reduceReducers(changes, validity);
