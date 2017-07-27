// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';

type Props = {
  value: string,
};

export default ({ value }: Props) => (
  <div className={prefixer('error')}>{ value }</div>
  );
