// @flow
import React from 'react';
import prefixer from 'utils/class-name-prefixer';

export default ({ readOnly, onShowCodeTemplate, showCodeTemplate }:
   { readOnly: boolean, onShowCodeTemplate: () => void, showCodeTemplate: boolean}) => {
  let templateButtonClass = prefixer('toggle-show-code-template-button');
  let modelSolutionButtonClass = prefixer('toggle-show-code-template-button');
  if (showCodeTemplate) {
    templateButtonClass += ` ${prefixer('active')}`;
  } else {
    modelSolutionButtonClass += ` ${prefixer('active')}`;
  }
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
        Code template
      </button>
        <button
          className={modelSolutionButtonClass}
          onClick={(e) => {
            e.preventDefault();
            onShowCodeTemplate(false);
          }}
        >
        Model solution
      </button>
      </div>
    </div>
  );
};
