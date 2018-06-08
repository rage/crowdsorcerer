// @flow
import React, { Component } from 'react';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import { connect } from 'react-redux';
import CodeMirror from '@skidding/react-codemirror';
import type { State, Dispatch } from 'state/reducer';
import { addTestFieldAction } from 'state/form';
import prefixer from 'utils/class-name-prefixer';
import IO from 'domain/io';
import InputOutput from './input-output';

class IOAndCode extends Component {

  props: {
    inputOutput: Array<IO>,
    onAddFieldClick: () => void,
  }

  render() {
    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('io-and-code-component')} >
          <Transition
            appear={{
              opacity: 0,
              height: 0,
              translateX: 0,
              translateY: 80,
            }}
            enter={{
              overflow: 'hidden',
              height: 120,
              opacity: 1,
              translateX: 0,
              translateY: spring(0, { stiffness: 120, damping: 15 }),
            }}
            leave={{ opacity: -1, height: 0 }}
          >
            {this.props.inputOutput.map((io: IO, index: number) =>
              (
                <div key={io.hash()}>
                  {<InputOutput readOnly={false} index={index} io={io} />}
                  {<CodeMirror
                    aria-labelledby="testCode"
                    className={prefixer('test-code')}
                    options={{
                      mode: 'text/x-java',
                      lineNumbers: true,
                      tabSize: 4,
                      indentUnit: 4,
                      dragDrop: false,
                      readOnly: 'nocursor',
                    }}
                    value={'@Test\npublic void testi1() {\n    assertEquals("jea", "jea");\n}'}
                  />}
                </div>
              ),
            )}
          </Transition>
        </div>
        <button
          type="button"
          className={prefixer('add-field')}
          onClick={(e) => { e.preventDefault(); this.props.onAddFieldClick(); }}
        >
        + Lisää kenttä
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(IOAndCode);
