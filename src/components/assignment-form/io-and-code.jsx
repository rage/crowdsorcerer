// @flow
import React, { Component } from 'react';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import { connect } from 'react-redux';
import CodeMirror from '@skidding/react-codemirror';
import type { State, Dispatch } from 'state/reducer';
import { addTestFieldAction } from 'state/form';
import prefixer from 'utils/class-name-prefixer';
import assertionGenerator from 'utils/assertion-generator';
import IO from 'domain/io';
import InputOutput from './input-output';

class IOAndCode extends Component {

  props: {
    inputOutput: Array<IO>,
    onAddFieldClick: () => void,
    tests: Array<Object>,
  }

  render() {
    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('same-line')}>
          <div id="unitTests" className={prefixer('instructions')}>
            Testit
          </div>
        </div>

        <div className={prefixer('io-and-code-components')} >
          <Transition
            appear={{
              opacity: 0,
              height: 0,
              translateX: 0,
              translateY: 80,
            }}
            enter={{
              overflow: 'hidden',
              height: 165,
              opacity: 1,
              translateX: 0,
              translateY: spring(0, { stiffness: 120, damping: 15 }),
            }}
            leave={{ opacity: 0, height: 0 }}
          >
            {this.props.inputOutput.map((io: IO, index: number) => {
              let test = '';
              if (this.props.tests && this.props.tests.length > 0) {
                let input = this.props.tests[index].input;
                if (this.props.tests[index].input === '<input>') {
                  input = '';
                }
                let output = this.props.tests[index].output;
                if (this.props.tests[index].output === '<output>') {
                  output = '';
                }

                test = this.props.tests[index].code
                .replace('<assertion>', assertionGenerator(io.type))
                .replace(/<input>/g, input)
                .replace(/<output>/g, output);
              }

              return (
                <div key={io.hash()} className={prefixer('io-and-code')}>
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
                    value={test}
                  />}
                </div>
              );
            },
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
    tests: state.form.unitTests.testArray,
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
