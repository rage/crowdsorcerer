// @flow
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

export type GiveReviewAction = {
  question: string,
  value: number,
  type: string,
};

export type ChangeCommentAction = {
  comment: string,
  type: string,
};
