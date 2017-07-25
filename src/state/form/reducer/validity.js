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
import FormValue from 'domain/form-value';

const MIN_ASSIGNMENT_WORD_AMOUNT = 5;
const MIN_MODEL_SOLUTION_WORD_AMOUNT = 3;
const MIN_MODEL_SOLUTION_LINE_AMOUNT = 2;
const ASSIGNMENT_ERROR = `Tehtävänannon tulee olla vähintään ${MIN_ASSIGNMENT_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_LINE_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä pitkä.`;
const MODEL_SOLUTION_LINE_AND_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${
  MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä ja ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const CANNOT_BE_BLANK_ERROR = 'Kenttä ei voi olla tyhjä.';

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

function inputOutputErrors(ioValue: string): Array<string> {
  const errors = [];
  if (ioValue.length === 0) {
    errors.push(CANNOT_BE_BLANK_ERROR);
  }
  return errors;
}

export default function (state: State, action: AnyAction) {
  if (!isFormAction(action)) {
    return state;
  }
  const validationResults = [];

  const assignmentErrs = assignmentErrors(state);
  state.assignment._setErrors(assignmentErrs);
  validationResults.push(assignmentErrors.length === 0);

  const modelSolutionErrs = modelSolutionErrors(state);
  state.modelSolution._setErrors(modelSolutionErrs);
  validationResults.push(modelSolutionErrors.length === 0);

  state.inputOutput.forEach((io) => {
    const input = io.input;
    const errors = inputOutputErrors(input.get());
    input._setErrors(errors);
    const output = io.output;
    const outputErrors = inputOutputErrors(output.get());
    output._setErrors(outputErrors);
  });

  const valid = validationResults.every(o => o);

  return { ...state, ...{ valid } };
}
