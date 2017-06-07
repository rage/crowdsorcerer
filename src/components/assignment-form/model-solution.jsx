// @flow
import React, { Component } from 'react';
import { Row, Label } from 'reactstrap';
import prefixer from 'utils/class-name-prefixer';
import CodeMirror, { TextMarker } from 'react-codemirror';
import type { Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import {
  modelSolutionChangeAction,
  addHiddenRow,
  deleteHiddenRow,
} from 'state/form';

class ModelSolution extends Component {

  constructor(props) {
    super(props);

    this.handleAddNewHiddenRow = this.handleAddNewHiddenRow.bind(this);
    this.modelSolutionMarkers = [];
  }

  componentDidMount() {
    this.addGutterMarks();
    const codeDocument = this.textInput.getCodeMirror();
    codeDocument.on('gutterClick',
      (instance, line) => this.handleAddNewHiddenRow(instance, line));
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
    }
    this.props.solutionRows.forEach(row =>
      codeDocument.addLineClass(row, 'background', prefixer('hiddenRow')));
  }

  handleAddNewHiddenRow(cm: CodeMirror, line: number) {
    if (this.props.solutionRows.includes(line)) {
      this.props.onDeleteHiddenRow(line);
    } else {
      this.props.onNewHiddenRow(line);
    }
  }

  textInput: CodeMirror;
  markers: TextMarker;
  modelSolutionMarkers: Array<string>;
  handleAddNewHiddenRow: Function;

  props: {
    value: string,
    solutionRows: Array<number>,
    onModelSolutionChange: (modelSolution: string) => void,
    onNewHiddenRow: (row: number) => void,
    onDeleteHiddenRow: (row: number) => void,
  };

  render() {
    return (
      <div>
        <Row>
          <Label className={prefixer('instructions')}>
            Malliratkaisu
          </Label >
        </Row>
        <Row>
          <CodeMirror
            className={prefixer('model-solution')}
            options={{
              mode: 'text/x-java',
              lineNumbers: true,
              gutters: ['CodeMirror-linenumbers', 'modelsolution-lines'],
              tabSize: 4,
              indentUnit: 4,
            }}
            value={this.props.value}
            onChange={(solution) => {
              this.props.onModelSolutionChange(solution);
            }}
            ref={(input) => { this.textInput = input; }}
          />
        </Row>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onModelSolutionChange(modelSolution: string) {
      dispatch(modelSolutionChangeAction(modelSolution));
    },
    onNewHiddenRow(row: number) {
      dispatch(addHiddenRow(row));
    },
    onDeleteHiddenRow(row: number) {
      dispatch(deleteHiddenRow(row));
    },
  };
}

export default connect(null, mapDispatchToProps)(ModelSolution);
