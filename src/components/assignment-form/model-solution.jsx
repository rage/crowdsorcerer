// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import CodeMirror, { TextMarker } from '@skidding/react-codemirror';
import type { State, Dispatch } from 'state/reducer';
import type { Change } from 'state/form/reducer';
import { connect } from 'react-redux';
import FormValue from 'domain/form-value';
import {
  modelSolutionChangeAction,
  addHiddenRow,
  deleteHiddenRow,
  resetToBoilerplateAction,
  setShowCodeTemplateAction,
} from 'state/form';
import Errors from 'components/errors';
import ModelSolutionTabs from './model-solution-tabs';

class ModelSolution extends Component {

  constructor(props) {
    super(props);

    this.handleAddNewHiddenRow = this.handleAddNewHiddenRow.bind(this);
    this.handleModelSolutionChange = this.handleModelSolutionChange.bind(this);
    this.modelSolutionMarkers = [];
  }

  componentDidMount() {
    this.addGutterMarks();
    this.showMarkers();
    const codeDocument = this.textInput.getCodeMirror();
    codeDocument.on('gutterClick',
      (instance, line) => this.handleAddNewHiddenRow(instance, line));
    codeDocument.on('beforeChange', this.handleModelSolutionChange);
  }

  componentDidUpdate() {
    this.showMarkers();
    this.addGutterMarks();
  }

  addGutterMarks() {
    if (this.props.readOnly) {
      return;
    }
    this.textInput.getCodeMirror().getDoc().clearGutter('modelsolution-lines');
    let count = 0;
    this.textInput.getCodeMirror().getDoc().eachLine(() => {
      const element = document.createElement('div');
      if (this.props.solutionRows.includes(count)) {
        element.innerHTML = '\u2611'; // ☑
      } else {
        element.innerHTML = '\u2610'; // ☐
      }
      const lineHandle = this.textInput.getCodeMirror().setGutterMarker(count, 'modelsolution-lines', element);
      this.modelSolutionMarkers.push(lineHandle);
      count++;
    });
  }

  showMarkers() {
    if (this.props.readOnly) {
      return;
    }
    const codeDocument = this.textInput.getCodeMirror().getDoc();
    for (let i = 0; i <= codeDocument.getEditor().lineCount(); i++) {
      codeDocument.removeLineClass(i, 'background', prefixer('hiddenRow'));
      codeDocument.removeLineClass(i, 'background', prefixer('readOnly'));
    }
    this.props.solutionRows.forEach((row) => {
      codeDocument.addLineClass(row, 'background', prefixer('hiddenRow'));
    });
    this.props.readOnlyLines.forEach((row) => {
      codeDocument.addLineClass(row, 'background', prefixer('readOnly'));
    });
  }

  handleAddNewHiddenRow(cm: CodeMirror, line: number) {
    if (this.props.readOnly) {
      return;
    }
    if (this.props.solutionRows.includes(line)) {
      this.props.onDeleteHiddenRow(line);
    } else {
      this.props.onNewHiddenRow(line);
    }
  }

  handleModelSolutionChange(cm, change) {
    let deletedReadOnly = false;
    if (change.to.line - change.from.line > 0) {
      if (change.from.ch === 0 && change.to.ch === 0) {
        // deleted the whole row
        // this check covers all cases which would end up editing a readnoly line
        if (this.props.readOnlyLines.includes(change.to.line)) {
          // force an empty newline in
          // no update on undo
          if (change.update) {
            change.update(change.from, change.to, [change.text[0], ''], 'forced');
          }
        }
      } else if (this.props.readOnlyLines.some(l => l >= change.from.line && l <= change.to.line)) {
        // don't allow deleting readOnly lines
        deletedReadOnly = true;
      } else {
        // normal case with whole line
        deletedReadOnly = this.props.readOnlyLines.includes(change.to.line);
      }
    }
    if ((this.props.readOnlyLines.includes(change.from.line) || deletedReadOnly) && change.origin !== 'setValue') {
      change.cancel();
    }
  }

  textInput: CodeMirror;
  markers: TextMarker;
  modelSolutionMarkers: Array<string>;
  handleAddNewHiddenRow: (CodeMirror, number) => void;
  markReadOnlyLines: () => void;
  handleModelSolutionChange: (CodeMirror, Change) => void;

  props: {
    editableModelSolution: FormValue<string>,
    solutionRows: Array<number>,
    onModelSolutionChange: (string) => void,
    onNewHiddenRow: (row: number) => void,
    onDeleteHiddenRow: (row: number) => void,
    readOnly: boolean,
    showErrors: boolean,
    showCodeTemplate: boolean,
    readOnlyLines: Array<number>,
    readOnlyModelSolution: string,
    readOnlyCodeTemplate: string,
    onResetModelSolution: () => void,
    onSetShowCodeTemplate: () => void,
  };

  render() {
    let value = this.props.showCodeTemplate
      ? this.props.readOnlyCodeTemplate
      : this.props.readOnlyModelSolution;
    value = this.props.reviewable === undefined ? this.props.editableModelSolution.get() : value;
    const errors = this.props.editableModelSolution ? this.props.editableModelSolution.errors : [];
    const gutters = this.props.readOnly
      ? ['CodeMirror-linenumbers']
      : ['CodeMirror-linenumbers', 'modelsolution-lines'];
    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('same-line')}>
          <div id="modelSolution" className={prefixer('instructions')}>
            Source code
          </div>
          {!this.props.readOnly && <button
            type="button"
            className={prefixer('reset-button')}
            onClick={(e) => {
              e.preventDefault();
              this.props.onResetModelSolution();
            }}
          >
          Reset model solution
          </button>
          }
        </div>
        <ModelSolutionTabs
          readOnly={this.props.readOnly}
          onShowCodeTemplate={this.props.onSetShowCodeTemplate}
          showCodeTemplate={this.props.showCodeTemplate}
        />
        <div tabIndex="0">
          <CodeMirror
            aria-labelledby="modelSolution"
            className={prefixer('model-solution')}
            options={{
              mode: 'text/x-java',
              lineNumbers: true,
              gutters,
              tabSize: 4,
              indentUnit: 4,
              readOnly: this.props.readOnly,
              dragDrop: false,
            }}
            value={value}
            onChange={(solution, change) => {
              if (change.origin === 'forced') {
                this.textInput.getCodeMirror().setCursor({ line: change.from.line, ch: change.text[0].length });
              }
              this.props.onModelSolutionChange(solution, change);
            }}
            ref={(input) => { this.textInput = input; }}
            aria-required
          />
        </div>
        <Errors errors={errors} show={this.props.showErrors} />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    editableModelSolution: state.form.modelSolution.editableModelSolution,
    readOnlyModelSolution: state.form.modelSolution.readOnlyModelSolution,
    readOnlyCodeTemplate: state.form.modelSolution.readOnlyCodeTemplate,
    solutionRows: state.form.modelSolution.solutionRows,
    showErrors: state.form.showErrors,
    readOnlyLines: state.form.modelSolution.readOnlyModelSolutionLines,
    reviewable: state.review.reviewable,
    showCodeTemplate: state.form.modelSolution.showTemplate,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onModelSolutionChange(modelSolution: string, change: Change) {
      dispatch(modelSolutionChangeAction(modelSolution, change));
    },
    onNewHiddenRow(row: number) {
      dispatch(addHiddenRow(row));
    },
    onDeleteHiddenRow(row: number) {
      dispatch(deleteHiddenRow(row));
    },
    onResetModelSolution() {
      dispatch(resetToBoilerplateAction());
    },
    onSetShowCodeTemplate(show: boolean) {
      dispatch(setShowCodeTemplateAction(show));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelSolution);
