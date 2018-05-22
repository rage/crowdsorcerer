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
} from 'state/form/actions';
import { CHANGE_REVIEW_ERRORS_VISIBILITY } from 'state/review/actions';
import type {
  AddTestFieldAction,
<<<<<<< c14c28c0e751f5ae9375685ff075f9c5e3ac0c92
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
=======
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
>>>>>>> Show either unit tests -field or input-output -fields
} from 'state/form/actions';
import type { State } from './index';

const MIN_ASSIGNMENT_WORD_AMOUNT = 5;
const MIN_MODEL_SOLUTION_WORD_AMOUNT = 3;
const MIN_MODEL_SOLUTION_LINE_AMOUNT = 2;
const MIN_UNIT_TEST_AMOUNT = 1;
const ASSIGNMENT_ERROR = `Tehtävänannon tulee olla vähintään ${MIN_ASSIGNMENT_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const MODEL_SOLUTION_LINE_ERROR = `Mallivastauksen tulee olla vähintään ${MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä pitkä.`;
const MODEL_SOLUTION_LINE_AND_WORD_ERROR = `Mallivastauksen tulee olla vähintään ${
  MIN_MODEL_SOLUTION_LINE_AMOUNT} riviä ja ${MIN_MODEL_SOLUTION_WORD_AMOUNT} sanaa pitkä.`;
const CANNOT_BE_BLANK_ERROR = 'Kenttä ei voi olla tyhjä.';
<<<<<<< c14c28c0e751f5ae9375685ff075f9c5e3ac0c92
const EMPTY_TEMPLATE_ERROR = 'Muista merkitä, mitkä rivit tehtävästä kuuluvat vain mallivastaukseen, sillä ' +
  'muuten tehtävän koko ratkaisu näkyy tehtäväpohjassa. Lisää tietoa ohjeistuksessa.';
=======
const UNIT_TESTS_ERRORS = `Testejä tulee olla vähintään ${MIN_UNIT_TEST_AMOUNT}`; // TODO: toteuta
>>>>>>> Show either unit tests -field or input-output -fields

type AnyAction = AddTestFieldAction | RemoveTestFieldAction
  | TestInputChangeAction | TestOutputChangeAction
  | AssignmentChangeAction | ModelSolutionChangeAction
<<<<<<< c14c28c0e751f5ae9375685ff075f9c5e3ac0c92
  | AddHiddenRowAction | DeleteHiddenRowAction | ChangeErrorsVisibilityAction | AddTagAction | RemoveTagAction;
=======
  | AddHiddenRowAction | DeleteHiddenRowAction | ChangeErrorsVisibilityAction | AddTagAction | RemoveTagAction
  | ChangeUnitTestsAction ;
>>>>>>> Show either unit tests -field or input-output -fields

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
    action === CHANGE_UNIT_TESTS;
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

function modelSolutionErrors(modelSolution: FormValue<*>): Array<string> {
  const errors = [];
  const words = modelSolution.get().split(/[ \n]+/).filter(Boolean);
  const lines = modelSolution.get().split('\n').filter(Boolean);
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

function unitTestsErrors(unitTests: FormValue<*>): Array<string> { // TODO: millä ehdolla yksikkötestit on valideja?
  const errors = [];
  let errorMessage;

  const testAmount = unitTests.get().split(/[ \n]+/).filter(word => word === '@Test').length;

  if (testAmount < MIN_UNIT_TEST_AMOUNT) {
    errorMessage = UNIT_TESTS_ERRORS;
  }
  if (errorMessage) {
    errors.push(errorMessage);
  }
  return errors;
}

export function checkNotBlank(formValue: FormValue<*>): Array<string> {
  const errors = [];
  if (formValue.get().length === 0) {
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
  const validators = [
    { field: 'assignment', validator: assignmentErrors },
    { field: 'modelSolution:editableModelSolution', validator: modelSolutionErrors },
    { field: 'modelSolution:solutionRows', validator: solutionRowErrors },
    { field: 'tags', validator: checkNotBlank },
    { field: 'inputOutput', validator: checkNotBlank },
    { field: 'unitTests', validator: unitTestsErrors },
  ];

  const valid = validator(validators, state);
  return { ...state, ...{ valid } };
}
