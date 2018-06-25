// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { changeCommentAction } from 'state/review';
import FormValue from 'domain/form-value';
import Errors from 'components/errors';

class ReviewComment extends Component {

  props: {
    comment: FormValue<string>,
    changeComment: (string) => void,
    showErrors: boolean,
  }

  render() {
    return (
      <div className={prefixer('peer-review-content')}>
        <div className={prefixer('peer-review-title')} >Other feedback</div>
        <textarea
          aria-required
          className={prefixer('comment-field')}
          value={this.props.comment.get()}
          onChange={event => this.props.changeComment(event.currentTarget.value)}
        />
        <Errors errors={this.props.comment.errors} show={this.props.showErrors} />
      </div>
    );
  }
}
function mapStateToProps(state: State) {
  return {
    comment: state.review.comment,
    showErrors: state.review.showErrors,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeComment(comment: string) {
      dispatch(changeCommentAction(comment));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewComment);
