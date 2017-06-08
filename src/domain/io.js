// @flow

let counter = 0;

export default class IO {

  input: string;
  output: string;
  hashCode: string;

  constructor(input: string = '', output: string = '') {
    this.input = input;
    this.output = output;
  }

  hash(): string {
    if (this.hashCode !== undefined) {
      return this.hashCode;
    }
    const currentCount = counter++;
    this.hashCode = currentCount.toString();
    return this.hashCode;
  }
}
