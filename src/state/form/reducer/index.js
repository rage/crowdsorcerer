import reduceReducers from 'reduce-reducers';
import IO from 'domain/io';
import changes from './changes';
import validity from './validity';

export type State = {
  assignment: string,
  modelSolution: string,
  inputOutput: Array<IO>,
  solutionRows: Array<number>,
  valid: boolean,
}

export default reduceReducers(changes, validity);
