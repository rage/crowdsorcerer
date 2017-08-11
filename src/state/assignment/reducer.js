// @flow
export type State = {
  assignmentId: number,
};

export default function createReducerCreator(assignmentId: number) {
  const initialState = {
    assignmentId,
  };
  return (previousState: State) => {
    if (previousState === undefined) {
      return initialState;
    }
    return previousState;
  };
}
