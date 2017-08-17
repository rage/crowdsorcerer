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
    modelSolution: ?string,
  }

  render() {
    if (this.props.modelSolution !== undefined) {
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
    modelSolution: state.form.modelSolution,
  };
}

export default connect(mapStateToProps, null)(App);
