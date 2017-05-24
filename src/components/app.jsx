// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import prefixer from 'utils/class-name-prefixer';
import Form from './assignment-form';

class App extends Component {

  render() {
    return (
      <div className={prefixer('container')}>
        <Form
          assignment={this.props.assignment}
          modelSolution={this.props.modelSolution}
          inputOutput={this.props.inputOutput}
          handleSubmit={this.props.handleSubmit}
        />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    assignment: state.writerReducer.assignment,
    modelSolution: state.writerReducer.modelSolution,
    inputOutput: state.writerReducer.inputOutput,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      // dispatch action?
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
