// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';

class Preview extends Component {
  props: {
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

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
