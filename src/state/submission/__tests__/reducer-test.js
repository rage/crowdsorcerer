// @flow
import test from 'ava';
import reducers from 'state/reducer';
import { POST_EXERCISE, POST_UNSUCCESSFUL, RESET_SUBMISSION_STATUS, UPDATE_SUBMISSION_STATUS } from 'state/submission';
import { STATUS_NONE, STATUS_IN_PROGRESS, STATUS_ERROR } from 'state/submission/reducer';

test('POST changes status to in progress', (t) => {
  const reducer = reducers('1');
  const state = reducer(
    { submission:
    {
      status: '',
      message: '',
      progress: 0,
      result: {},
    },
    },
    {
      message: 'POST_SUCCESSFUL_MSG',
      type: POST_EXERCISE,
    },
  );
  t.deepEqual(state.submission.status, STATUS_IN_PROGRESS);
});

test('unsuccessful POST changes status to in error', (t) => {
  const reducer = reducers('1');
  const state = reducer(
    { submission:
    {
      status: '',
      message: '',
      progress: 0,
      result: {},
    },
    },
    {
      message: 'POST_SUCCESSFUL_MSG',
      type: POST_UNSUCCESSFUL,
    },
  );
  t.deepEqual(state.submission.status, STATUS_ERROR);
});


test('resetting state works correctly', (t) => {
  const reducer = reducers('1');
  const state = reducer(
    { submission:
    {
      status: 'error',
      message: 'voi ei',
      progress: 1,
      result: {},
    },
    },
    {
      type: RESET_SUBMISSION_STATUS,
    },
  );
  t.deepEqual(state.submission.status, STATUS_NONE);
  t.deepEqual(state.submission.message, '');
  t.deepEqual(state.submission.progress, undefined);
  t.deepEqual(state.submission.result, { OK: false, error: [] });
});

test('update changes state accordign to data', (t) => {
  const reducer = reducers('1');
  const data = {
    message: 'message',
    status: 'status',
    progress: 0.5,
    result: { OK: false, error: '' },
  };
  const state = reducer(
    { submission:
    {
      status: '',
      message: '',
      progress: 1,
      result: {},
    },
    },
    {
      data,
      type: UPDATE_SUBMISSION_STATUS,
    },
  );
  t.deepEqual(state.submission.status, data.status);
  t.deepEqual(state.submission.message, data.message);
  t.deepEqual(state.submission.progress, data.progress);
  t.deepEqual(state.submission.result, data.result);
});

