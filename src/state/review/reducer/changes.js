// @flow
import { createReducer } from 'redux-create-reducer';
import {
  GIVE_REVIEW,
  CHANGE_COMMENT,
  CHANGE_REVIEW_ERRORS_VISIBILITY,
  SET_REVIEW_QUESTIONS,
  SET_REVIEWABLE_EXERCISE,
  RESET_REVIEWABLE,
  REVIEW_DONE,
} from 'state/review/actions';
import type {
  GiveReviewAction,
  ChangeCommentAction,
  SetReviewQuestions,
  SetReviewableExerciseAction,
} from 'state/review/actions';
import FormValue from 'domain/form-value';
import type { State } from './index';

const initialState: State = {
  reviews: undefined,
  comment: new FormValue(''),
  valid: false,
  showErrors: false,
  reviewable: undefined,
  done: false,
};

export default createReducer(initialState, {
  [GIVE_REVIEW](state: State, action: GiveReviewAction): State {
    const oldReviews = state.reviews;
    const reviews = [];
    if (oldReviews) {
      oldReviews.get().forEach((obj) => {
        const question = obj.question;
        let review = obj.review;
        if (question === action.question) {
          review = action.value;
          reviews.push({ question, review });
        } else {
          reviews.push({ question, review });
        }
      });
    }
    return {
      ...state,
      reviews: new FormValue(reviews),
    };
  },
  [CHANGE_COMMENT](state: State, action: ChangeCommentAction): State {
    return {
      ...state,
      comment: new FormValue(action.comment),
    };
  },
  [CHANGE_REVIEW_ERRORS_VISIBILITY](state: State): State {
    return {
      ...state,
      showErrors: true,
    };
  },
  [SET_REVIEW_QUESTIONS](state: State, action: SetReviewQuestions): State {
    const answers = new Map();
    if (state.reviews) {
      state.reviews.get().forEach(obj => answers.set(obj.question, obj.review));
    }
    const reviews = action.questions
    .map(question => ({ question, review: answers.get(question) ? answers.get(question) : undefined }));
    return {
      ...state,
      reviews: new FormValue(reviews),
    };
  },
  [SET_REVIEWABLE_EXERCISE](state: State, action: SetReviewableExerciseAction): State {
    return {
      ...state,
      reviewable: action.exerciseId,
    };
  },
  [RESET_REVIEWABLE](state: State): State {
    return {
      ...state,
      reviewable: undefined,
    };
  },
  [REVIEW_DONE](state: State): State {
    return {
      ...state,
      done: true,
    };
  },
});
