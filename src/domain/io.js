// @flow
import FormValue from 'domain/form-value';

let counter = 0;

export default class IO {

  input: FormValue<string>;
  output: FormValue<string>;
  hashCode: ?string;

  constructor(input: string = '', output: string = '', hashCode: ?string) {
    this.input = new FormValue(input);
    this.output = new FormValue(output);
    this.hashCode = hashCode;
  }

  hash(): string {
    if (this.hashCode !== undefined && this.hashCode != null) {
      return this.hashCode;
    }
    const currentCount = counter++;
    this.hashCode = currentCount.toString();
    return this.hashCode;
  }

  _changeInput(input: string) {
    const newIO = new IO(input, this.output.get(), this.hashCode);
    return newIO;
  }

  _changeOutput(output: string) {
    const newIO = new IO(this.input.get(), output, this.hashCode);
    return newIO;
  }
}
