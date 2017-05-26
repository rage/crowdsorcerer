// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import Form from './assignment-form';

class App extends Component {

  render() {
    return (
      <div className={prefixer('container')}>
        <Form />
      </div>
    );
  }
}

export default App;
