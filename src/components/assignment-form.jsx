// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Form, Button, Row, Container, Label, Input, Col } from 'reactstrap';
import CodeMirror, { TextMarker } from 'react-codemirror';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import {
  addTestFieldAction,
  modelSolutionChangeAction,
  testInputChangeAction,
  testOutputChangeAction,
  assignmentChangeAction,
  addHiddenRow,
  deleteHiddenRow,
} from 'state/actions';
import 'codemirror/mode/clike/clike';

const MAX_TEST_COUNT = 5;

class AssignmentForm extends Component {

  constructor(props) {
    super(props);

    this.state = { addFieldDisabled: false };
    this.handleAddField = this.handleAddField.bind(this);
    this.handleAddNewHiddenRow = this.handleAddNewHiddenRow.bind(this);
    this.modelSolutionMarkers = [];
  }

  state: {
    addFieldDisabled: boolean;
  };

  componentDidMount() {
    this.addMarkers();
    this.addGutterMarks();
    const codeDocument = this.textInput.getCodeMirror();
    codeDocument.on('gutterClick',
       (instance, line, gutter, clickEvent) => this.handleAddNewHiddenRow(instance, line, gutter));
  }

  componentWillUpdate() {
    if (this.props.modelSolution) {
      this.markers.forEach(marker => marker.clear());
    }
  }

  componentDidUpdate() {
    this.addMarkers();
    this.addGutterMarks();
  }

  addGutterMarks() {
    this.modelSolutionMarkers.forEach((lineHandle) => {
      lineHandle.gutterMarkers['modelsolution-lines'] = null;
    });
    this.props.solutionRows.forEach((rowNumber) => {
      const element = document.createElement('div');
      element.innerHTML = '☑';
      const lineHandle = this.textInput.getCodeMirror().setGutterMarker(rowNumber, 'modelsolution-lines', element);
      this.modelSolutionMarkers.push(lineHandle);
    });
  }

  addMarkers() {
    if (this.props.modelSolution) {
      const codeDocument = this.textInput.getCodeMirror().getDoc();
      this.markers = this.props.solutionRows.map((row) => {
        let end = 0;
        if (codeDocument.getLine(row)) {
          end = codeDocument.getLine(row).length;
        }
        return codeDocument.markText(
          { line: row, ch: 0 },
          { line: row, ch: end },
          { className: prefixer('hiddenRow'), inclusiveLeft: true, inclusiveRight: false },
        );
      });
    }
  }

  handleAddField() {
    if (this.props.inputOutput.length < MAX_TEST_COUNT) {
      this.props.onAddFieldClick();
    }
    // -1 since adding new field is done asynchronously
    if (this.props.inputOutput.length === MAX_TEST_COUNT - 1) {
      this.setState({ addFieldDisabled: true });
    }
  }

  handleAddNewHiddenRow(cm: CodeMirror, line: number, gutter: string) {
    if (this.props.solutionRows.includes(line)) {
      this.props.onDeleteHiddenRow(line);
      // const info = cm.lineInfo(line);
      // cm.setGutterMarker(line, 'CodeMirror-linenumbers', info.gutterMarkers = null);
    } else {
      this.props.onNewHiddenRow(line);
      // const info = cm.lineInfo(line);
      // cm.setGutterMarker(line, 'CodeMirror-linenumbers', info.gutterMarkers = this.makeMarker());
    }
  }

  makeMarker() {
    const marker = document.createElement('div');
    marker.innerHTML = '.';
    marker.classList.add('CodeMirror-linenumber');
    marker.classList.add('Codemirror-gutter-elt');
    marker.classList.add(prefixer('checkbox'));
    return marker;
  }

  handleAddField: Function;
  handleAddNewHiddenRow: Function;
  makeMarker: Function;
  addFieldDisabled: string;
  textInput: CodeMirror;
  markers: TextMarker;
  wrapper: HTMLDivElement;
  modelSolutionMarkers: Array<Object>;

  props: {
    assignment: string,
    modelSolution: string,
    inputOutput: Array<Array<string>>,
    solutionRows: Array<number>,
    handleSubmit: (assignment: string, model: string, IO: Array<Array<string>>) => void,
    onAddFieldClick: () => void,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onModelSolutionChange: (modelSolution: string) => void,
    onAssignmentChange: (assignment: string) => void,
    onNewHiddenRow: (row: number) => void,
    onDeleteHiddenRow: (row: number) => void,
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Container>
          <Label className={prefixer('instructions')}>
            Tehtävänanto </Label>
          <Row>
            <Input
              type="textarea"
              id="assignment"
              className={prefixer('assignment')}
              value={this.props.assignment}
              onChange={(event) => {
                this.props.onAssignmentChange(event.currentTarget.value);
              }}
            />
          </Row>
          <Label className={prefixer('instructions')}>
            Malliratkaisu
          </Label >
          <Row>
            <CodeMirror
              className={prefixer('model-solution')}
              options={{
                mode: 'text/x-java',
                lineNumbers: true,
                gutters: ['CodeMirror-linenumbers', 'modelsolution-lines'],
              }}
              value={this.props.modelSolution}
              onChange={(solution) => {
                this.props.onModelSolutionChange(solution);
              }}
              ref={(input) => { this.textInput = input; }}
            />
          </Row>
          <Label className={prefixer('instructions')}>
            Testit
          </Label >
          {
            this.props.inputOutput.map((io, index) => (
              <Row>
                <Col>
                  <Label for={`input ${index}`}>Syöte</Label>
                  <Input
                    type="text"
                    name={`input ${index}`}
                    value={io[0]}
                    onChange={(event) => {
                      this.props.onTestInputChange(event.currentTarget.value, index);
                    }}
                  />
                </Col>
                <Col>
                  <Label for={`output ${index}`}>Tulos</Label>
                  <Input
                    type="text"
                    name={`output ${index}`}
                    value={io[1]}
                    onChange={(event) => {
                      this.props.onTestOutputChange(event.currentTarget.value, index);
                    }}
                  />
                </Col>
              </Row>
            ))
          }
          <Row>
            <Button
              color="basic"
              className="btn-block"
              onClick={this.handleAddField}
              disabled={(this.state.addFieldDisabled) ? 'disabled' : ''}
            >
              + Lisää kenttä
            </Button>
          </Row>
          <Button color="success">
            Submit
          </Button>
        </Container>
      </Form>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    assignment: state.formReducer.assignment,
    modelSolution: state.formReducer.modelSolution,
    inputOutput: state.formReducer.inputOutput,
    solutionRows: state.formReducer.solutionRows,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      // dispatch action
    },
    onAddFieldClick() {
      dispatch(addTestFieldAction(['', '']));
    },
    onModelSolutionChange(modelSolution: string) {
      dispatch(modelSolutionChangeAction(modelSolution));
    },
    onAssignmentChange(assignment: string) {
      dispatch(assignmentChangeAction(assignment));
    },
    onTestInputChange(input: string, index: number) {
      dispatch(testInputChangeAction(input, index));
    },
    onTestOutputChange(output: string, index: number) {
      dispatch(testOutputChangeAction(output, index));
    },
    onNewHiddenRow(row: number) {
      dispatch(addHiddenRow(row));
    },
    onDeleteHiddenRow(row: number) {
      dispatch(deleteHiddenRow(row));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
