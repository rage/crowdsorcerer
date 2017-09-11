import type { State } from 'state/reducer';

export default (state: State) => (
  state.review.reviewable === undefined && state.form.modelSolution.editableModelSolution === undefined) ||
  (state.review.reviewable !== undefined &&
      (state.form.modelSolution.readOnlyModelSolution === undefined
          || state.form.modelSolution.readOnlyCodeTemplate === undefined || state.review.reviews === undefined));
