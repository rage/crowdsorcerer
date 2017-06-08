// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Form, Button, Label, Col, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { addTestFieldAction } from 'state/form';
import formSolutionTemplate from 'utils/solution-template-former';
import 'codemirror/mode/clike/clike';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import IO from 'domain/io';
import InputOutput from './input-output';
import ModelSolution from './model-solution';
import Assignment from './assignment';

class AssignmentForm extends Component {

  handleAddNewHiddenRow: Function;
  wrapper: HTMLDivElement;

  props: {
    inputOutput: Array<IO>,
    solutionRows: Array<number>,
    modelSolution: string,
    handleSubmit: (assignment: string, model: string, IO: Array<IO>) => void,
    onAddFieldClick: () => void,
    valid: boolean,
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
        <Transition
          appear={{ opacity: 0, height: 70, translateY: 80, translateX: 0 }}
          enter={{ overflow: 'hidden', height: 70, opacity: 1, translateX: 0, translateY: spring(0, { stiffness: 120, damping: 15 }) }}
          leave={{ opacity: 0, height: 0 }}
        >
          {this.props.inputOutput.map((io: IO, index: number) =>
            (<div key={io.hash()}>
              {<InputOutput index={index} io={io} />}
            </div>),
          )}
        </Transition>
        <FormGroup>
          &nbsp;
        </FormGroup>
        <FormGroup>
          <Button
            color="basic"
            className="btn-block"
            onClick={this.props.onAddFieldClick}
          >
            + Lisää kenttä
          </Button>
        </FormGroup>
        <FormGroup>
          <Col>
            <Button
              color="success"
              className="float-right"
              disabled={!this.props.valid}
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
    valid: state.form.valid,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      // dispatch action
    },
    onAddFieldClick() {
      dispatch(addTestFieldAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
