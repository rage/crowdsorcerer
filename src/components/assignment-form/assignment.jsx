// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { assignmentChangeAction } from 'state/form';
import Transition from 'react-motion-ui-pack';
import { Editor, State as sState, Data } from 'slate';

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
    let state = this.props.editorState;

    state = state
      .transform()
      .toggleMark(type)
      .apply();

    this.props.onAssignmentChange(state);
  }

  onClickBlock = (e: Event, type: string) => {
    e.preventDefault();
    let state = this.props.editorState;
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
    const state = this.props.editorState;
    return state.blocks.some(node => node.type === type);
  }

  hasMark = (type: string) => {
    const state = this.props.editorState;
    return state.marks.some(mark => mark.type === type);
  }

  props: {
    editorState: sState,
    onAssignmentChange: (editorState: sState) => void,
    errors: Map<string, Array<Object>>,
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
      placeholder={'Tämä on tarpeeksi pitkä tehtävänanto.'}
      schema={schema}
      state={this.props.editorState}
      onChange={(editorState) => {
        this.props.onAssignmentChange(editorState);
      }}
      onKeyDown={this.onKeyDown}
    />
  )

  render() {
    let errMessage = '';
    let errClass = prefixer('hidden');
    if (this.props.errors && this.props.showErrors) {
      const assignmentErrors = this.props.errors.get('assignmentError');
      if (assignmentErrors) {
        errClass = prefixer('error');
        errMessage = assignmentErrors[0];
      }
    }
    return (
      <div className={prefixer('form-component')}>
        <div>
          <div className={prefixer('instructions')}>
            Tehtävänanto
          </div>
          <div>
            {this.renderToolbar()}
          </div>
          <div className={prefixer('assignment-editor')}>
            {this.renderEditor()}
          </div>
          <Transition
            appear={{ opacity: 0, height: 0 }}
            enter={{ opacity: 1, height: 16 }}
            leave={{ opacity: 0, height: 0, translateY: -3 }}
          >
            <span key={errClass} className={errClass}>
              {errMessage}
            </span>
          </Transition>
        </div >
      </div >
    );
  }
}

function mapStateToProps(state: State) {
  return {
    editorState: state.form.assignment,
    errors: state.form.errors,
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
