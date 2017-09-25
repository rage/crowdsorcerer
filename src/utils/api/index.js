// @flow
import { Raw } from 'slate';
import type { Store } from 'redux';
import type { State as FormState } from 'state/form';
import type { State as ReviewState } from 'state/review';
import type { State as AssignmentState } from 'state/assignment';
import formSolutionTemplate from 'utils/solution-template-former';
import * as storejs from 'store';
import formValueToObject from 'utils/form-value-to-object';
import WebSocketConnection from './websocket';

let SERVER;
let SOCKET_SERVER;

/* eslint-disable no-const-assign */
if (process.env.NODE_ENV === 'production') {
  SERVER = 'https://crowdsorcerer.testmycode.io/api/v0';
  SOCKET_SERVER = 'wss://crowdsorcerer.testmycode.io/cable';
} else {
  SERVER = 'http://localhost:3000/api/v0';
  SOCKET_SERVER = 'ws://localhost:3000/cable';
}
/* eslint-enable no-const-assign */
export const SERVER_ADDR = SERVER;

export default class Api {

  store: Store<any>;
  ws: WebSocketConnection;

  postForm(formstate: FormState, assignmentState: AssignmentState): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = this._createFormJSON(formstate, assignmentState);
      fetch(`${SERVER}/exercises`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      })
      .then((resp) => {
        if (!resp.ok) {
          return reject(resp);
        }
        return resp.json();
      })
      .then(resolve, reject);
    });
  }

  postReview(reviewState: ReviewState, formState: FormState): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = this._createReviewJSON(reviewState, formState);
      fetch(`${SERVER}/peer_reviews`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      })
      .then((resp) => {
        if (!resp.ok) {
          return reject(resp.status);
        }
        return resp.json();
      })
      .then(resolve, reject);
    });
  }

  async getReviewableExerciseAndQuestions(assignmentId: number, exerciseCount: number): Promise<any> {
    return (
      fetch(
        `${SERVER}/assignments/${assignmentId}/peer_review_exercise?count=${exerciseCount}&oauth_token=${this.oauthToken()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        },
      )
      .then(async (resp) => {
        if (!resp.ok) {
          throw await resp.json();
        }
        return resp.json();
      })
      .then((json) => {
        if (!json.exercises || json.exercises.some(e => !e)) {
          throw new Error('Arvioitavia tehtäviä ei löytynyt.');
        }
        return json;
      })
    );
  }

  getAssignmentInformation(assignmentId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${SERVER}/assignments/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
      })
      .then((resp) => {
        if (!resp.ok) {
          return reject(resp);
        }
        return resp.json();
      })
      .then(resolve, reject);
    });
  }

  syncStore(store: Store): void {
    this.store = store;
  }

  createSubscription(
    onUpdate: (result: Object) => void,
    onDisconnected: () => void,
    onInvalidDataError: () => void,
    sentExerciseId: number,
  ): void {
    this.ws = new WebSocketConnection(this.oauthToken(), SOCKET_SERVER);
    this.ws.createSubscription(onUpdate, onDisconnected, onInvalidDataError, sentExerciseId);
  }

  deleteSubscription(): void {
    this.ws.deleteSubscription();
  }

  _createFormJSON(formState: FormState, assignmentState: AssignmentState): Object {
    const IOArray = formState.inputOutput.map(IO => ({ input: IO.input.get(), output: IO.output.get() }));
    if (!formState.modelSolution.editableModelSolution) {
      return {};
    }
    const parsedForm =
      formSolutionTemplate(formState.modelSolution.editableModelSolution.get(), formState.modelSolution.solutionRows);
    return (
    {
      oauth_token: this.oauthToken(),
      exercise: {
        assignment_id: assignmentState.assignmentId,
        description: Raw.serialize(formState.assignment.get(), { terse: true }),
        code: parsedForm,
        testIO: IOArray,
        tags: formState.tags.get(),
      },
    }
    );
  }

  _createReviewJSON(reviewState: ReviewState, formState: FormState): Object {
    let answers = [];
    if (reviewState.reviews) {
      answers = formValueToObject(reviewState.reviews);
    }
    return (
    {
      oauth_token: this.oauthToken(),
      exercise: {
        exercise_id: reviewState.reviewable,
        tags: formState.tags.get(),
      },
      peer_review: {
        comment: reviewState.comment.get(),
        answers,
      },
    }
    );
  }

  oauthToken(): string {
    if (!storejs.get('tmc.user')) {
      return '';
    }
    return storejs.get('tmc.user').accessToken;
  }
}
