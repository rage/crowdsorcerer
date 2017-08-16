// @flow
import FormValue from 'domain/form-value';
import Review from 'state/review/reducer';

export default function mapToObject(input: FormValue<Array<Review>>): Object {
  const object = Object.create(null);
  input.get().forEach((obj) => {
    const key = obj.question;
    const value = obj.review;
    object[key] = value;
  });
  return object;
}
