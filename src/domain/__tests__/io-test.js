import test from 'ava';
import IO from 'domain/io';

test('Basic input without any lines marked', (t) => {
  const tstIO = new IO();
  const hashCode = tstIO.hash();
  const hashCode2 = tstIO.hash();
  t.deepEqual(tstIO, tstIO);
  t.deepEqual(hashCode, '0');
  t.deepEqual(hashCode2, '0');
});

