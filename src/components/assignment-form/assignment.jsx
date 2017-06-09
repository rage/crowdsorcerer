// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Row, Label, Input } from 'reactstrap';
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
      <div>
        <Row>
          <Label className={prefixer('instructions')}>
            Tehtävänanto
          </Label>
        </Row>
        <Row>
          <div className={prefixer('assignment-editor')}>
            <Editor
              id="assignment"
              editorState={this.props.editorState}
              onChange={(editorState) => {
                this.props.onAssignmentChange(editorState);
              }}
            />
          </div>
          {/* <Input
            type="textarea"
            id="assignment"
            className={prefixer('assignment')}
            value={this.props.assignment}
            onChange={(event) => {
              this.props.onAssignmentChange(event.currentTarget.value);
            }}
          />*/}
        </Row>
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
