// @flow
import FormValue from 'domain/form-value';

let counter = 0;

export default class IO {

  input: FormValue<string>;
  output: FormValue<string>;
  hashCode: ?string;
  type: string;

  constructor(
    input: FormValue<string> = new FormValue(''),
    output: FormValue<string> = new FormValue(''),
    type: string = 'contains',
    hashCode: ?string) {
    this.input = input;
    this.output = output;
    this.hashCode = hashCode;
    this.type = type;
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
    const newIO = new IO(new FormValue(input), this.output, this.type, this.hashCode);
    return newIO;
  }

  _changeOutput(output: string) {
    const newIO = new IO(this.input, new FormValue(output), this.type, this.hashCode);
    return newIO;
  }

}
