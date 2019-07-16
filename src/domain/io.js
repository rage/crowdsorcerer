// @flow
import FormValue from 'domain/form-value';

let counter = 0;

export default class IO {

  input: FormValue<Array<Object>>;
  output: FormValue<string>;
  hashCode: ?string;
  type: string;

  constructor(
    input: FormValue<Array<Object>> = new FormValue([{ content: '' }]),
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

  _changeInput(input: Array<Object>) {
    const newIO = new IO(new FormValue(input), this.output, this.type, this.hashCode);
    return newIO;
  }

  _changeOutput(output: string) {
    const newIO = new IO(this.input, new FormValue(output), this.type, this.hashCode);
    return newIO;
  }

}
