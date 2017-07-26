// @flow
import { createReducer } from 'redux-create-reducer';
import {
  GIVE_REVIEW,
  CHANGE_COMMENT,
  CHANGE_REVIEW_ERRORS_VISIBILITY,
} from 'state/review';
import type {
  GiveReviewAction,
  ChangeCommentAction,
} from 'state/review';
import FormValue from 'domain/form-value';
import type { State } from './index';

const initialState = {
  reviews: [
    new FormValue({ question: 'Tehtävänannon mielekkyys', review: undefined }),
    new FormValue({ question: 'Testien kattavuus', review: undefined }),
    new FormValue({
      question: 'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys', review: undefined,
    }),
  ],
  comment: new FormValue(''),
  valid: false,
  showErrors: false,
  reviewable: 2,
};

export default createReducer(initialState, {
  [GIVE_REVIEW](state: State, action: GiveReviewAction): State {
    const oldReviews = state.reviews;
    const reviews = [];
    oldReviews.forEach((fVal) => {
      const question = fVal.get().question;
      let review = fVal.get().review;
      if (question === action.question) {
        review = action.value;
        review = review > 5 ? 5 : review;
        review = review < 1 ? 1 : review;
        reviews.push(new FormValue({ question, review }));
      } else {
        reviews.push(new FormValue({ question, review }));
      }
    });
    return {
      ...state,
      ...{
        reviews,
      },
    };
  },
  [CHANGE_COMMENT](state: State, action: ChangeCommentAction): State {
    return {
      ...state,
      ...{
        comment: new FormValue(action.comment),
      },
    };
  },
  [CHANGE_REVIEW_ERRORS_VISIBILITY](state: State): State {
    return {
      ...state,
      ...{
        showErrors: !state.showErrors,
      },
    };
  },
});
