// @flow
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import {
  startSendAction,
  postSuccessfulAction,
  postUnsuccessfulAction,
  finishAction,
  invalidDataErrorAction,
} from 'state/submission';
import { setFormState, setTagSuggestions } from 'state/form';

export const GIVE_REVIEW = 'GIVE_REVIEW';
export const CHANGE_COMMENT = 'CHANGE_COMMENT';
export const CHANGE_REVIEW_ERRORS_VISIBILITY = 'CHANGE_REVIEW_ERRORS_VISIBILITY';
export const SET_REVIEW_QUESTIONS = 'SET_REVIEW_QUESTIONS';
export const SET_REVIEWABLE_EXERCISE = 'SET_REVIEWABLE_EXERCISE';
export const SET_FORM_STATE = 'SET_FORM_STATE';

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

export function setReviewableExerciseAction(assignmentId: number) {
  return async function getter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    api.getReviewableExerciseAndQuestions(assignmentId)
      .then((resp) => {
        dispatch(setReviewableIdAction(resp.exercise.id));
        dispatch(setFormState(resp.exercise));
        dispatch(setReviewQuestions(resp.peer_review_questions));
        dispatch(setTagSuggestions(resp.tags));
      }, () => {
        dispatch(invalidDataErrorAction());
      });
  };
}

export function submitReviewAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    dispatch(startSendAction());
    api.postReview(getState().review, getState().form)
    .then((resp) => {
      console.info(resp);
      dispatch(postSuccessfulAction());
      dispatch(finishAction());
    }, (error) => {
      dispatch(postUnsuccessfulAction(error.message));
    });
  };
}

export function reviewSubmitButtonPressedAction() {
  return function submitter(dispatch: Dispatch, getState: GetState) {
    dispatch(changeReviewErrorVisibilityAction());
    const state = getState();
    if (!state.review.valid) {
      return;
    }
    dispatch(submitReviewAction());
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
