// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { assignmentChangeAction } from 'state/form';
import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';

class Assignment extends Component {

  props: {
    editorState: EditorState,
    errors: Array<Object>,
    //contentState: ContentState, // convertFromRaw(this.props.contentState),
    // assignment: string,
    onAssignmentChange: (editorState: EditorState) => void,

  }

  render() {
    let errMessage = '';
    let errClass = prefixer('errorHide');
    this.props.errors.forEach((error) => {
      if (error.key === 'assignmentError') {
        errClass = prefixer('error');
        errMessage = error.msg;
      }
    });
    return (
      <div className={prefixer('form-component')}>
        <div>
          <div className={prefixer('instructions')}>
            Tehtävänanto
          </div>
          <div className={prefixer('assignment-editor')}>
            <Editor
              id="assignment"
              editorState={this.props.editorState}
              onChange={(editorState) => {
                this.props.onAssignmentChange(editorState);
              }}
            />
          </div>
          <span id="assignmentError" className={errClass}>
            {errMessage}
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    editorState: state.form.assignment,
    errors: state.form.errors,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onAssignmentChange(editorState: EditorState) {
      dispatch(assignmentChangeAction(editorState));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Assignment);
