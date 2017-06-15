// @flow
import { Plain } from 'slate';
import IO from 'domain/io';

import {
  ADD_TEST_FIELD,
  REMOVE_TEST_FIELD,
  CHANGE_ASSIGNMENT,
  CHANGE_MODEL_SOLUTION,
  CHANGE_TEST_INPUT,
  CHANGE_TEST_OUTPUT,
  ADD_HIDDEN_ROW,
  DELETE_HIDDEN_ROW,
  CHANGE_FORM_ERRORS_VISIBILITY,
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
  ChangeErrorsVisibilityAction,
} from 'state/form';
import type { State } from './index';

const MIN_ASSIGNMENT_WORD_AMOUNT = 5;
const MIN_MODEL_SOLUTION_WORD_AMOUNT = 3;
const MIN_MODEL_SOLUTION_LINE_AMOUNT = 2;
const ASSIGNMENT_ERROR = `Tehtävänannon tulee olla vähintään ${MIN_ASSIGNMENT_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_LINE_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä pitkä.`;
const MODEL_SOLUTION_LINE_AND_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${
  MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä ja ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const TEST_INPUT_ERROR = 'Syöte-kenttä ei voi olla tyhjä.';
const TEST_OUTPUT_ERROR = 'Tulos-kenttä ei voi olla tyhjä.';

type AnyAction = AddTestFieldAction | RemoveTestFieldAction
  | TestInputChangeAction | TestOutputChangeAction
  | AssignmentChangeAction | ModelSolutionChangeAction
  | AddHiddenRowAction | DeleteHiddenRowAction | ChangeErrorsVisibilityAction;

function isFormAction(actionContainer: AnyAction) {
  const action = actionContainer.type;
  return action === ADD_TEST_FIELD ||
    action === REMOVE_TEST_FIELD ||
    action === CHANGE_ASSIGNMENT ||
    action === CHANGE_MODEL_SOLUTION ||
    action === CHANGE_TEST_INPUT ||
    action === CHANGE_TEST_OUTPUT ||
    action === ADD_HIDDEN_ROW ||
    action === DELETE_HIDDEN_ROW ||
    action === CHANGE_FORM_ERRORS_VISIBILITY;
}

function assignmentErrors(state: State): Array<string> {
  const errors = [];
  const words = Plain.serialize(state.assignment.get()).split(/[ \n]+/).filter(Boolean);
  if (words.length < MIN_ASSIGNMENT_WORD_AMOUNT) {
    errors.push(ASSIGNMENT_ERROR);
  }
  return errors;
}


function modelSolutionErrors(state: State): Array<string> {
  const errors = [];
  const words = state.modelSolution.get().split(/[ \n]+/).filter(Boolean);
  const lines = state.modelSolution.get().split('\n').filter(Boolean);
  let errorMessage;
  if (words.length < MIN_MODEL_SOLUTION_WORD_AMOUNT &&
    lines.length < MIN_MODEL_SOLUTION_LINE_AMOUNT) {
    errorMessage = MODEL_SOLUTION_LINE_AND_WORD_ERROR;
  } else if (words.length < MIN_MODEL_SOLUTION_WORD_AMOUNT) {
    errorMessage = MODEL_SOLUTION_WORD_ERROR;
  } else if (lines.length < MIN_MODEL_SOLUTION_LINE_AMOUNT) {
    errorMessage = MODEL_SOLUTION_LINE_ERROR;
  }
  if (errorMessage) {
    errors.push(errorMessage);
  }
  return errors;
}

function inputOutputErrors(io: IO): Array<string> {
  const errors = [];
  if (io.input.length === 0) {
    errors.push(TEST_INPUT_ERROR);
  }
  if (io.output.length === 0) {
    errors.push(TEST_OUTPUT_ERROR);
  }
  return errors;
}

export default function (state: State, action: AnyAction) {
  if (!isFormAction(action)) {
    return state;
  }
  const validationResults = [];
  // Mutation is fine here since the previous reducer just initialized the changed objects
  /* eslint-disable no-underscore-dangle */
  const assignmentErrs = assignmentErrors(state);
  state.assignment._setErrors(assignmentErrs);
  validationResults.push(assignmentErrors.length === 0);

  const modelSolutionErrs = modelSolutionErrors(state);
  state.modelSolution._setErrors(modelSolutionErrs);
  validationResults.push(modelSolutionErrors.length === 0);

  state.inputOutput.forEach((ioValue) => {
    const errors = inputOutputErrors(ioValue.get());
    ioValue._setErrors(errors);
    validationResults.push(errors.length === 0);
  });
  /* eslint-enable no-underscore-dangle */

  const valid = validationResults.every(o => o);

  return { ...state, ...{ valid } };
}
