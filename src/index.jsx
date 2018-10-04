import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import makeStore from 'state/store';
import Api from 'utils/api';
import { State as sState } from 'slate';
import FatalErrorDisplay from 'components/fatal-error-display';
import prefixer from 'utils/class-name-prefixer';
import * as storejs from 'store';
import type { Tag, TestIO } from './form';
import './styles';
import App from './components/app';
import type PeerReviewQuestion from './review';

type ReviewJSON = {
  exercises: [
    {
      id: number,
      status: string,
      testiIO : Array<TestIO>,
      description: sState,
      template: string,
      model_solution: string,
    }
  ],
  peer_review_questions: Array<PeerReviewQuestion>,
  tags: Array<Tag>,
};

const initReview = (e, assignmentId, exerciseCount, review) => {
  e.innerHTML = '';
  const api = new Api();
  api.getReviewableExerciseAndQuestions(assignmentId, exerciseCount).then((resp: ReviewJSON) => {
    const exercises = resp.exercises;
    exercises.forEach((exercise, i) => {
      const store = makeStore(assignmentId, review, exercise, resp.peer_review_questions, resp.tags, resp.testing_type, i);
      render(
        <Provider store={store}>
          <App review />
        </Provider>,
        e.appendChild(document.createElement('DIV')),
      );
    });
  }, (err) => {
    let errors = err.message ? err.message : 'Tapahtui sisäinen virhe';
    if (err.errors) {
      errors = err.errors.map(error => error.message).join('\n');
    }
    render(
      <div className={`${prefixer('container')} ${prefixer('center')}`}>
        <FatalErrorDisplay message={errors} />
      </div>,
    e,
    );
  });
};
window.initCrowdsorcerer = function initCrowdsorcerer() {
  document.querySelectorAll('.crowdsorcerer-widget').forEach((e) => {
    const assignmentId = e.dataset.assignment;
    const exerciseCount = e.dataset.exercises;
    const review = e.getAttribute('peer-review') !== null;
    if (review) {
      let lastUser = storejs.get('tmc.user');
      setInterval(() => {
        const tmcUser = storejs.get('tmc.user');
        const username = tmcUser ? tmcUser.username : '';
        const lastUsername = lastUser ? lastUser.username : '';
        if (username !== lastUsername && username === '') {
          initReview(e, assignmentId, exerciseCount, review);
        }
        lastUser = tmcUser;
      }, 500);
      initReview(e, assignmentId, exerciseCount, review);
    } else {
      const store = makeStore(assignmentId, review);
      render(
        <Provider store={store}>
          <App />
        </Provider>,
        e,
      );
    }
  });
};
