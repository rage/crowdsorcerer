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
const inputBasicWithReturnInt = `public int kerro(int x, int y) {
    return x * y;
  }`;
const inputBasicWithReturnLong = `public long kerro(long x, long y)
  {
    return x * y;
  }`;
const inputBasicWithReturnFloat = `public float kerro(int x, int y) {
    return x * y;
  }`;
const inputBasicWithReturnDouble = `public double kerro(long x, long y)
  {
    return x * y;
  }`;
const inputBasicWithReturnBoolean = `public boolean kerro(int x, int y) {
    return x * y;
  }`;
const inputBasicWithReturnChar = `public char kerro(long x, long y)
  {
    return x * y;
  }`;
const inputBasicWithReturnByte = `public byte kerro(int x, int y) {
    return x * y;
  }`;
const inputBasicWithReturnString = `public String kerro(long x, long y)
  {
    return x * y;
  }`;
const inputBasicWithReturnShort = `public short kerro(int x, int y) {
    return x * y;
  }`;

test('Basic input without any lines marked', (t) => {
  const output = formSolutionTemplate(inputBasic, []);
  t.deepEqual(output, inputBasic);
});

test('Basic input with float return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnFloat, []);
  t.deepEqual(output, inputBasicWithReturnFloat);
});

test('Basic input with double return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnDouble, []);
  t.deepEqual(output, inputBasicWithReturnDouble);
});

test('Basic input with boolean return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnBoolean, []);
  t.deepEqual(output, inputBasicWithReturnBoolean);
});

test('Basic input with char return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnChar, []);
  t.deepEqual(output, inputBasicWithReturnChar);
});

test('Basic input with string return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnString, []);
  t.deepEqual(output, inputBasicWithReturnString);
});

test('Basic input with byte return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnByte, []);
  t.deepEqual(output, inputBasicWithReturnByte);
});

test('Basic input with short return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnShort, []);
  t.deepEqual(output, inputBasicWithReturnShort);
});

test('Basic input with single line marked', (t) => {
  const modelOutput = `public void kerro(int x, int y) {
// BEGIN SOLUTION
    System.out.print(x * y);
// END SOLUTION
  }`;
  const output = formSolutionTemplate(inputBasic, [1]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with two subsequent lines marked', (t) => {
  const modelOutput = `public void kerro(int x, int y) {
// BEGIN SOLUTION
    System.out.print(x * y);
    System.out.print(x + y);
// END SOLUTION
    System.out.print(x - y);
  }`;
  const output = formSolutionTemplate(inputBasicFewLines, [1, 2]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with two subsequent lines marked', (t) => {
  const modelOutput = `public void kerro(int x, int y) {
// BEGIN SOLUTION
    System.out.print(x * y);
// END SOLUTION
    System.out.print(x + y);
// BEGIN SOLUTION
    System.out.print(x - y);
// END SOLUTION
  }`;
  const output = formSolutionTemplate(inputBasicFewLines, [1, 3]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with int return type', (t) => {
  const output = formSolutionTemplate(inputBasicWithReturnInt, []);
  t.deepEqual(output, inputBasicWithReturnInt);
});

test('Basic input with int return type and single marked line', (t) => {
  const modelOutput = `public int kerro(int x, int y) {
// BEGIN SOLUTION
    return x * y;
// END SOLUTION
// STUB: return 0;
  }`;
  const output = formSolutionTemplate(inputBasicWithReturnInt, [1]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with invalid method signature', (t) => {
  const invalidInput = `public static final
  {}`;
  const modelOutput = `// BEGIN SOLUTION
public static final
// END SOLUTION
  {}`;
  const output = formSolutionTemplate(invalidInput, [0]);
  t.deepEqual(output, modelOutput);
});

test('Basic input with long return type and single marked line', (t) => {
  const modelOutput = `public long kerro(long x, long y)
// BEGIN SOLUTION
  {
// END SOLUTION
    return x * y;
  }`;
  const output = formSolutionTemplate(inputBasicWithReturnLong, [1]);
  t.deepEqual(output, modelOutput);
});

test('Missing brace in input', (t) => {
  const invalidInput = `public long kerro(long x, long y)
  {
    return x * y;`;
  const modelOutput = `public long kerro(long x, long y)
// BEGIN SOLUTION
  {
// END SOLUTION
    return x * y;`;
  const output = formSolutionTemplate(invalidInput, [1]);
  t.deepEqual(output, modelOutput);
});

test('Class constructor in input', (t) => {
  const invalidInput = `public Kerro
  {
    return x * y;`;
  const modelOutput = `public Kerro
// BEGIN SOLUTION
  {
// END SOLUTION
    return x * y;`;
  const output = formSolutionTemplate(invalidInput, [1]);
  t.deepEqual(output, modelOutput);
});

