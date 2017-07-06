// @flow
export type State = {
  assignmentId: string,
};

export default function createReducerCreator(assignmentId: string) {
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
