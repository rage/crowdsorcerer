// @flow
import { createReducer } from 'redux-create-reducer';
import {
  GIVE_REVIEW,
  CHANGE_COMMENT,
  CHANGE_REVIEW_ERRORS_VISIBILITY,
  RESET_REVIEWABLE,
  REVIEW_DONE,
  REVIEWABLE_AND_QUESTIONS_RECEIVED,
} from 'state/review/actions';
import type {
  GiveReviewAction,
  ChangeCommentAction,
  ReviewableAndQuestionsReceivedAction,
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
  [REVIEWABLE_AND_QUESTIONS_RECEIVED](state: State, action: ReviewableAndQuestionsReceivedAction): State {
    const answers = new Map();
    if (state.reviews) {
      state.reviews.get().forEach(obj => answers.set(obj.question, obj.review));
    }
    const reviews = action.questions
    .map(question => ({ question, review: answers.get(question) ? answers.get(question) : undefined }));
    return {
      ...state,
      reviewable: action.reviewable,
      reviews: new FormValue(reviews),
    };
  },
});
