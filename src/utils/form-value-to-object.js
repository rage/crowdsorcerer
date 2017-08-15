// @flow
import FormValue from 'domain/form-value';
import Review from 'state/review/reducer';

export default function mapToObject(input: FormValue<Array<Review>>): Object {
  const object = Object.create(null);
  input.forEach((fVal) => {
    const key = fVal.get().question;
    const value = fVal.get().review;
    object[key] = value;
  });
  return object;
}
