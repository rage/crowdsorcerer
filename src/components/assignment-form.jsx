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
  toggleMarking,
} from 'state/actions';
import 'codemirror/mode/clike/clike';

const MAX_TEST_COUNT = 5;

class AssignmentForm extends Component {

  constructor(props) {
    super(props);

    this.state = { addFieldDisabled: false };
    this.handleAddField = this.handleAddField.bind(this);
    this.handleAddNewHiddenRow = this.handleAddNewHiddenRow.bind(this);
  }

  state: {
    addFieldDisabled: boolean;
  };

  componentDidMount() {
    this.addMarkers();
    const codeDocument = this.textInput.getCodeMirror();
    debugger;
    codeDocument.on('gutterClick',() => this.handleAddNewHiddenRow());
  }

  componentWillUpdate() {
    if (this.props.modelSolution) {
      this.markers.forEach(marker => marker.clear());
    }
  }

  componentDidUpdate() {
    this.addMarkers();
  }

  addMarkers() {
    if (this.props.modelSolution) {
      const codeDocument = this.textInput.getCodeMirror().getDoc();
      this.markers = this.props.solutionRows.map(row => (
        codeDocument.markText(
          { line: row, ch: 0 },
          { line: row, ch: codeDocument.getLine(row).length },
          { className: prefixer('hiddenRow'), inclusiveLeft: true, inclusiveRight: false },
        )
      ));
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

  handleAddNewHiddenRow(_, line: number, gutter: string, clickEvent: Event) {
    console.log('handle add hidden row');
    if (this.props.markingRows) {
      const codeDocument = this.textInput.getCodeMirror().getDoc();
      console.log('Cursor: ' + codeDocument.getCursor());
    }
  }

  handleAddField: Function;
  handleAddNewHiddenRow: Function;
  addFieldDisabled: string;
  textInput: CodeMirror;
  markers: TextMarker;
  wrapper: HTMLDivElement;

  props: {
    assignment: string,
    modelSolution: string,
    inputOutput: Array<Array<string>>,
    solutionRows: Array<number>,
    handleSubmit: (assignment: string, model: string, IO: Array<Array<string>>) => void,
    onToggleMarkingRows: () => void,
    onAddFieldClick: () => void,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onModelSolutionChange: (modelSolution: string) => void,
    onAssignmentChange: (assignment: string) => void,
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
              options={{ mode: 'text/x-java' }, { lineNumbers: true }}
              value={this.props.modelSolution}
              onChange={(solution) => {
                this.props.onModelSolutionChange(solution);
              }}
              ref={(input) => { this.textInput = input; }}
            />
          </Row>
          <Row>
            <Col>
              <Button
                className="col-5 float-right"
                onClick={this.props.onToggleMarkingRows}
              >
              Merkitse piilotettavat rivit
              </Button>
            </Col>
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
    markingRows: state.formReducer.markingRows,
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
    onToggleMarkingRows() {
      dispatch(toggleMarking());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
