import test from 'ava';
import formSolutionTemplate from 'utils/solution-template-former';

const inputBasic = `public void kerro(int x, int y) {
    System.out.print(x * y);
  }`;
const inputBasicFewLines = `public void kerro(int x, int y) {
    System.out.print(x * y);
    System.out.print(x + y);
    System.out.print(x - y);
  }`;


test('Basic input without any lines marked', (t) => {
  const output = formSolutionTemplate(inputBasic, []);
  t.deepEqual(output, inputBasic);
});

test('Basic input with single line marked', (t) => {
  const modelOutput = `public void kerro(int x, int y) {
// BEGIN
    System.out.print(x * y);
// END
  }`;
  const output = formSolutionTemplate(inputBasic, [1]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with two subsequent lines marked', (t) => {
  const modelOutput = `public void kerro(int x, int y) {
// BEGIN
    System.out.print(x * y);
    System.out.print(x + y);
// END
    System.out.print(x - y);
  }`;
  const output = formSolutionTemplate(inputBasicFewLines, [1, 2]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with two subsequent lines marked', (t) => {
  const modelOutput = `public void kerro(int x, int y) {
// BEGIN
    System.out.print(x * y);
// END
    System.out.print(x + y);
// BEGIN
    System.out.print(x - y);
// END
  }`;
  const output = formSolutionTemplate(inputBasicFewLines, [1, 3]);
  t.deepEqual(output, modelOutput);
});
