// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State } from 'state/reducer';
import Form from './assignment-form';
import Review from './review';

class App extends Component {

  props: {
    review: boolean,
    loggedIn: () => void,
    editableModelSolution: ?string,
  }

  render() {
    if (this.props.editableModelSolution !== undefined ||
      (this.props.readOnlyCodeTemplate !== undefined && this.props.readOnlyModelSolution !== undefined)) {
      if (this.props.loggedIn) {
        return (
          <div className={prefixer('container')}>
            {this.props.review ? <Review /> : <Form />}
          </div>
        );
      }
      return <div className={prefixer('container')}>Sinun on oltava kirjautuneena nähdäksesi tämän sisällön.</div>;
    }
    return <div className={prefixer('container')}>Loading</div>;
  }
}


function mapStateToProps(state: State) {
  return {
    loggedIn: state.user.loggedIn,
    editableModelSolution: state.form.modelSolution.editableModelSolution,
    readOnlyModelSolution: state.form.modelSolution.readOnlyModelSolution,
    readOnlyCodeTemplate: state.form.modelSolution.readOnlyCodeTemplate,
  };
}

export default connect(mapStateToProps, null)(App);
