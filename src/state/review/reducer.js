// @flow
import { createReducer } from 'redux-create-reducer';
import { GIVE_REVIEW, CHANGE_COMMENT } from './actions';
import type { GiveReviewAction, ChangeCommentAction } from './actions';

export type State = {
  reviews: Map<string, number>,
  reviewQuestions: Array<string>,
  comment: string,
}

const initialState = {
  reviews: new Map(),
  reviewQuestions: ['Tehtävä on mielekäs', 'Testit ovat kattavia', 'Tehtävänanto on selkeä'],
  comment: '',
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
});
