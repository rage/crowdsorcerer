// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';
import Transition from 'react-motion-ui-pack';

export default ({ message }: { message: string }) => (
  <div className={prefixer('fatal-error-display')}>
    <Transition
      appear={{ opacity: 0 }}
      leave={{ opacity: 0 }}
    >
      <div key="fatal-error-title" className={prefixer('fatal-error-title')}>
      Whoopsie
    </div>
      <div key="fatal-error-message" className={prefixer('fatal-error-message')}>
        {message}
      </div>
    </Transition>
  </div>
);
