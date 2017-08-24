// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State } from 'state/reducer';
import type Review from 'state/review';
import type FormValue from 'state/form';
import Form from './assignment-form';
import PeerReview from './review';
import CheckMark from './check-mark';

class App extends Component {

  props: {
    review: boolean,
    loggedIn: () => void,
    editableModelSolution: ?string,
    reviewable: number,
    formDone: boolean,
    reviewDone: boolean,
    reviews: FormValue<Array<Review>>,
  }

  render() {
    if ((!this.props.review && this.props.editableModelSolution !== undefined) ||
      (this.props.review && this.props.reviews !== undefined)) {
      if (this.props.loggedIn) {
        return (
          <div className={prefixer('container')}>
            <CheckMark reviewable={this.props.reviewable} formDone={this.props.formDone} reviewDone={this.props.reviewDone} />
            {this.props.review ? <PeerReview /> : <Form />}
          </div>
        );
      }
      return <div className={prefixer('container')}>Sinun on oltava kirjautuneena nähdäksesi tämän sisällön.</div>;
    }
    return (
      <div className={`${prefixer('container')} ${prefixer('center')}`}>
        <div className={prefixer('spinner')} />
      </div>
    );
  }
}


function mapStateToProps(state: State) {
  return {
    loggedIn: state.user.loggedIn,
    editableModelSolution: state.form.modelSolution.editableModelSolution,
    readOnlyModelSolution: state.form.modelSolution.readOnlyModelSolution,
    readOnlyCodeTemplate: state.form.modelSolution.readOnlyCodeTemplate,
    reviewable: state.review.reviewable,
    formDone: state.form.done,
    reviewDone: state.review.done,
    reviews: state.review.reviews,
  };
}

export default connect(mapStateToProps, null)(App);
