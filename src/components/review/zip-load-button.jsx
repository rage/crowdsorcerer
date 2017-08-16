// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';
import { SERVER_ADDR } from 'utils/api/index';

type Props = {
  message: string,
  exerciseId: number,
  zipType: string,
};

export default ({ message, exerciseId, zipType }: Props) => (
  <a
    href={`${SERVER_ADDR}/exercises/${exerciseId}/${zipType}.zip`}
    className={prefixer('info-button')}
    role="button"
    target="_blank"
    rel="noopener noreferrer"
  >{message}
  </a>
  );
