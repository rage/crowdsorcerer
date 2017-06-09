// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Row, Label } from 'reactstrap';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { assignmentChangeAction } from 'state/form';
// import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
//import Editor, { EditorState } from 'draft-js-plugins-editor';
import { EditorState, Editor, RichUtils } from 'draft-js';
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';

const sideToolbarPlugin = createSideToolbarPlugin();
const { SideToolbar } = sideToolbarPlugin;

class Assignment extends Component {

  props: {
    editorState: EditorState,
    onAssignmentChange: (editorState: EditorState) => void,
  }

  focus = () => {
    this.editor.focus();
  }

  _onBoldClick(e) {
    e.preventDefault();
    RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD');
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
          <div className={prefixer('assignment-editor')} onClick={this.focus}>
            <button onClick={this._onBoldClick.bind(this)}>Bold</button>
            <Editor
              id="assignment"
              editorState={this.props.editorState}
              onChange={(editorState) => {
                this.props.onAssignmentChange(editorState);
              }}
              plugins={[sideToolbarPlugin]}
              ref={(element) => { this.editor = element; }}
            />
          </div>
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
