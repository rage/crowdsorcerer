// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Row, Label, Input } from 'reactstrap';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { assignmentChangeAction } from 'state/form';

class Assignment extends Component {

  props: {
    assignment: string,
    onAssignmentChange: (assignment: string) => void,
  }

  render() {
    return (
      <div>
        <Row>
          <Label className={prefixer('instructions')}>
            Tehtävänanto
          </Label>
        </Row>
        <Row>
          <Input
            type="textarea"
            id="assignment"
            className={prefixer('assignment')}
            value={this.props.assignment}
            onChange={(event) => {
              this.props.onAssignmentChange(event.currentTarget.value);
            }}
          />
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    assignment: state.form.assignment,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onAssignmentChange(assignment: string) {
      dispatch(assignmentChangeAction(assignment));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Assignment);
