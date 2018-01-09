// @lofw
import type { State as FormState } from 'components/assignment-form';
import type { State as ReviewState } from 'components/review';
import FormValue from 'domain/form-value';

type FieldValidator = {
  field: string,
  validator: (FormValue) => Array<string>,
};

export default (validators: Array<FieldValidator>, state: FormState | ReviewState) => {
  const validationResults = [];
  validators.forEach((entry) => {
    const fieldName = entry.field;
    const validator = entry.validator;
    const fieldsArray = fieldName.split(':');
    let errors;
    let field;
    if (fieldsArray.length === 1) {
      field = state[fieldName];
    } else {
      field = fieldsArray.reduce((a, c) => a[c], state);
    }
    if (field instanceof Array) {
      field.forEach((entity) => {
        if (entity instanceof FormValue) {
          errors = validator(entity);
          entity._setErrors(errors);
          validationResults.push(errors.length === 0);
        } else {
          Object.entries(entity).forEach(([, value]) => {
            if (value instanceof FormValue) {
              errors = validator(value);
              value._setErrors(errors);
              validationResults.push(errors.length === 0);
            }
          });
        }
      });
    } else if (field instanceof FormValue) {
      errors = validator(field);
      field._setErrors(errors);
      validationResults.push(errors.length === 0);
    } else if (field !== undefined) {
      Object.entries(field).forEach(([, value]) => {
        if (value instanceof FormValue) {
          errors = validator(value);
          value._setErrors(errors);
          validationResults.push(errors.length === 0);
        }
      });
    }
  });
  const valid = validationResults.every(o => o);
  return valid;
};
