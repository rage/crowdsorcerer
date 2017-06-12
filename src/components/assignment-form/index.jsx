// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
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
    const form = (
      <form onSubmit={this.props.handleSubmit}>
        <Assignment />
        <ModelSolution
          value={this.props.modelSolution}
          solutionRows={this.props.solutionRows}
        />
        <div className={prefixer('form-component')}>
          <div className={prefixer('instructions')}>
            Testit
        </div >
          <div className={prefixer('io-component')}>
            <Transition
              appear={{
                opacity: 0,
                height: 70,
                translateY: 80,
                translateX: 0,
              }}
              enter={{
                overflow: 'hidden',
                height: 95,
                opacity: 1,
                translateX: 0,
                translateY: spring(0, { stiffness: 120, damping: 15 }),
              }}
              leave={{ opacity: 0, height: 0 }}
            >
              {this.props.inputOutput.map((io: IO, index: number) =>
                (<div key={io.hash()}>
                  {<InputOutput index={index} io={io} />}
                </div>),
              )}
            </Transition>
          </div>
          <button
            className={prefixer('add-field')}
            onClick={(e) => { e.preventDefault(); this.props.onAddFieldClick(); }}
          >
            + Lisää kenttä
          </button>
        </div>
        <div className={prefixer('form-component')}>
          {/* <div className={errorsClass} >
            {this.props.errors.map(error => (<div className={prefixer('error')} key={error}>{error} </div>))}
          </div>*/}
          <button
            disabled={!this.props.valid}
            className={prefixer('sender')}
            onClick={(e) => {
              e.preventDefault();
              formSolutionTemplate(this.props.modelSolution, this.props.solutionRows);
            }}
          >
            Lähetä
          </button>
        </div>
      </form>
    );
    return form;
  }
}

function mapStateToProps(state: State) {
  return {
    modelSolution: state.form.modelSolution,
    inputOutput: state.form.inputOutput,
    solutionRows: state.form.solutionRows,
    valid: state.form.valid,
    errors: state.form.errors,
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
