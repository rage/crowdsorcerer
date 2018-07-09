// @flow
import React, { Component } from 'react';
import Select from 'react-select';
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

    const options = [
      { value: 'contains', label: 'Contains' },
      { value: 'notContains', label: 'Does not contain' },
      { value: 'equals', label: 'Equals' },
    ];

    const getOption = (type) => {
      options.find(o => o.value === type);
    };

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

            <Select
              className={prefixer('test-type')}
              classNamePrefix={''}
              options={options}
              defaultValue={options[0]}
              value={getOption(this.props.io.type)}
              onChange={(newType: any) => {
                this.props.onTestTypeChange(newType.value, this.props.index);
              }}
            />
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

