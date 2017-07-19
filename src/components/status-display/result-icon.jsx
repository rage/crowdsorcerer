// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { ResultType } from 'state/submission/reducer';
import { STATUS_FINISHED } from 'state/submission/reducer';

type Props = {
  status: string,
  result: ResultType,
};

export default ({ status, result }: Props) => {
  let resultClassName = prefixer('spinner');
  if (status === STATUS_FINISHED) {
    resultClassName = result.OK ? prefixer('check-mark') : prefixer('sad-face');
  } else {
    resultClassName = prefixer('sad-face');
  }
  return (
    <div className={resultClassName} />
  );
};
