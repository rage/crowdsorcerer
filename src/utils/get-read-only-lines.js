// @flow

const LOCK_FROM_BEGINNING = '// LOCK FROM BEGINNING';
const LOCK_TO_END = '// LOCK TO END';
const START_LOCK = '// START LOCK';
const END_LOCK = '// END LOCK';

export default (code: string) => {
  if (code.trim() === '') {
    return [];
  }
  const readOnlyLines = [];
  const lines = code.split('\n');
  let amountOfTags = 0;
  let lockStarted = false;
  lines
    .map(l => l.trim())
    .forEach((line, index) => {
      if (line.localeCompare(LOCK_TO_END) === 0) {
        for (let i = index + 1; i < lines.length - 1; i++) {
          readOnlyLines.push(i - amountOfTags);
        }
        amountOfTags++;
      } else if (line.localeCompare(LOCK_FROM_BEGINNING) === 0) {
        for (let i = 0; i < index; i++) {
          readOnlyLines.push(i - amountOfTags);
        }
        amountOfTags++;
      } else if (line.localeCompare(START_LOCK) === 0) {
        amountOfTags++;
        lockStarted = true;
      } else if (line.localeCompare(END_LOCK) === 0) {
        amountOfTags++;
        lockStarted = false;
      } else if (lockStarted) {
        readOnlyLines.push(index - amountOfTags);
      }
    });
  return readOnlyLines;
};

export function isReadOnlyTag(line: string) {
  const cleaned = line.trim();
  return cleaned.localeCompare(LOCK_FROM_BEGINNING) === 0 ||
    cleaned.localeCompare(LOCK_TO_END) === 0 ||
    cleaned.localeCompare(START_LOCK) === 0 ||
    cleaned.localeCompare(END_LOCK) === 0;
}
