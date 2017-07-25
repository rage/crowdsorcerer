// @flow
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { addTestFieldAction } from 'state/form';
import IO from 'domain/io';
import FormValue from 'domain/form-value';
import InputOutput from './input-output';

class TestFields extends Component {

  props: {
    readOnly: boolean,
    inputOutput: Array<FormValue<IO>>,
    onAddFieldClick: () => void,
  };

  render() {
    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('instructions')}>
          Testit
        </div>
        <div className={prefixer('io-component')}>
          <Transition
            appear={{
              opacity: 0,
              height: 0,
              translateY: 80,
              translateX: 0,
            }}
            enter={{
              overflow: 'hidden',
              height: 64,
              opacity: 1,
              translateX: 0,
              translateY: spring(0, { stiffness: 120, damping: 15 }),
            }}
            leave={{ opacity: 0, height: 0 }}
          >
            {this.props.inputOutput.map((io: IO, index: number) =>
              (<div key={io.hash()}>
                {<InputOutput readOnly={this.props.readOnly} index={index} io={io} />}
              </div>),
            )}
          </Transition>
        </div>
        {!this.props.readOnly && <button
          type="button"
          className={prefixer('add-field')}
          onClick={(e) => { e.preventDefault(); this.props.onAddFieldClick(); }}
        >
        + Lisää kenttä
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
