// @flow
import Transition from 'react-motion-ui-pack';
import React from 'react';
import prefixer from 'utils/class-name-prefixer';

type Props = {
  type: string,
  onClick : (oldType: string, index: number) => void,
  index: number,
};

export default ({ type, onClick, index }: Props) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick(type, index);
    }}
    className={prefixer('test-type-button')}
    aria-label="Toggle test type"
  >
    <Transition
      enter={{
        height: 1,
        opacity: 1,
      }}
      leave={{
        height: 0,
        opacity: 0,
      }}
    >
      <div key={type} className={prefixer(type)} />
    </Transition>
  </button>
  );
