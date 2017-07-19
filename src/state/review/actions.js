// @flow
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';
import {
  startSendAction,
  postSuccessfulAction,
  postUnsuccessfulAction,
  finishAction,
} from 'state/submission';

export const GIVE_REVIEW = 'GIVE_REVIEW';
export const CHANGE_COMMENT = 'CHANGE_COMMENT';
export const CHANGE_REVIEW_ERRORS_VISIBILITY = 'CHANGE_REVIEW_ERRORS_VISIBILITY';

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

export function submitReviewAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    dispatch(startSendAction());
    api.postReview(getState().review)
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
