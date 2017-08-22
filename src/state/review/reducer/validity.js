// @flow
import {
  GIVE_REVIEW,
  CHANGE_COMMENT,
  CHANGE_REVIEW_ERRORS_VISIBILITY,
  SET_REVIEWABLE_EXERCISE,
} from 'state/review';
import type {
  GiveReviewAction,
  ChangeCommentAction,
  ChangeReviewErrorVisibility,
  SetReviewableExerciseAction,
} from 'state/review';
import FormValue from 'domain/form-value';
import validator from 'utils/validator';
import type { State, Review } from './index';

type AnyAction = GiveReviewAction |
                 ChangeCommentAction |
                ChangeReviewErrorVisibility |
                SetReviewableExerciseAction;

const MIN_COMMENT_WORD_AMOUNT = 3;
const COMMENT_ERROR = `Kommentin tulee olla vähintään ${MIN_COMMENT_WORD_AMOUNT.toString()} sanaa pitkä.`;
const REVIEW_ERROR = 'Vastaa kaikkiin vertaisarviointikysymyksiin.';

function isReviewAction(actionContainer: AnyAction) {
  const action = actionContainer.type;
  return action === GIVE_REVIEW ||
    action === CHANGE_COMMENT ||
    action === CHANGE_REVIEW_ERRORS_VISIBILITY ||
    action === SET_REVIEWABLE_EXERCISE;
}

function validateComment(comment: FormValue<*>) {
  const errors = [];
  const words = comment.get().replace(/\n/g, ' ').split(' ').filter(Boolean);
  if (words.length < MIN_COMMENT_WORD_AMOUNT) {
    errors.push(COMMENT_ERROR);
  }
  return errors;
}

function validateReview(fVal: FormValue<Array<Review>>) {
  const errors = [];
  fVal.get().forEach((obj) => {
    if (obj.review === undefined && errors.length === 0) {
      errors.push(REVIEW_ERROR);
    }
  });
  return errors;
}

export default function (state: State, action: AnyAction) {
  if (!isReviewAction(action)) {
    return state;
  }
  const validators = [
    { field: 'comment', validator: validateComment },
    { field: 'reviews', validator: validateReview },
  ];
  const valid = validator(validators, state);
  return { ...state, ...{ valid } };
}
