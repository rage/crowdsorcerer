// @flow
import React, { Component } from 'react';
// FlowIgnore
import Select from '@material-ui/core/Select';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import { changeTestNameAction, testTypeChangedAction } from 'state/form';
import type { State, Dispatch } from 'state/reducer';
import IO from 'domain/io';
import Errors from 'components/errors';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput/OutlinedInput';

class TestNameAndType extends Component {

  props: {
    index: number,
    tests: Array<Object>,
    onTestNameChange: (name: string, index: number) => void,
    onTestTypeChange: (type: string, index: number) => void,
    io: IO,
    showErrors: boolean,
    readOnly: boolean,
  }

  render() {
    const testName = !this.props.tests[this.props.index]
    || this.props.tests[this.props.index].name.get() === '<placeholderTestName>'
    ? ''
    : this.props.tests[this.props.index].name.get();

    const options = [
      { value: 'contains', label: 'Contains' },
      { value: 'notContains', label: 'Does not contain' },
      { value: 'equals', label: 'Equals' },
    ];

    const getOption = type => (
      options.find(o => o.value === type)
    );

    const type = getOption(this.props.io.type);

    let typeField;
    if (this.props.readOnly) {
      typeField = (<input
        aria-label="testin tyyppi"
        aria-required
        className={prefixer('test-name')}
        type="text"
        value={type ? type.label : ''}
        readOnly
      />);
    } else {
      // typeField = (<Select
      //   className={prefixer('test-type')}
      //   classNamePrefix={''}
      //   options={options}
      //   defaultValue={options[0]}
      //   value={type}
      //   onChange={(newType: any) => {
      //     this.props.onTestTypeChange(newType.value, this.props.index);
      //   }}
      //   isSearchable={false}
      // />);
      typeField = (<Select
        value={this.props.io.type}
        onChange={(event: any) => {
          this.props.onTestTypeChange(event.target.value, this.props.index);
        }}
      >
        <MenuItem value={'contains'}>Contains</MenuItem>
        <MenuItem value={'notContains'}>Does not contain</MenuItem>
        <MenuItem value={'equals'}>Equals</MenuItem>
      </Select>);
    }

    return (
      <div className={prefixer('field-container')}>
        <div className={prefixer('test-name-and-type')}>
          <div className={prefixer('label-and-field-wrapper')}>
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
              readOnly={this.props.readOnly}
              onChange={(event) => {
                this.props.onTestNameChange(event.currentTarget.value, this.props.index);
              }}
            />
            <Errors
              errors={this.props.tests[this.props.index] !== undefined ? this.props.tests[this.props.index].name.errors : []}
              keyBase={`${this.props.io.hash()} name`}
              show={this.props.showErrors}
            />
          </div>

          <div>
            <div className={prefixer('label')}>
              Tyyppi
            </div>
            {typeField}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    tests: state.form.unitTests.testArray,
    showErrors: state.form.showErrors,
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

