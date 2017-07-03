// @flow
import * as storejs from 'store';

export default function loggedIn(): boolean {
  const tmcUser = storejs.get('tmc.user');
  if (tmcUser === undefined || !Object.prototype.hasOwnProperty.call(tmcUser, 'accessToken')) {
    return false;
  }
  return tmcUser.accessToken.length > 0;
}
