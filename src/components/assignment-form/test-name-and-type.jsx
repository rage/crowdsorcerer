// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { changeTestNameAction, testTypeChangedAction } from 'state/form';
import type { State, Dispatch } from 'state/reducer';
import IO from 'domain/io';
import Errors from 'components/errors';
import { FormControl } from '@material-ui/core';

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
    const testName = this.props.tests[this.props.index].name.get() === '<placeholderTestName>'
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
      typeField = (<Select
        value={this.props.io.type}
        onChange={(event: any) => {
          this.props.onTestTypeChange(event.target.value, this.props.index);
        }}
      // input={<OutlinedInput />}
      >
        <MenuItem value={'contains'}>Contains</MenuItem>
        <MenuItem value={'notContains'}>Does not contain</MenuItem>
        <MenuItem value={'equals'}>Equals</MenuItem>
      </Select>);
    }

    return (
      <div className={prefixer('test-name-and-type')}>
        <div className={prefixer('label-and-field-wrapper')}>
          <TextField
            className={prefixer('test-name')}
            defaultValue={testName}
            onChange={(event) => {
              this.props.onTestNameChange(event.currentTarget.value, this.props.index);
            }}
            variant="outlined"
            label="Testin nimi"
            placeholder="Testin nimi"
            InputLabelProps={{
              shrink: true,
            }}
            disabled={this.props.readOnly}
          />

          <Errors
            errors={this.props.tests[this.props.index].name.errors}
            keyBase={`${this.props.io.hash()} name`}
            show={this.props.showErrors}
          />
        </div>

        <div>
          <FormControl className={"prefixer('test-type')"}>
            <InputLabel shrink>
              Tyyppi
            </InputLabel>
            {typeField}
          </FormControl>
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

