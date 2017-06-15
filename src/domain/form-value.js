// @flow
export default class FormValue<T> {
  value: T
  errors: Array<string>

  constuctor(value: T, errors : Array<string> = []) {
    this.value = value;
    this.errors = errors;
  }

  get(): T {
    return this.value;
  }

  errors(): Array<string> {
    return this.errors;
  }

  _setErrors(errors: Array<string>) {
    this.errors = errors;
  }
}
