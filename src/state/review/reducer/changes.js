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
import type { State } from './index';

const initialState = {
  reviews: new Map(),
  reviewQuestions:
  ['Tehtävänannon mielekkyys',
    'Testien kattavuus',
    'Tehtävänannon selkeys',
    'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys'],
  comment: '',
  valid: false,
  showErrors: false,
  errors: new Map(),
};

export default createReducer(initialState, {
  [GIVE_REVIEW](state: State, action: GiveReviewAction): State {
    const oldReviews = state.reviews;
    const reviews = new Map();
    oldReviews.forEach((value: number, key: string) => {
      reviews.set(key, value);
    });
    reviews.set(action.question, action.value);
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
        comment: action.comment,
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
