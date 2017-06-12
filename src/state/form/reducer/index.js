import reduceReducers from 'reduce-reducers';
import IO from 'domain/io';
import { EditorState } from 'draft-js';
import changes from './changes';
import validity from './validity';

export type State = {
  assignment: EditorState,
  modelSolution: string,
  inputOutput: Array<IO>,
  solutionRows: Array<number>,
  valid: boolean,
  errors: Map<string, Array<Object>>,
}

export default reduceReducers(changes, validity);
