// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { Button, Row, Container, Label, Input, Col, ListGroup, ListGroupItem } from 'reactstrap';
import CodeMirror from 'react-codemirror';
import { reduxForm, Form } from 'redux-form';
import 'codemirror/mode/clike/clike';

class AssignmentForm extends Component {

  onAddFieldClick() {

  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Container>
          <Label className={prefixer('instructions')}>
            Tehtävänanto </Label>
          <Row>
            <Input
              type="textarea"
              id="assignment"
              className={prefixer('assignment')}
              value={this.props.assignment}
            />
          </Row>
          <Label className={prefixer('instructions')}>
            Malliratkaisu
          </Label >
          <Row>
            <CodeMirror
              className={prefixer('model-solution')}
              options={{ mode: 'java' }}
              value={this.props.modelSolution}
            />
          </Row>
          <Label className={prefixer('instructions')}>
            Testit
          </Label >
          {
            this.props.inputOutput.map((io, index) => (
              <Row>
                <Col>
                  <Label for={`input ${index}`}>Syöte</Label>
                  <Input type="text" name={`input ${index}`} value={io[0]} />
                </Col>
                <Col>
                  <Label for={`output ${index}`}>Tulos</Label>
                  <Input type="text" name={`output ${index}`} value={io[1]} />
                </Col>
              </Row>
            ))
          }
          <Row>
            <Button color="basic" className="btn-block" onClick={() => this.onAddFieldClick()}>
              + Lisää kenttä
            </Button>
          </Row>
          <Button color="success">
            Submit
        </Button>
        </Container>
      </Form>
    );
  }
}

export default reduxForm({
  form: 'assignment',
})(AssignmentForm);
