// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { ErrorResult } from 'state/submission/reducer';
import { STATUS_FINISHED, STATUS_ERROR } from 'state/submission/';

type Props = {
  status: string,
  result: ErrorResult,
};

export default ({ status, result }: Props) => {
  let resultClassName = prefixer('spinner');
  if (status === STATUS_FINISHED) {
    resultClassName = result.OK ? prefixer('check-mark') : prefixer('sad-face');
  } else if (status === STATUS_ERROR) {
    resultClassName = prefixer('sad-face');
  }
  return (
    <div className={resultClassName} />
  );
};
