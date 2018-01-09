// @flow
import React from 'react';
import Transition from 'react-motion-ui-pack';

import Error from './error';

type Props = {
  keyBase?: string,
  errors: Array<string>,
  show: bool,
};

export default ({ errors, keyBase = '', show }: Props) => (
  <Transition
    appear={{ opacity: 0, height: 0 }}
    enter={{ opacity: 1, height: 22 }}
    leave={{ opacity: 0, height: 0, translateY: -3 }}
  >
    {show &&
      errors.map(error => (
        <div key={`${keyBase}-${error}`}>
          <Error className={keyBase} value={error} />
        </div>
      ))
    }
  </Transition>
);

