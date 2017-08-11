// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';

export default ({ readOnly, onShowCodeTemplate, showCodeTemplate }:
   { readOnly: boolean, onShowCodeTemplate: () => void, showCodeTemplate: boolean}) => {
  const templateButtonClass = showCodeTemplate
  ? `${prefixer('toggle-show-code-template-button')} ${prefixer('active')}`
  : prefixer('toggle-show-code-template-button');
  const modelSolutionButtonClass = showCodeTemplate
  ? prefixer('toggle-show-code-template-button')
  : `${prefixer('toggle-show-code-template-button')} ${prefixer('active')}`;
  if (!readOnly) {
    return null;
  }
  return (
    <div className={prefixer('containerception')}>
      <div className={prefixer('toggle-show-button-container')} >
        <button
          className={templateButtonClass}
          onClick={(e) => {
            e.preventDefault();
            onShowCodeTemplate(true);
          }}
        >
        Tehtäväpohja
      </button>
        <button
          className={modelSolutionButtonClass}
          onClick={(e) => {
            e.preventDefault();
            onShowCodeTemplate(false);
          }}
        >
        Mallivastaus
      </button>
      </div>
    </div>
  );
};
