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
  }

  render() {
    if (this.props.loggedIn) {
      return (
        <div className={prefixer('container')}>
          {this.props.review ? <Review /> : <Form />}
        </div>
      );
    }
    return <div className={prefixer('container')}>Sinun on oltava kirjautuneena nähdäksesi tämän sisällön.</div>;
  }
}

function mapStateToProps(state: State) {
  return {
    loggedIn: state.user.loggedIn,
  };
}

export default connect(mapStateToProps, null)(App);
