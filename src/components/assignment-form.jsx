// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Form, Button, Row, Container, Label, Input, Col } from 'reactstrap';
import CodeMirror from 'react-codemirror';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import {
  addTestFieldAction,
  modelSolutionChangeAction,
  testInputChangeAction,
  testOutputChangeAction,
  assignmentChangeAction,
} from 'state/actions';
import 'codemirror/mode/clike/clike';
require('codemirror/mode/javascript/javascript.js');

class AssignmentForm extends Component {

  props: {
    assignment: string,
    modelSolution: string,
    inputOutput: Array<Array<string>>,
    handleSubmit: (assignment: string, model: string, IO: Array<Array<string>>) => void,
    onAddFieldClick: (IO: Array<string>) => void,
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
              options={{ mode: 'javascript' }}
              value={this.props.modelSolution}
              onChange={(solution) => {
                this.props.onModelSolutionChange(solution)
              }}
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
            <Button color="basic" className="btn-block" onClick={this.props.onAddFieldClick}>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
