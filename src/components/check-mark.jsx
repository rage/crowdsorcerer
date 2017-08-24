// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';
import Transition from 'react-motion-ui-pack';

type Props = {
  reviewable: number,
  formDone: boolean,
  reviewDone: boolean,
};

export default ({ reviewable, formDone, reviewDone }: Props) => {
  if ((reviewable === undefined && formDone) || (reviewable !== undefined && reviewDone)) {
    return (
      <Transition
        appear={{ opacity: 0 }}
        leave={{ opacity: 0 }}
      >
        <div key="check-mark" className={prefixer('check-mark')} />
      </Transition>
    );
  }
  return null;
};
