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
    //contentState: ContentState, // convertFromRaw(this.props.contentState),
    // assignment: string,
    onAssignmentChange: (editorState: EditorState) => void,

  }

  render() {
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    editorState: state.form.assignment,
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
