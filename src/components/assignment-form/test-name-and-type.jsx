// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import { changeTestNameAction, testTypeChangedAction } from 'state/form';
import type { State, Dispatch } from 'state/reducer';
import IO from 'domain/io';

class TestNameAndType extends Component {

  props: {
    index: number,
    tests: Array<Object>,
    onTestNameChange: (name: string, index: number) => void,
    onTestTypeChange: (type: string, index: number) => void,
    io: IO
  }

  render() {
    const testName = this.props.tests[this.props.index].name === '<placeholderTestName>'
    ? ''
    : this.props.tests[this.props.index].name;

    return (
      <div className={prefixer('field-container')}>
        <div className={prefixer('test-name-and-type')}>
          <div>
            <div className={prefixer('label')}>
            Nimi
          </div>
            <input
              aria-label="testin nimi"
              aria-required
              className={prefixer('test-name')}
              type="text"
              placeholder="Testin nimi"
              name={`test name ${this.props.index}`}
              value={testName}
              onChange={(event) => {
                this.props.onTestNameChange(event.currentTarget.value, this.props.index);
              }}
            />
          </div>

          <div>
            <div className={prefixer('label')}>
            Tyyppi
          </div>

            <select
              value={this.props.io.type}
              onChange={(event) => {
                this.props.onTestTypeChange(event.currentTarget.value, this.props.index);
              }}
            >
              <option value="contains">Contains</option>
              <option value="notContains">Does not contain</option>
              <option value="equals">Equals</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    tests: state.form.unitTests.testArray,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTestNameChange(name: string, index: number) {
      dispatch(changeTestNameAction(name, index));
    },
    onTestTypeChange(type: string, index: number) {
      dispatch(testTypeChangedAction(type, index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TestNameAndType);

