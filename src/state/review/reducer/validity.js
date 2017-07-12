// @flow
import {
  GIVE_REVIEW,
  CHANGE_COMMENT,
  CHANGE_REVIEW_ERRORS_VISIBILITY,
} from 'state/review';
import type {
  GiveReviewAction,
  ChangeCommentAction,
  ChangeReviewErrorVisibility,
} from 'state/review';
import type { State } from './index';

type AnyAction = GiveReviewAction | ChangeCommentAction | ChangeReviewErrorVisibility;

const MIN_COMMENT_WORD_AMOUNT = 3;
const COMMENT_ERROR = `Kommentin tulee olla vähintään ${MIN_COMMENT_WORD_AMOUNT.toString()} sanaa pitkä.`;
const REVIEW_ERROR = 'Vastaa kaikkiin vertaisarviointikysymyksiin.';

function isReviewAction(actionContainer: AnyAction) {
  const action = actionContainer.type;
  return action === GIVE_REVIEW ||
    action === CHANGE_COMMENT ||
    action === CHANGE_REVIEW_ERRORS_VISIBILITY;
}

function validateComment(state: State) {
  const words = state.comment.split(' ').filter(Boolean);
  if (words.length < MIN_COMMENT_WORD_AMOUNT) {
    return {
      key: 'commentError',
      errors: [COMMENT_ERROR],
    };
  }
  return undefined;
}

function validateReviews(state: State) {
  const errors = [];
  state.reviewQuestions.forEach((question) => {
    if (state.reviews.get(question) === undefined) {
      errors.push({
        msg: REVIEW_ERROR,
        question,
      });
    }
  });
  if (errors.length === 0) {
    return undefined;
  }
  return { key: 'reviewError', errors };
}

export default function (state: State, action: AnyAction) {
  const validityFunctions = [validateComment, validateReviews];
  if (isReviewAction(action)) {
    let valid = false;
    const errors = new Map();
    validityFunctions.forEach((func) => {
      const error = func(state);
      if (error) {
        errors.set(error.key, error.errors);
      }
    });
    if (errors.size === 0) {
      valid = true;
    }
    return { ...state, ...{ valid, errors } };
  }
  return state;
}
