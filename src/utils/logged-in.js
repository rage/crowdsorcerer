// @flow
import * as storejs from 'store';

export default function loggedIn(): boolean {
  const tmcUser = storejs.get('tmc.user');
  if (tmcUser === undefined || !Object.prototype.hasOwnProperty.call(tmcUser, 'username')) {
    return false;
  }
  return tmcUser.username.length > 0;
}
