import reduceReducers from 'reduce-reducers';
import IO from 'domain/io';
import { State as sState } from 'slate';
import changes from './changes';
import validity from './validity';

export type State = {
  assignment: sState,
  modelSolution: string,
  inputOutput: Array<IO>,
  solutionRows: Array<number>,
  valid: boolean,
  errors: Map<string, Array<Object>>,
  showErrors: boolean,
}

export default reduceReducers(changes, validity);
