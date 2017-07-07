// @flow
import type { ThunkArgument } from 'state/store';
import type { Dispatch, GetState } from 'state/reducer';

export const GIVE_REVIEW = 'GIVE_REVIEW';
export const CHANGE_COMMENT = 'CHANGE_COMMENT';

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

export function submitAction() {
  return async function submitter(dispatch: Dispatch, getState: GetState, { api }: ThunkArgument) {
    // dispatch(startSendAction());
    console.info('submit');
    api.postReview(getState().review)
    .then(resp => console.info(resp));
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
