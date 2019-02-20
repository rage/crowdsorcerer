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

/* eslint-disable */
try {
  require('babel-polyfill');
} catch (e) {
}		
/* eslint-enable */

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

class CrowdSorcerer extends React.Component {
  state = {
    prData: undefined,
    error: undefined,
  }

  async componentDidMount() {
    if (!this.props.review) {
      return;
    }
    await this.fetchPrData();
  }

  async fetchPrData() {
    const api = new Api();
    try {
      const resp = await api.getReviewableExerciseAndQuestions(this.props.assignmentId, this.props.exercises);
      this.setState({
        prData: resp,
      });
    } catch (err) {
      let errors = err.message ? err.message : 'Tapahtui sisäinen virhe';
      if (err.errors) {
        errors = err.errors.map(error => error.message).join('\n');
      }
      this.setState({
        error: errors,
      });
    }
  }

  render() {
    const { assignmentId, review } = this.props;
    if (!review) {
      const store = makeStore(assignmentId, review);
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
    if (this.state.error) {
      return (
        <div className={`${prefixer('container')} ${prefixer('center')}`}>
          <FatalErrorDisplay message={this.state.error} />
        </div>
      );
    }
    if (!this.state.prData) {
      return <div>Loading...</div>;
    }
    const exercises = this.state.prData.exercises;
    return (<div>
      {exercises.map((exercise, i) => {
        const prStore = makeStore(assignmentId, review, exercise, this.state.prData.peer_review_questions,
          this.state.prData.tags, this.state.prData.testing_type, i);
        return (
          <Provider store={prStore}>
            <App review />
          </Provider>
        );
      })}
    </div>);
  }
}


if (typeof window !== 'undefined') {
  window.initCrowdsorcerer = function initCrowdsorcerer() {
    document.querySelectorAll('.crowdsorcerer-widget').forEach((e) => {
      const assignmentId = e.dataset.assignmentid;
      const exerciseCount = e.dataset.exercises;
      const review = e.getAttribute('peerreview') !== null;

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
        render(<CrowdSorcerer assignmentId={assignmentId} review={review} />, e);
      }
    });
  };
}

export default CrowdSorcerer;
