// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { formSubmitButtonPressedAction, deleteMarkersAction, changePreviewStateAction } from 'state/form';

class Preview extends Component {
  props: {
    handleSubmit: () => void,
    handleClosePreview: () => void,
    previewState: boolean,
  }

  render() {
    let previewDisplay = prefixer('hidden');
    if (this.props.previewState) {
      previewDisplay = prefixer('preview-display');
    }
    return (
      <div className={previewDisplay}>
        <div className={prefixer('preview-2')}>
          <div className={prefixer('preview-3')}>
            äääää
          </div>
          <button
            type="button"
            className={prefixer('sender')}
            onClick={(e) => {
              e.preventDefault();
              this.props.handleSubmit();
              this.props.handleClosePreview();
            }}
          >
            Lähetä ihan oikeesti
          </button>
          <button
            type="button"
            className={prefixer('eiku')}
            onClick={(e) => {
              e.preventDefault();
              this.props.handleClosePreview();
            }}
          >
            Eiku
          </button>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state: State) {
  return {
    previewState: state.form.previewState,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(deleteMarkersAction());
      dispatch(formSubmitButtonPressedAction());
    },
    handleClosePreview() {
      dispatch(changePreviewStateAction(false));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
