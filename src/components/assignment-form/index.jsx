// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Form, Button, Label, Col, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { addTestFieldAction } from 'state/form';
import formSolutionTemplate from 'utils/solution-template-former';
import 'codemirror/mode/clike/clike';
import InputOutput from './input-output';
import ModelSolution from './model-solution';
import Assignment from './assignment';

class AssignmentForm extends Component {

  handleAddField: Function;
  handleAddNewHiddenRow: Function;
  wrapper: HTMLDivElement;

  props: {
    inputOutput: Array<Array<string>>,
    solutionRows: Array<number>,
    modelSolution: string,
    handleSubmit: (assignment: string, model: string, IO: Array<Array<string>>) => void,
    onAddFieldClick: () => void,
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Assignment />
        <ModelSolution value={this.props.modelSolution} solutionRows={this.props.solutionRows} />
        <FormGroup>
          <Label className={prefixer('instructions')}>
            Testit
          </Label >
        </FormGroup>
        {this.props.inputOutput.map((io, index) => <InputOutput index={index} io={io} key={index.toString()} />)}
        <FormGroup>
          &nbsp;
        </FormGroup>
        <FormGroup>
          <Button
            color="basic"
            className="btn-block"
            onClick={this.props.onAddFieldClick}
            disabled={
              (this.props.inputOutput.length >= 5) ?
                'disabled' : ''
            }
          >
            + Lisää kenttä
          </Button>
        </FormGroup>
        <FormGroup>
          <Col>
            <Button
              color="success"
              className="float-right"
              onClick={() => formSolutionTemplate(this.props.modelSolution, this.props.solutionRows)}
            >
              Lähetä
            </Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    modelSolution: state.form.modelSolution,
    inputOutput: state.form.inputOutput,
    solutionRows: state.form.solutionRows,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
