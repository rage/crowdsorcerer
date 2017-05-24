// @flow
import type { Store } from 'redux';

export default class Api {
  store: Store<any>;

  fetchNewShit(): Promise<{zip_url: string}> {
    return Promise.resolve({ zip_url: 'https://example.com/lol.zip' });
  }

  syncStore(store: Store): void {
    this.store = store;
  }
}
