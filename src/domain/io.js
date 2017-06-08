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

  changeInput(input: string) {
    const newIO = new IO(input, this.output);
    newIO.hashCode = this.hashCode;
    return newIO;
  }

  changeOutput(output: string) {
    const newIO = new IO(this.input, output);
    newIO.hashCode = this.hashCode;
    return newIO;
  }

}
