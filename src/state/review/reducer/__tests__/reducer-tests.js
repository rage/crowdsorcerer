// @flow
import test from 'ava';
import reducers from 'state/reducer';
import { GIVE_REVIEW } from 'state/review/actions';

test('wont accept negative reviews', (t) => {
  const reducer = reducers('1');
  const state = reducer(
    { review:
    {
      reviews: new Map(),
      reviewQuestions:
      ['Tehtävänannon mielekkyys'],
      comment: '',
      valid: false,
      showErrors: false,
      errors: new Map(),
      reviewable: 2,
    },
    },
    {
      question: 'Tehtävänannon mielekkyys',
      value: -273,
      type: GIVE_REVIEW,
    },
  );

  const result = new Map();
  result.set('Tehtävänannon mielekkyys', 1);
  t.deepEqual(state.review.reviews, result);
});

test('wont accept reviews over 5', (t) => {
  const reducer = reducers('1');
  const state = reducer(
    { review:
    {
      reviews: new Map(),
      reviewQuestions:
      ['Tehtävänannon mielekkyys'],
      comment: '',
      valid: false,
      showErrors: false,
      errors: new Map(),
      reviewable: 2,
    },
    },
    {
      question: 'Tehtävänannon mielekkyys',
      value: 666,
      type: GIVE_REVIEW,
    },
  );
  const result = new Map();
  result.set('Tehtävänannon mielekkyys', 5);
  t.deepEqual(state.review.reviews, result);
});
