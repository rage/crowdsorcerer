// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { assignmentChangeAction } from 'state/form';
import { Editor, State as sState, Data } from 'slate';
import FormValue from 'domain/form-value';
import Errors from 'components/errors';

const DEFAULT_NODE = 'paragraph';

const schema = {
  nodes: {
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
  },
  marks: {
    bold: {
      fontWeight: 'bold',
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px',
      borderRadius: '4px',
    },
    italic: {
      fontStyle: 'italic',
    },
    underlined: {
      textDecoration: 'underline',
    },
  },
};

class Assignment extends Component {

  onKeyDown = (e: Event, data: Data, state: sState) => {
    if (!data.isMod) return;
    let mark;

    switch (data.key) {
      case 'b':
        mark = 'bold';
        break;
      case 'i':
        mark = 'italic';
        break;
      case 'u':
        mark = 'underlined';
        break;
      case '`':
        mark = 'code';
        break;
      default:
        return;
    }

    const newstate = state
      .transform()
      .toggleMark(mark)
      .apply();

    e.preventDefault();
    this.props.onAssignmentChange(newstate);
  }

  onClickMark = (e: Event, type: string) => {
    e.preventDefault();
    let state = this.props.assignment.get();

    state = state
      .transform()
      .toggleMark(type)
      .apply();

    this.props.onAssignmentChange(state);
  }

  onClickBlock = (e: Event, type: string) => {
    e.preventDefault();
    let state = this.props.assignment.get();
    const transform = state.transform();
    const { document } = state;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type);
      }
    } else {  // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const istype = state.blocks.some(block => !!document.getClosest(block.key, parent => parent.type === type));

      if (isList && istype) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        transform
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type);
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type);
      }
    }

    state = transform.apply();
    this.props.onAssignmentChange(state);
  }

  hasBlock = (type: string) => {
    const state = this.props.assignment.get();
    return state.blocks.some(node => node.type === type);
  }

  hasMark = (type: string) => {
    const state = this.props.assignment.get();
    return state.marks.some(mark => mark.type === type);
  }

  props: {
    assignment: FormValue<sState>,
    onAssignmentChange: (editorState: sState) => void,
    showErrors: boolean,
    readOnly: boolean,
  }

  renderMarkButton = (type: string, icon: string) => {
    const isActive = this.hasMark(type);
    const onMouseDown = e => this.onClickMark(e, type);

    return (
      <span className={prefixer('button')} onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    );
  }

  renderBlockButton = (type: string, icon: string) => {
    const isActive = this.hasBlock(type);
    const onMouseDown = e => this.onClickBlock(e, type);

    return (
      <span className={prefixer('button')} onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    );
  }

  renderToolbar = () => (
    <div className={prefixer('toolbar-menu')}>
      {this.renderMarkButton('bold', 'format_bold')}
      {this.renderMarkButton('italic', 'format_italic')}
      {this.renderMarkButton('underlined', 'format_underlined')}
      {this.renderMarkButton('code', 'code')}
      {this.renderBlockButton('heading-one', 'looks_one')}
      {this.renderBlockButton('heading-two', 'looks_two')}
      {this.renderBlockButton('block-quote', 'format_quote')}
      {this.renderBlockButton('numbered-list', 'format_list_numbered')}
      {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
    </div>
  )

  renderEditor = () => (
    <Editor
      spellCheck={false}
      id="assignment"
      placeholder={'Write the assignment here'}
      schema={schema}
      state={this.props.assignment.get()}
      onChange={(editorState) => {
        this.props.onAssignmentChange(editorState);
      }}
      onKeyDown={this.onKeyDown}
      readOnly={this.props.readOnly}
    />
  )

  render() {
    return (
      <div className={prefixer('form-component')}>
        <div>
          <div id="assignment" className={prefixer('instructions')}>
            Assignment
          </div>
          <div>
            {this.props.readOnly ? undefined : this.renderToolbar()}
          </div>
          <div
            className={prefixer('assignment-editor')}
            aria-required
            aria-labelledby="assignment"
          >
            {this.renderEditor()}
          </div>
          <Errors errors={this.props.assignment.errors} show={this.props.showErrors} />
        </div >
      </div >
    );
  }
}

function mapStateToProps(state: State) {
  return {
    assignment: state.form.assignment,
    showErrors: state.form.showErrors,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onAssignmentChange(editorState: sState) {
      dispatch(assignmentChangeAction(editorState));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Assignment);
