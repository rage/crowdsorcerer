// @flow

const LOCK_FROM_BEGINNING = '// LOCK FROM BEGINNING';
const LOCK_TO_END = '// LOCK TO END';
const START_LOCK = '// START LOCK';
const END_LOCK = '// END LOCK';

export default (code: string) => {
  if (!code) {
    return [];
  }
  const readOnlyLines = [];
  const lines = code.split('\n');
  let amountOfTags = 0;
  let lockStarted = false;
  lines
    .map(l => l.trim())
    .forEach((line, index) => {
      if (line === LOCK_TO_END) {
        for (let i = index + 1; i < lines.length - 1; i++) {
          readOnlyLines.push(i - amountOfTags);
        }
        amountOfTags++;
      } else if (line === LOCK_FROM_BEGINNING) {
        for (let i = 0; i < index; i++) {
          readOnlyLines.push(i - amountOfTags);
        }
        amountOfTags++;
      } else if (line === START_LOCK) {
        amountOfTags++;
        lockStarted = true;
      } else if (line === END_LOCK) {
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
  return cleaned === LOCK_FROM_BEGINNING ||
    cleaned === LOCK_TO_END ||
    cleaned === START_LOCK ||
    cleaned === END_LOCK;
}
