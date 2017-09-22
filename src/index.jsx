import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import makeStore from 'state/store';
import Api from 'utils/api';
import { State as sState } from 'slate';
import FatalErrorDisplay from 'components/fatal-error-display';
import prefixer from 'utils/class-name-prefixer';
import loggedIn from 'utils/logged-in';
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


window.initCrowdsorcerer = function initCrowdsorcerer() {
  document.querySelectorAll('.crowdsorcerer-widget').forEach((e) => {
    const assignmentId = e.dataset.assignment;
    const exerciseCount = e.dataset.exercises;
    const review = e.getAttribute('peer-review') !== null;
    if (!loggedIn()) {
      render(
        <div className={`${prefixer('container')} ${prefixer('center')}`}>
          <FatalErrorDisplay message={'Sinun on oltava kirjautuneena nähdäksesi tämän sisällön'} />
        </div>,
      e,
    );
    } else if (review) {
      const api = new Api();
      api.getReviewableExerciseAndQuestions(assignmentId, exerciseCount).then((resp: ReviewJSON) => {
        const exercises = resp.exercises;
        exercises.forEach((exercise, i) => {
          const store = makeStore(assignmentId, review, exercise, resp.peer_review_questions, resp.tags, i);
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
