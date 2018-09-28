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
import TestNameAndType from './test-name-and-type';

class IOAndCode extends Component {

  props: {
    inputOutput: Array<IO>,
    onAddFieldClick: () => void,
    tests: Array<Object>,
    readOnly: boolean,
  }

  render() {
    let height;
    let testCodeClass;
    if (this.props.readOnly) {
      height = 216;
      testCodeClass = prefixer('reviewable-test-code');
    } else {
      height = 252;
      testCodeClass = prefixer('test-code');
    }

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
              height,
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
                if (this.props.tests[index].input === '<placeholderInput>') {
                  input = '';
                }
                let output = this.props.tests[index].output;
                if (this.props.tests[index].output === '<placeholderOutput>') {
                  output = '';
                }
                const name = this.props.tests[index].name.get() === '<placeholderTestName>'
                ? 'test'
                : this.props.tests[index].name.get();
                test = this.props.tests[index].code
                .replace('<assertion>', assertionGenerator(io.type))
                .replace(/<placeholderInput>/g, input)
                .replace(/<placeholderOutput>/g, output)
                .replace('<placeholderTestName>', `${name}()`);
              }

              return (
                <div key={io.hash()} className={prefixer('io-and-code')}>
                  {<TestNameAndType readOnly={this.props.readOnly} index={index} io={io} />}
                  {<InputOutput readOnly={this.props.readOnly} index={index} io={io} />}
                  {<CodeMirror
                    aria-labelledby="testCode"
                    className={testCodeClass}
                    options={{
                      mode: 'text/x-java',
                      lineNumbers: true,
                      tabSize: 4,
                      indentUnit: 4,
                      dragDrop: false,
                      readOnly: 'nocursor',
                      scrollbarStyle: 'null',
                    }}
                    value={test}
                  />}
                </div>
              );
            },
            )}
          </Transition>
        </div>
        {!this.props.readOnly && <button
          type="button"
          className={prefixer('add-field')}
          onClick={(e) => { e.preventDefault(); this.props.onAddFieldClick(); }}
        >
        + Lisää kenttä
        </button>}
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
