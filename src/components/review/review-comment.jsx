// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { changeCommentAction } from 'state/review';
import Transition from 'react-motion-ui-pack';

class ReviewComment extends Component {

  props: {
    comment: string,
    errors: Map<string, Array<Object>>,
    changeComment: (string) => void,
    showErrors: boolean,
  }

  render() {
    let commentError = this.props.errors.get('commentError') || [];
    if (!this.props.showErrors) {
      commentError = [];
    }
    return (
      <div className={prefixer('peer-review-content')}>
        <div className={prefixer('peer-review-title')} >Vapaita kommentteja tehtävästä</div>
        <textarea
          aria-required
          className={prefixer('comment-field')}
          value={this.props.comment}
          onChange={event => this.props.changeComment(event.currentTarget.value)}
        />
        <Transition
          enter={{ opacity: 1, height: 16 }}
          leave={{ opacity: 0, height: 0, transitionY: -3 }}
        >
          {commentError.map(error => (
            <div key={prefixer('error')} className={prefixer('error')}>
              {error}
            </div>
          ))}
        </Transition>
      </div>
    );
  }
}
function mapStateToProps(state: State) {
  return {
    comment: state.review.comment,
    errors: state.review.errors,
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
