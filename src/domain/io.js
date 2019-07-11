// @flow
import FormValue from 'domain/form-value';

let counter = 0;

export default class IO {

  // input: FormValue<string>;
  input: FormValue<Array>;
  output: FormValue<string>;
  hashCode: ?string;
  type: string;
  inputLineCount: number;

  constructor(
    // TODO: DO THIS CHANGE
    // input: FormValue<string> = new FormValue(''),
    input: FormValue<Array> = new FormValue(['']),
    output: FormValue<string> = new FormValue(''),
    type: string = 'contains',
    hashCode: ?string,
    inputLineCount: number = 1) {
    this.input = input;
    this.output = output;
    this.hashCode = hashCode;
    this.type = type;
    this.inputLineCount = inputLineCount;
  }

  hash(): string {
    if (this.hashCode !== undefined && this.hashCode != null) {
      return this.hashCode;
    }
    const currentCount = counter++;
    this.hashCode = currentCount.toString();
    return this.hashCode;
  }

  _changeInput(input: Array) {
    const newIO = new IO(new FormValue(input), this.output, this.type, this.hashCode);
    return newIO;
  }

  _changeOutput(output: string) {
    const newIO = new IO(this.input, new FormValue(output), this.type, this.hashCode);
    return newIO;
  }

}
