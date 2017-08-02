// @flow
import { createReducer } from 'redux-create-reducer';
import {
  GIVE_REVIEW,
  CHANGE_COMMENT,
  CHANGE_REVIEW_ERRORS_VISIBILITY,
  SET_REVIEW_QUESTIONS,
  SET_REVIEWABLE_EXERCISE,
} from 'state/review/actions';
import type {
  GiveReviewAction,
  ChangeCommentAction,
  SetReviewQuestions,
  SetReviewableExerciseAction,
} from 'state/review/actions';
import FormValue from 'domain/form-value';
import type { State } from './index';

const initialState = {
  reviews: [
    new FormValue({ question: 'Tehtävänannon mielekkyys', review: undefined }),
    new FormValue({ question: 'Testien kattavuus', review: undefined }),
    new FormValue({
      question: 'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys', review: undefined,
    }),
    new FormValue({ question: 'Tehtävänannon selkeys', review: undefined }),
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
  [SET_REVIEW_QUESTIONS](state: State, action: SetReviewQuestions): State {
    const reviews = action.questions.map(question => new FormValue({ question, review: undefined }));
    return {
      ...state,
      ...{
        reviews,
      },
    };
  },
  [SET_REVIEWABLE_EXERCISE](state: State, action: SetReviewableExerciseAction): State {
    return {
      ...state,
      ...{
        reviewable: action.exerciseId,
      },
    };
  },
});
