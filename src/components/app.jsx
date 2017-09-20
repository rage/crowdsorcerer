// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State } from 'state/reducer';
import type Review from 'state/review';
import type FormValue from 'state/form';
import { STATUS_ERROR } from 'state/submission';
import Form from './assignment-form';
import PeerReview from './review';
import CheckMark from './check-mark';
import FatalErrorDisplay from './fatal-error-display';

class App extends Component {

  props: {
    review: boolean,
    loggedIn: () => void,
    editableModelSolution: ?string,
    reviewable: number,
    formDone: boolean,
    reviewDone: boolean,
    reviews: FormValue<Array<Review>>,
    submissionStatus: string,
    submissionMessage: string,
  }

  render() {
    if ((!this.props.review && this.props.editableModelSolution !== undefined) ||
      (this.props.review && this.props.reviews !== undefined)) {
      if (!this.props.loggedIn) {
        return (<div className={`${prefixer('container')} ${prefixer('center')}`}>
          <FatalErrorDisplay message="Sinun on oltava kirjautuneena nähdäksesi tämän sisällön" />
        </div>);
      }
      return (
        <div className={prefixer('container')}>
          <CheckMark reviewable={this.props.reviewable} formDone={this.props.formDone} reviewDone={this.props.reviewDone} />
          {this.props.review ? <PeerReview /> : <Form />}
        </div>
      );
    } else if (this.props.submissionStatus === STATUS_ERROR) {
      return (
        <div className={`${prefixer('container')} ${prefixer('center')}`}>
          <FatalErrorDisplay message={this.props.submissionMessage} />
        </div>
      );
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
    submissionStatus: state.submission.status,
    submissionMessage: state.submission.message,
  };
}

export default connect(mapStateToProps, null)(App);
