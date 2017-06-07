// @flow
import React, { Component } from 'react';
import prefixer from "utils/class-name-prefixer";
import { connect } from 'react-redux';
import { Row, Label, Input, Col, Button } from 'reactstrap';
import type { Dispatch } from 'state/reducer';
import { removeTestFieldAction } from 'state/form';
import {
  testInputChangeAction,
  testOutputChangeAction,
} from 'state/form';

class InputOutput extends Component {

  props: {
    index: number,
    io: Array<string>,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
  };

  render() {
    return (
      <Row>
        <Col>
          <Label for={`input ${this.props.index}`}>Syöte</Label>
          <Input
            type="text"
            name={`input ${this.props.index}`}
            value={this.props.io[0]}
            onChange={(event) => {
              this.props.onTestInputChange(event.currentTarget.value, this.props.index);
            }}
          />
        </Col>
        <Col>
          <Label for={`output ${this.props.index}`}>Tulos</Label>
          <Input
            type="text"
            name={`output ${this.props.index}`}
            value={this.props.io[1]}
            onChange={(event) => {
              this.props.onTestOutputChange(event.currentTarget.value, this.props.index);
            }}
          />
        </Col>
        <Col sm={1}>
          <Label> &nbsp; </Label>
          <button
            role="button"
            className={prefixer('close-button')}
            onClick={() => { this.props.onRemoveFieldClick(this.props.index); }}
          >
            &#10005;
          </button>
        </Col>
      </Row>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTestInputChange(input: string, index: number) {
      dispatch(testInputChangeAction(input, index));
    },
    onTestOutputChange(output: string, index: number) {
      dispatch(testOutputChangeAction(output, index));
    },
    onRemoveFieldClick(index) {
      dispatch(removeTestFieldAction(index));
    },
  };
}

export default connect(null, mapDispatchToProps)(InputOutput);
