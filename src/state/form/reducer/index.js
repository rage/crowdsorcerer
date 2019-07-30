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

export type Tag = {
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
    solutionRows: FormValue<Array<number>>,
    editableModelSolution: ?FormValue<string>,
    readOnlyModelSolutionLines: Array<number>,
    readOnlyModelSolution: ?string,
    readOnlyCodeTemplate: ?string,
    showTemplate: boolean,
    boilerplate: {
      code: string,
      readOnlyLines: number[]
    },
    markers: Array<Object>,
  },
  unitTests: {
    editableUnitTests: ?FormValue<string>,
    boilerplate: {
      code: string,
      readOnlyLines: number[],
    },
    readOnlyLines: number[],
    markers: Array<Object>,
    testArray: Array<Object>,
  },
  done: boolean,
  testingType: string,
  // testingType can be one of these: input_output, student_written_tests, io_and_code,
  // tests_for_set_up_code, whole_test_code_for_set_up_code, input_output_tests_for_set_up_code
  previewState: boolean,
  language: string
};

export default reduceReducers(changes, validity);
