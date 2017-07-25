// @flow
import React from 'react';
import Transition from 'react-motion-ui-pack';

import Error from './error';

type Props = {
  keyBase: string,
  errors: Array<string>,
  show: bool,
}

export default ({ errors, keyBase, show }: Props) => (
  <div>
    { show &&
    <Transition
      enter={{ opacity: 1, height: 16 }}
      leave={{ opacity: 0, height: 0, transitionY: -3 }}
    >
      {errors.map(error => <Error value={error} key={`${keyBase}-${error}`} />)}
    </Transition>

  }
  </div>
);
