// @flow
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import {
  startSendAction,
  postSuccessfulAction,
  postUnsuccessfulAction,
  finishAction,
  invalidDataErrorAction,
  exerciseNotFoundAction,
} from 'state/submission/actions';
import { setFormState, setTagSuggestions } from 'state/form';

export const GIVE_REVIEW = 'GIVE_REVIEW';
export const CHANGE_COMMENT = 'CHANGE_COMMENT';
export const CHANGE_REVIEW_ERRORS_VISIBILITY = 'CHANGE_REVIEW_ERRORS_VISIBILITY';
export const SET_REVIEW_QUESTIONS = 'SET_REVIEW_QUESTIONS';
export const SET_REVIEWABLE_EXERCISE = 'SET_REVIEWABLE_EXERCISE';
export const SET_FORM_STATE = 'SET_FORM_STATE';
export const RESET_REVIEWABLE = 'RESET_REVIEWABLE';
export const REVIEW_DONE = 'REVIEW_DONE';

export function giveReviewAction(question: string, value: number) {
  return {
    question,
    value,
    type: GIVE_REVIEW,
  };
}

export function changeCommentAction(comment: string) {
  return {
    comment,
    type: CHANGE_COMMENT,
  };
}

export function changeReviewErrorVisibilityAction() {
  return {
    type: CHANGE_REVIEW_ERRORS_VISIBILITY,
  };
}

export function setReviewableIdAction(exerciseId: number) {
  return {
    exerciseId,
    type: SET_REVIEWABLE_EXERCISE,
  };
}

type ReviewQuestion = {
  question: string,
};

export function setReviewQuestions(reviewQuestions: Array<ReviewQuestion>) {
  const questions = reviewQuestions.map(rq => rq.question);
  return {
    questions,
    type: SET_REVIEW_QUESTIONS,
  };
}

export function setReviewableExerciseAction() {
  return async function getter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    api.getReviewableExerciseAndQuestions(getState().assignment.assignmentId)
      .then((resp) => {
        dispatch(setReviewableIdAction(resp.exercise.id));
        dispatch(setFormState(resp.exercise, resp.model_solution, resp.template));
        dispatch(setReviewQuestions(resp.peer_review_questions));
        dispatch(setTagSuggestions(resp.tags));
      }, (error) => {
        if (error.status === 400) {
          dispatch(exerciseNotFoundAction());
        } else {
          dispatch(invalidDataErrorAction());
        }
      });
  };
}

export function reviewDoneAction() {
  return {
    type: REVIEW_DONE,
  };
}

export function submitReviewAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    console.info('submit');
    dispatch(startSendAction());
    api.postReview(getState().review, getState().form)
    .then((resp) => {
      console.info(resp);
      dispatch(postSuccessfulAction());
      dispatch(finishAction());
      dispatch(reviewDoneAction());
    }, (error) => {
      dispatch(postUnsuccessfulAction(error.message));
    });
  };
}

export function reviewSubmitButtonPressedAction() {
  return function submitter(dispatch: Dispatch, getState: GetState) {
    dispatch(changeReviewErrorVisibilityAction());
    const state = getState();
    if (!state.review.valid || !state.form.valid) {
      return;
    }
    dispatch(submitReviewAction());
  };
}

export function resetReviewableAction() {
  return {
    type: RESET_REVIEWABLE,
  };
}

export type GiveReviewAction = {
  question: string,
  value: number,
  type: string,
};

export type ChangeCommentAction = {
  comment: string,
  type: string,
};

export type ChangeReviewErrorVisibility = {
  type: string,
};

export type SetReviewQuestions = {
  questions: Array<string>,
  type: string,
};

export type SetReviewableExerciseAction = {
  exerciseId: number,
  type: string,
};

export type ResetReviewableAction = {
  type: string,
};
