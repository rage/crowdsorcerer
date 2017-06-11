// @flow
import { Plain } from 'slate';
import {
  ADD_TEST_FIELD,
  REMOVE_TEST_FIELD,
  CHANGE_ASSIGNMENT,
  CHANGE_MODEL_SOLUTION,
  CHANGE_TEST_INPUT,
  CHANGE_TEST_OUTPUT,
  ADD_HIDDEN_ROW,
  DELETE_HIDDEN_ROW,
} from 'state/form';
import type {
  AddTestFieldAction,
    RemoveTestFieldAction,
    TestInputChangeAction,
    TestOutputChangeAction,
    AssignmentChangeAction,
    ModelSolutionChangeAction,
    AddHiddenRowAction,
    DeleteHiddenRowAction,
} from 'state/form';
import type { State } from './index';

const MIN_ASSIGNMENT_WORD_AMOUNT = 5;
const MIN_MODEL_SOLUTION_WORD_AMOUNT = 3;
const MIN_MODEL_SOLUTION_LINE_AMOUNT = 2;
const ASSIGNMENT_ERROR = 'Tehtävänannon tulee olla vähintään   '
  .concat(MIN_ASSIGNMENT_WORD_AMOUNT.toString())
  .concat(' sanaa pitkä.');
const MODEL_SOLUTION_WORD_ERROR = 'Mallivastauksen tulee olla vähintään '
  .concat(MIN_MODEL_SOLUTION_WORD_AMOUNT.toString())
  .concat(' sanaa pitkä.');
const MODEL_SOLUTION_LINE_ERROR = 'Mallivastauksen tulee olla vähintään '
  .concat(MIN_MODEL_SOLUTION_LINE_AMOUNT.toString())
  .concat(' riviä pitkä.');
const MODEL_SOLUTION_LINE_AND_WORD_ERROR = 'Mallivastauksen tulee olla vähintään '
  .concat(MIN_MODEL_SOLUTION_LINE_AMOUNT.toString())
  .concat(' riviä ja ').concat(MIN_MODEL_SOLUTION_WORD_AMOUNT.toString()).concat(' sanaa pitkä.');
const TEST_INPUT_OUTPUT_ERROR = 'Testien syöte- ja tulos-kentät eivät voi olla tyhjiä.';

type AnyAction = AddTestFieldAction | RemoveTestFieldAction
  | TestInputChangeAction | TestOutputChangeAction
  | AssignmentChangeAction | ModelSolutionChangeAction
  | AddHiddenRowAction | DeleteHiddenRowAction;

function isFormAction(actionContainer: AnyAction) {
  const action = actionContainer.type;
  return action === ADD_TEST_FIELD ||
    action === REMOVE_TEST_FIELD ||
    action === CHANGE_ASSIGNMENT ||
    action === CHANGE_MODEL_SOLUTION ||
    action === CHANGE_TEST_INPUT ||
    action === CHANGE_TEST_OUTPUT ||
    action === ADD_HIDDEN_ROW ||
    action === DELETE_HIDDEN_ROW;
}

function isValidAssignment(state: State) {
  const words = Plain.serialize(state.assignment).split(/[ \n]+/).filter(Boolean);
  let errorMessage;
  if (words.length < MIN_ASSIGNMENT_WORD_AMOUNT) {
    errorMessage = ASSIGNMENT_ERROR;
  }
  return errorMessage;
}


function isValidModelSolution(state: State) {
  const words = state.modelSolution.split(/[ \n]+/).filter(Boolean);
  const lines = state.modelSolution.split('\n').filter(Boolean);
  let errorMessage;
  if (words.length < MIN_MODEL_SOLUTION_WORD_AMOUNT &&
    lines.length < MIN_MODEL_SOLUTION_LINE_AMOUNT) {
    errorMessage = MODEL_SOLUTION_LINE_AND_WORD_ERROR;
  } else if (words.length < MIN_MODEL_SOLUTION_WORD_AMOUNT) {
    errorMessage = MODEL_SOLUTION_WORD_ERROR;
  } else if (lines.length < MIN_MODEL_SOLUTION_LINE_AMOUNT) {
    errorMessage = MODEL_SOLUTION_LINE_ERROR;
  }
  return errorMessage;
}

function isValidTestInputOutput(state: State) {
  for (let i = 0; i < state.inputOutput.length; i++) {
    if (state.inputOutput[i].input.length === 0 ||
      state.inputOutput[i].output.length === 0) {
      return TEST_INPUT_OUTPUT_ERROR;
    }
  }
  return undefined;
}

export default function (state: State, action: AnyAction) {
  const validityFunctions = [isValidAssignment, isValidModelSolution, isValidTestInputOutput];
  if (isFormAction(action)) {
    let valid = false;
    const errors = [];
    validityFunctions.forEach((func) => {
      const error = func(state);
      if (error) {
        errors.push(error);
      }
    });
    if (errors.length === 0) {
      valid = true;
    }
    return { ...state, ...{ valid, errors } };
  }
  return state;
}
