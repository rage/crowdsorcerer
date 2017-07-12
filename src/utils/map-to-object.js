// @flow
export default function mapToObject(input: Map<string, any>): Object {
  const object = Object.create(null);
  input.forEach((value, key) => {
    object[key] = value;
  });
  return object;
}
