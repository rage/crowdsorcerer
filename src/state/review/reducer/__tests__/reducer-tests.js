// @flow
import test from 'ava';
import reducers from 'state/reducer';
import { CHANGE_COMMENT, GIVE_REVIEW } from 'state/review/actions';
import FormValue from 'domain/form-value';

const initalReviews = new FormValue([
  { question: 'Tehtävänannon mielekkyys', review: undefined },
  { question: 'Testien kattavuus', review: undefined },
  {
    question: 'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys', review: undefined,
  }]);

const reviewsWithContent = new FormValue([
    { question: 'Tehtävänannon mielekkyys', review: 1 },
    { question: 'Testien kattavuus', review: 2 },
  {
    question: 'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys', review: 3,
  }]);

const reducer = reducers(1);

test('empty review is not valid', (t) => {
  const state = reducer(
    { review:
    {
      reviews: initalReviews,
      comment: new FormValue(''),
      valid: false,
      showErrors: false,
      reviewable: 2,
    },
    },
    {
      comment: 'Hienoa koodia hermanni',
      type: CHANGE_COMMENT,
    },
  );
  t.deepEqual(state.review.valid, false);
});

test('adding a comment changes comment in state', (t) => {
  const state = reducer(
    { review:
    {
      reviews: initalReviews,
      comment: new FormValue(''),
      valid: false,
      showErrors: false,
      reviewable: 2,
    },
    },
    {
      comment: 'Hienoa koodia hermanni',
      type: CHANGE_COMMENT,
    },
  );
  t.deepEqual(state.review.comment.get(), 'Hienoa koodia hermanni');
});

test('adding a review changes reviews in state', (t) => {
  const state = reducer(
    { review:
    {
      reviews: initalReviews,
      comment: new FormValue(''),
      valid: false,
      showErrors: false,
      reviewable: 2,
    },
    },
    {
      question: 'Tehtävänannon mielekkyys',
      value: 1,
      type: GIVE_REVIEW,
    },
  );
  t.deepEqual(state.review.reviews.get(), [
    { question: 'Tehtävänannon mielekkyys', review: 1 },
    { question: 'Testien kattavuus', review: undefined },
    {
      question: 'Epätodennäköisen pitkä ja luultavasti vaikeasti ymmärrettävä vertaisarviointikysymys', review: undefined,
    }]);
});

test('empty comment is not valid', (t) => {
  const state = reducer(
    { review:
    {
      reviews: reviewsWithContent,
      comment: new FormValue(''),
      valid: false,
      showErrors: false,
      reviewable: 2,
    },
    },
    {
      comment: '            ',
      type: CHANGE_COMMENT,
    },
  );
  t.deepEqual(state.review.valid, false);
});

test('is valid with reviews and comment', (t) => {
  const state = reducer(
    { review:
    {
      reviews: reviewsWithContent,
      comment: new FormValue(''),
      valid: false,
      showErrors: false,
      reviewable: 2,
    },
    },
    {
      comment: 'Vedät ihan superhyvin',
      type: CHANGE_COMMENT,
    },
  );
  t.deepEqual(state.review.valid, true);
});

