// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State } from 'state/reducer';
import ZipLoadButton from './zip-load-button';

class ReviewInfo extends Component {

  props: {
    exerciseId: number,
  }

  render() {
    return (
      <div className={`${prefixer('peer-review-content')} ${prefixer('peer-review-component')}`}>
        <div className={prefixer('peer-review-title')}>Vertaisarviointi</div>
        <div className={prefixer('peer-review-instructions')}>
          Quisque dignissim quam eu mi lobortis, sed rutrum arcu sollicitudin. Aliquam hendrerit libero eu aliquet cursus.
        </div>
        <div className={prefixer('zip-load-buttons')}>
          <ZipLoadButton
            exerciseId={this.props.exerciseId}
            zipType="model"
            message="Lataa mallivastauksen ZIP"
          />
          <ZipLoadButton
            exerciseId={this.props.exerciseId}
            zipType="stub"
            message="Lataa tehtäväpohjan ZIP"
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    exerciseId: state.review.reviewable,
  };
}

export default connect(mapStateToProps, null)(ReviewInfo);

