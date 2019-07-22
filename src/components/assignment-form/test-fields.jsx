// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { addTestFieldAction } from 'state/form';
import IO from 'domain/io';
import InputOutput from './input-output';

class TestFields extends Component {

  props: {
    readOnly: boolean,
    inputOutput: Array<IO>,
    onAddFieldClick: () => void,
  };

  render() {
    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('instructions')}>
          Tests
        </div>
        <div className={prefixer('io-component')}>
          {this.props.inputOutput.map((io: IO, index: number) =>
            (
              <div key={io.hash()}>
                {<InputOutput readOnly={this.props.readOnly} index={index} io={io} card />}
              </div>
            ),
          )}
        </div>
        {!this.props.readOnly && <button
          type="button"
          className={prefixer('add-field')}
          onClick={(e) => { e.preventDefault(); this.props.onAddFieldClick(); }}
        >
          + Add a test case
        </button>
        }
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    inputOutput: state.form.inputOutput,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onAddFieldClick() {
      dispatch(addTestFieldAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestFields);
