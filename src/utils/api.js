// @flow
import { Raw } from 'slate';
import type { Store } from 'redux';
import type { State as FormState } from 'state/form';
import formSolutionTemplate from 'utils/solution-template-former';
import ActionCable from 'actioncable';
import * as storejs from 'store';

let SERVER;
let SOCKET_SERVER;

/* eslint-disable no-const-assign */
if (process.env.NODE_ENV === 'production') {
  SERVER = 'https://crowdsorcerer.testmycode.io/';
  SOCKET_SERVER = 'wss://crowdsorcerer.testmycode.io/cable';
} else {
  SERVER = 'http://localhost:3000/';
  SOCKET_SERVER = 'ws://localhost:3000/cable';
}
/* eslint-enable no-const-assign */

const JSON_FIELDS = ['status', 'message', 'progress', 'result'];

export default class Api {

  store: Store<any>;
  cable: ActionCable.Cable;
  connection: ActionCable.Channel;
  deleteSubscription: Function;

  createJSON(state: FormState): Object {
    const IOArray = state.inputOutput.map(IO => ({ input: IO.input, output: IO.output }));
    const parsedForm = formSolutionTemplate(state.modelSolution, state.solutionRows);
    return (
    {
      oauth_token: this.oauthToken(),
      exercise: {
        assignment_id: 1,
        description: Raw.serialize(state.assignment),
        code: parsedForm,
        testIO: IOArray,
      },
    }
    );
  }

  deleteSubscription() {
    this.connection.unsubscribe();
  }

  createSubscription(
    onUpdate: (result: Object) => void,
    onDisconnected: () => void,
    onInvalidDataError: () => void,
    sentExerciseId: number,
    ): void {
    this.cable = ActionCable.createConsumer(this._addExtraParamsToUrl(SOCKET_SERVER, sentExerciseId));
    this._subscribe(onUpdate, onDisconnected, onInvalidDataError, sentExerciseId);
  }

  _subscribe(
    onUpdate: (result: Object) => void,
    onDisconnected: () => void,
    onInvalidDataError: () => void,
    exerciseId: number,
    ): void {
    const connection = this.cable.subscriptions.create('SubmissionStatusChannel', {
      connected() {
        // ask for current state from server in case socket open too late
        connection.send({ ping: true, id: exerciseId });
      },
      disconnected() {
        onDisconnected();
      },
      received(data) {
        console.info(data);
        let result = {};
        try {
          result = JSON.parse(data);
          if (!Api._correctJSON(result)) {
            throw SyntaxError('Data väärässä muodossa');
          }
        } catch (error) {
          console.error(`error: ${error}`);
          onInvalidDataError();
        }
        onUpdate(result);
      },
    });
    this.connection = connection;
  }

  postForm(state: FormState): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = this.createJSON(state);
      fetch(`${SERVER}/exercises`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
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

  syncStore(store: Store): void {
    this.store = store;
  }

  static _correctJSON(JSON: Object): boolean {
    let valid = true;
    JSON_FIELDS.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(JSON, field)) {
        valid = false;
      }
    });
    return valid;
  }

  _addExtraParamsToUrl(url: string, exerciseId: number): string {
    return `${url}?oauth_token=${this.oauthToken()}&exercise_id=${exerciseId}`;
  }

  oauthToken(): string {
    return storejs.get('tmc.user').accessToken;
  }
}
