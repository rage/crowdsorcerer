import { isReadOnlyTag } from './get-read-only-lines';

export default (boilerplate) => {
  const cleanPlate = [];
  if (boilerplate) {
    boilerplate.split('\n').forEach((row) => {
      if (!isReadOnlyTag(row)) {
        cleanPlate.push(row);
      }
    });
  }
  return cleanPlate.join('\n');
};

