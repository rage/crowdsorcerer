// @flow
import { Plain, State as sState } from 'slate';
import FormValue from 'domain/form-value';
import validator from 'utils/validator';
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
  ADD_TAG,
  REMOVE_TAG,
  CHANGE_UNIT_TESTS,
  CHANGE_TEST_NAME,
} from 'state/form/actions';
import { CHANGE_REVIEW_ERRORS_VISIBILITY } from 'state/review/actions';
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
    AddTagAction,
    RemoveTagAction,
    ChangeUnitTestsAction,
  ChangeTestNameAction,
} from 'state/form/actions';
import type { State } from './index';


const MIN_ASSIGNMENT_WORD_AMOUNT = 5;
const MIN_MODEL_SOLUTION_WORD_AMOUNT = 3;
const MIN_MODEL_SOLUTION_LINE_AMOUNT = 2;
const MIN_UNIT_TEST_AMOUNT = 3;
const MIN_UNIT_TESTS_WORD_AMOUNT = 5;
const ASSIGNMENT_ERROR = `Tehtävänannon tulee olla vähintään ${MIN_ASSIGNMENT_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_LINE_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä pitkä.`;
const MODEL_SOLUTION_LINE_AND_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${
  MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä ja ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const CANNOT_BE_BLANK_ERROR = 'Kenttä ei voi olla tyhjä.';
const EMPTY_TEMPLATE_ERROR = 'Muista merkitä, mitkä rivit tehtävästä kuuluvat vain mallivastaukseen, sillä ' +
  'muuten tehtävän koko ratkaisu näkyy tehtäväpohjassa. Lisää tietoa ohjeistuksessa.';
const UNIT_TEST_AMOUNT_ERROR = `Testejä tulee olla vähintään ${MIN_UNIT_TEST_AMOUNT}`;
const UNIT_TESTS_WORD_ERROR = `Testikoodin tulee olla vähintään ${MIN_UNIT_TESTS_WORD_AMOUNT} sanaa pitkä.`;

type AnyAction = AddTestFieldAction | RemoveTestFieldAction
  | TestInputChangeAction | TestOutputChangeAction
  | AssignmentChangeAction | ModelSolutionChangeAction
  | AddHiddenRowAction | DeleteHiddenRowAction | ChangeErrorsVisibilityAction | AddTagAction | RemoveTagAction
  | ChangeUnitTestsAction | ChangeTestNameAction;

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
    action === CHANGE_FORM_ERRORS_VISIBILITY ||
    action === ADD_TAG ||
    action === REMOVE_TAG ||
    action === CHANGE_UNIT_TESTS ||
    action === CHANGE_TEST_NAME;
}

// TBD: is this function a good idea?
function getDifferenceBetweenStrings(original: string, submitted: string): string {
  const orig = original.replace(/\r?\n|\r/g, '\n');
  const sub = submitted.replace(/\r?\n|\r/g, '\n');
  let result = '';
  let i = 0;
  let j;
  for (j = 0; j < sub.length; j++) {
    if (orig[i] !== sub[j] || i === orig.length) {
      result += sub[j];
    } else {
      i++;
    }
  }
  return result;
}

function assignmentErrors(assignment: FormValue<sState>): Array<string> {
  const errors = [];
  const words = Plain.serialize(assignment.get()).split(/[ \n]+/).filter(Boolean);
  if (words.length < MIN_ASSIGNMENT_WORD_AMOUNT) {
    errors.push(ASSIGNMENT_ERROR);
  }
  return errors;
}

function checkModelSolutionLength(words: Array<string>, lines: Array<string>): ?string {
  if (words.length < MIN_MODEL_SOLUTION_WORD_AMOUNT &&
    lines.length < MIN_MODEL_SOLUTION_LINE_AMOUNT) {
    return MODEL_SOLUTION_LINE_AND_WORD_ERROR;
  } else if (words.length < MIN_MODEL_SOLUTION_WORD_AMOUNT) {
    return MODEL_SOLUTION_WORD_ERROR;
  } else if (lines.length < MIN_MODEL_SOLUTION_LINE_AMOUNT) {
    return MODEL_SOLUTION_LINE_ERROR;
  }
  return undefined;
}

function modelSolutionErrors(modelSolution: FormValue<*>, state: State): Array<string> {
  const errors = [];
  const insertedCode = getDifferenceBetweenStrings(state.modelSolution.boilerplate.code, modelSolution.get());
  const words = insertedCode.split(/[ \n]+/).filter(Boolean);
  const lines = insertedCode.split('\n').filter(Boolean);

  const errorMessage = checkModelSolutionLength(words, lines);

  if (errorMessage) {
    errors.push(errorMessage);
  }
  return errors;
}

function solutionRowErrors(solutionRows: FormValue<Array<Number>>): Array<string> {
  if (solutionRows.get().length === 0) {
    return [EMPTY_TEMPLATE_ERROR];
  }
  return [];
}

function unitTestsErrors(unitTests: FormValue<*>, state: State): Array<string> {
  const errors = [];
  let errorMessage;

  const insertedCode = getDifferenceBetweenStrings(state.unitTests.boilerplate.code, unitTests.get());

  const words = insertedCode.split(/[ \n]+/).filter(Boolean);
  const testAmount = unitTests.get().split(/[ \n]+/).filter(word => word.includes('@Test')).length;

  if (testAmount < MIN_UNIT_TEST_AMOUNT) {
    errorMessage = UNIT_TEST_AMOUNT_ERROR;
  } else if (words.length < MIN_UNIT_TESTS_WORD_AMOUNT) {
    errorMessage = UNIT_TESTS_WORD_ERROR;
  }

  if (errorMessage) {
    errors.push(errorMessage);
  }
  return errors;
}

export function checkNotBlank(formValue: FormValue<*>): Array<string> {
  const errors = [];
  if (formValue.get().length === 0 || formValue.get() === '<placeholderTestName>') {
    errors.push(CANNOT_BE_BLANK_ERROR);
  }
  return errors;
}

export default function (state: State, action: AnyAction) {
  // form is validated when review send button pressed
  if (!isFormAction(action) && action.type !== CHANGE_REVIEW_ERRORS_VISIBILITY) {
    return state;
  }
  // separate nested fields with ":"

  let modelSolutionValidator = [
    { field: 'modelSolution:editableModelSolution', validator: modelSolutionErrors },
    { field: 'modelSolution:solutionRows', validator: solutionRowErrors },
  ];
  if (state.testingType === 'tests_for_set_up_code' || state.testingType === 'whole_test_code_for_set_up_code' || state.testingType === 'input_output_tests_for_set_up_code') {
    modelSolutionValidator = [];
  }

  let tests;
  if (state.testingType === 'unit_tests' || state.testingType === 'whole_test_code_for_set_up_code') {
    tests = [{ field: 'unitTests', validator: unitTestsErrors }];
  } else if (state.testingType === 'input_output') {
    tests = [{ field: 'inputOutput', validator: checkNotBlank }];
  } else { // else if state.testingType === 'io_and_code'
    tests = [
      { field: 'inputOutput', validator: checkNotBlank },
      { field: 'unitTests:testArray', validator: checkNotBlank },
    ];
  }

  const validators = [
    { field: 'assignment', validator: assignmentErrors },
    { field: 'tags', validator: checkNotBlank },
  ].concat(tests).concat(modelSolutionValidator);

  const valid = validator(validators, state);
  return { ...state, ...{ valid } };
}
