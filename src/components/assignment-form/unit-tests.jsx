// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import CodeMirror, { TextMarker } from '@skidding/react-codemirror';
import type { State, Dispatch } from 'state/reducer';
import type { Change } from 'state/form/reducer';
import { connect } from 'react-redux';
import FormValue from 'domain/form-value';
import Errors from 'components/errors';
import { unitTestsChangeAction } from '../../state/form/index';

class UnitTests extends Component {

  constructor(props) {
    super(props);

    this.handleUnitTestsChange = this.handleUnitTestsChange.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  // copy-pasted from model-solution.jsx
  handleUnitTestsChange(cm, change) {
    let deletedReadOnly = false;

    if (change.to.line - change.from.line > 0) {
      if (change.from.ch === 0 && change.to.ch === 0) {
        // deleted the whole row
        // this check covers all cases which would end up editing a readnoly line
        if (this.props.readOnlyLines.includes(change.to.line)) {
          // force an empty newline in
          // no update on undo
          if (change.update) {
            change.update(change.from, change.to, [change.text[0], ''], 'forced');
          }
        }
      } else if (this.props.readOnlyLines.some(l => l >= change.from.line && l <= change.to.line)) {
        // don't allow deleting readOnly lines
        deletedReadOnly = true;
      } else {
        // normal case with whole line
        deletedReadOnly = this.props.readOnlyLines.includes(change.to.line);
      }
    }
    if ((this.props.readOnlyLines.includes(change.from.line) || deletedReadOnly) && change.origin !== 'setValue') {
      change.cancel();
    }
  }

  textInput: CodeMirror;
  markers: TextMarker;
  handleUnitTestsChange: (CodeMirror, Change) => void;

  props: {
    editableUnitTests: FormValue<string>,
    onUnitTestsChange: (string) => void,
    showErrors: boolean,
    readOnlyLines: number[],
  }

  render() {
    const value = this.props.editableUnitTests ? this.props.editableUnitTests.get() : '';
    const errors = [];

    return (
      <div className={prefixer('form-component')}>
        <div className={prefixer('same-line')}>
          <div id="unitTests" className={prefixer('instructions')}>
            Testikoodi
          </div>
        </div>
        <div tabIndex="0">
          <CodeMirror
            aria-labelledby="unitTests"
            className={prefixer('unit-tests')}
            options={{
              mode: 'text/x-java',
              lineNumbers: true,
              tabSize: 4,
              indentUnit: 4,
              dragDrop: false,
            }}
            value={value}
            onChange={(unitTests, change) => {
              if (change.origin === 'forced') {
                this.textInput.getCodeMirror().setCursor({ line: change.from.line, ch: change.text[0].length });
              }
              this.props.onUnitTestsChange(unitTests, change);
            }}
            ref={(input) => { this.textInput = input; }}
            aria-required
          />
        </div>
        <Errors errors={errors} show={this.props.showErrors} />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    editableUnitTests: state.form.unitTests.editableUnitTests,
    showErrors: state.form.showErrors,
    readOnlyLines: state.form.unitTests.readOnlyLines,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onUnitTestsChange(unitTests: string, change: Change) {
      dispatch(unitTestsChangeAction(unitTests, change));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnitTests);
