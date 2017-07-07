// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { changeCommentAction, submitAction } from 'state/review';
import Assignment from 'components/assignment-form/assignment';
import ModelSolution from 'components/assignment-form/model-solution';
import TestFields from 'components/assignment-form/test-fields';
import ReviewQuestions from './review-questions';
import ReviewInfo from './review-info';

class Review extends Component {

  render() {
    return (
      <div>
        <ReviewInfo />
        <Assignment readOnly />
        <ModelSolution readOnly />
        <TestFields readOnly />
        <div className={prefixer('peer-review-component')}>
          <ReviewQuestions />
          <div className={prefixer('peer-review-content')}>
            <div className={prefixer('peer-review-title')} >Vapaita kommentteja tehtävästä</div>
            <textarea
              className={prefixer('comment-field')}
              value={this.props.comment}
              onChange={event => this.props.changeComment(event.currentTarget.value)}
            />
          </div>
        </div>
        <button
          className={prefixer('sender')}
          onClick={(e) => {
            e.preventDefault();
            this.props.handleSubmit();
          }}
        >Lähetä </button>
      </div>
    );
  }
}
function mapStateToProps(state: State) {
  return {
    comment: state.review.comment,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeComment(comment: string) {
      dispatch(changeCommentAction(comment));
    },
    handleSubmit() {
      dispatch(submitAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);
