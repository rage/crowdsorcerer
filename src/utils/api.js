// @flow
import { Raw } from 'slate';
import type { Store } from 'redux';
import type { State as FormState } from 'state/form';

const SERVER = 'http://localhost:3000';

export default class Api {

  store: Store<any>;

  fetchNewShit(): Promise<{ zip_url: string }> {
    return Promise.resolve({ zip_url: 'https://example.com/lol.zip' });
  }

  createJSON(state: FormState) {
    const IOArray = state.inputOutput.map(IO => ({ input: IO.input, output: IO.output }));
    return (
    {
      oauth_token: process.env.TMC_TOKEN,
      exercise: {
        assignment_id: 1,
        description: Raw.serialize(state.assignment),
        code: state.modelSolution,
        testIO: IOArray,
      },
    }
    );
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
      }).then(resp => resp.json())
      .then((response) => {
        debugger;
        console.log('response:'.concat(response.toString()));

        // resolve(response.text());
      }, (error) => {
        console.log('error'.concat(error.toString()));
        // reject(error); //= > String
      });
    });
  }

  syncStore(store: Store): void {
    this.store = store;
  }
}
