// @flow

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

type AnyAction = AddTestFieldAction | RemoveTestFieldAction
                | TestInputChangeAction | TestOutputChangeAction
                | AssignmentChangeAction | ModelSolutionChangeAction
                | AddHiddenRowAction | DeleteHiddenRowAction;

let count = 0;

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

export default function (state: State, action: AnyAction) {
  if (isFormAction(action)) {
    let valid = false;
    if (count > 5) {
      valid = true;
    }
    count++;
    return { ...state, ...{ valid } };
  }
  return state;
}
