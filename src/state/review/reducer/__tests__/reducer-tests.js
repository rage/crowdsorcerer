// @flow
import test from 'ava';
import reducers from 'state/reducer';
import { CHANGE_COMMENT } from 'state/review/actions';
import FormValue from 'domain/form-value';

const initalReviews = [
  new FormValue({ question: 'Tehtävänannon mielekkyys', review: undefined }),
  new FormValue({ question: 'Testien kattavuus', review: undefined }),
  new FormValue({
    question: 'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys', review: undefined,
  })];

test('empty review is not valid', (t) => {
  const reducer = reducers('1');
  const state = reducer(
    { review:
    {
      reviews: initalReviews,
      comment: '',
      valid: false,
      showErrors: false,
      reviewable: 2,
    },
    },
    {
      comment: '     ',
      type: CHANGE_COMMENT,
    },
  );

  t.deepEqual(state.review.valid, false);
});
