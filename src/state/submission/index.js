// @flow
export * from './actions';
export { default } from './reducer';
export type { State } from './reducer';

export type ErrorMessage = {
  header: string,
  messages: [{message: string, line: number, char: number}],
};
