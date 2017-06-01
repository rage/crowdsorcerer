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
import formSolutionTemplate from 'utils/solution-template-former';
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
    this.showMarkers(true);
    this.addGutterMarks();
    const codeDocument = this.textInput.getCodeMirror();
    codeDocument.on('gutterClick',
      (instance, line) => this.handleAddNewHiddenRow(instance, line));
  }

  componentWillUpdate() {
    this.showMarkers(false);
  }

  componentDidUpdate() {
    this.showMarkers(true);
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

  showMarkers(visible: boolean) {
    if (this.props.modelSolution) {
      const codeDocument = this.textInput.getCodeMirror().getDoc();
      if (visible) {
        this.markers = this.props.solutionRows.map(row =>
          codeDocument.addLineClass(row, 'background', prefixer('hiddenRow')));
      } else {
        this.markers = this.props.solutionRows.map(row =>
          codeDocument.removeLineClass(row, 'background', prefixer('hiddenRow')));
      }
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

  handleAddNewHiddenRow(cm: CodeMirror, line: number) {
    if (this.props.solutionRows.includes(line)) {
      this.props.onDeleteHiddenRow(line);
    } else {
      this.props.onNewHiddenRow(line);
    }
  }

  handleAddField: Function;
  handleAddNewHiddenRow: Function;
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
          <Row>
            <Label className={prefixer('instructions')}>
              Tehtävänanto
            </Label>
          </Row>
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
              }}
              value={this.props.modelSolution}
              onChange={(solution) => {
                this.props.onModelSolutionChange(solution);
              }}
              ref={(input) => { this.textInput = input; }}
            />
          </Row>
          <Row>
            <Label className={prefixer('instructions')}>
              Testit
            </Label >
          </Row>
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
            &nbsp;
          </Row>
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
          <Row>
            &nbsp;
          </Row>
          <Row>
            <Col>
              <Button
                color="success"
                className="float-right"
                onClick={formSolutionTemplate(this.props.modelSolution)}
              >
                Lähetä
              </Button>
            </Col>
          </Row>
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
