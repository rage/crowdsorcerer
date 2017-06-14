// @flow
import { Raw } from 'slate';
import type { Store } from 'redux';
import type { State as FormState } from 'state/form';
import formSolutionTemplate from 'utils/solution-template-former';
import ActionCable from 'actioncable';

const SERVER = 'http://localhost:3000';
const SOCKET_SERVER = 'wss://localhost:3000/cable';

export default class Api {

  store: Store<any>;
  // App:

  // fetchNewShit(): Promise<{ zip_url: string }> {
  //   return Promise.resolve({ zip_url: 'https://example.com/lol.zip' });
  // }

  createJSON(state: FormState) {
    const IOArray = state.inputOutput.map(IO => ({ input: IO.input, output: IO.output }));
    const parsedForm = formSolutionTemplate(state.modelSolution, state.solutionRows);
    return (
    {
      oauth_token: process.env.TMC_TOKEN,
      exercise: {
        assignment_id: 1,
        description: Raw.serialize(state.assignment),
        code: parsedForm,
        testIO: IOArray,
      },
    }
    );
  }

  createSubscription(onUpdate: () => void) {
    const cable = ActionCable.createConsumer(SOCKET_SERVER);

    const room = cable.subscriptions.create('SubmissionStatusChannel', {
      connected() {
        console.info('connected');
      },
      disconnected() {},
      received() {},
    });
    onUpdate.call();
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
      .then(resp => resp.json())
      .then(resolve, reject);
    });
  }

  syncStore(store: Store): void {
    this.store = store;
  }
}
