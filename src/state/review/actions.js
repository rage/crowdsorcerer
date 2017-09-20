// @flow
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import {
  startSendAction,
  postSuccessfulAction,
  postUnsuccessfulAction,
  finishAction,
} from 'state/submission/actions';
import { newExerciseReceivedAction } from 'state/form';
import type { Tag, ExerciseJSON } from 'state/form';
import type PeerReviewQuestion from 'state/review';

export const GIVE_REVIEW = 'GIVE_REVIEW';
export const CHANGE_COMMENT = 'CHANGE_COMMENT';
export const CHANGE_REVIEW_ERRORS_VISIBILITY = 'CHANGE_REVIEW_ERRORS_VISIBILITY';
export const SET_REVIEW_QUESTIONS = 'SET_REVIEW_QUESTIONS';
export const SET_REVIEWABLE_EXERCISE = 'SET_REVIEWABLE_EXERCISE';
export const NEW_EXERCISE_RECEIVED = 'NEW_EXERCISE_RECEIVED';
export const RESET_REVIEWABLE = 'RESET_REVIEWABLE';
export const REVIEW_DONE = 'REVIEW_DONE';
export const REVIEWABLE_AND_QUESTIONS_RECEIVED = 'REVIEWABLE_AND_QUESTIONS_RECEIVED';

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
export function reviewableAndQuestionsReceivedAction(reviewable: number, reviewQuestions: Array<Object>) {
  const questions = reviewQuestions.map(rq => rq.question);
  return {
    questions,
    reviewable,
    type: REVIEWABLE_AND_QUESTIONS_RECEIVED,
  };
}

export function setReviewableExerciseAction(
  exerciseJSON: ExerciseJSON,
  peerReviewQuestions: Array<PeerReviewQuestion>,
  tags: Array<Tag>) {
  return async function setter(dispatch: Dispatch) {
    dispatch(reviewableAndQuestionsReceivedAction(exerciseJSON.id, peerReviewQuestions));
    dispatch(newExerciseReceivedAction(exerciseJSON, tags),
    );
  };
}

export function reviewDoneAction() {
  return {
    type: REVIEW_DONE,
  };
}

export function submitReviewAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    dispatch(startSendAction());
    api.postReview(getState().review, getState().form)
    .then(() => {
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

export type ReviewableAndQuestionsReceivedAction = {
  questions: Array<string>,
  reviewable: number,
  type: string,
};
