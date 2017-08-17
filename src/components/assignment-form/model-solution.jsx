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
} from 'state/form';
import Errors from 'components/errors';


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
    modelSolution: FormValue<string>,
    solutionRows: Array<number>,
    onModelSolutionChange: (string) => void,
    onNewHiddenRow: (row: number) => void,
    onDeleteHiddenRow: (row: number) => void,
    onResetModelSolution: () => void,
    readOnly: boolean,
    showErrors: boolean,
    readOnlyLines: Array<number>,
  };

  render() {
    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('same-line')}>
          <div id="modelSolution" className={prefixer('instructions')}>
            Malliratkaisu
          </div>
          {!this.props.readOnly && <button
            className={prefixer('reset-button')}
            onClick={(e) => {
              e.preventDefault();
              this.props.onResetModelSolution();
            }}
          >
          Nollaa mallivastaus
        </button>
          }
        </div>
        <div tabIndex="0">
          <CodeMirror
            aria-labelledby="modelSolution"
            className={prefixer('model-solution')}
            options={{
              mode: 'text/x-java',
              lineNumbers: true,
              gutters: ['CodeMirror-linenumbers', 'modelsolution-lines'],
              tabSize: 4,
              indentUnit: 4,
              readOnly: this.props.readOnly,
              dragDrop: false,
            }}
            value={this.props.modelSolution.get()}
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
        <Errors errors={this.props.modelSolution.errors} show={this.props.showErrors} />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    modelSolution: state.form.modelSolution,
    solutionRows: state.form.solutionRows,
    showErrors: state.form.showErrors,
    readOnlyLines: state.form.readOnlyModelSolutionLines,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelSolution);
