// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import CodeMirror from '@skidding/react-codemirror';
import type { State, Dispatch } from 'state/reducer';
import { connect } from 'react-redux';
import { formSubmitButtonPressedAction, deleteMarkersAction, changePreviewStateAction } from 'state/form';
import FormValue from 'domain/form-value';

class Preview extends Component {
  constructor(props) {
    super(props);

    this.model = this.props.editableModelSolution.get();
    const lines = this.props.editableModelSolution.get().split('\n');
    this.template = lines.filter(line => !this.props.solutionRows.get().includes(lines.indexOf(line))).join('\n');
  }

  componentDidMount() {
    this.showMarkers();
  }

  showMarkers() {
    const codeDocument = this.modelCm.getCodeMirror().getDoc();
    for (let i = 0; i <= codeDocument.getEditor().lineCount(); i++) {
      codeDocument.removeLineClass(i, 'background', prefixer('hiddenRow'));
    }

    this.props.solutionRows.get().forEach((row) => {
      codeDocument.addLineClass(row, 'background', prefixer('hiddenRow'));
    });
  }

  modelCm: CodeMirror;
  model: string;
  template: string;

  props: {
    handleSubmit: () => void,
    handleClosePreview: () => void,
    editableModelSolution: FormValue<string>,
    solutionRows: FormValue<Array<number>>,
  }

  render() {
    return (
      <div className={prefixer('preview-display')}>
        <div className={prefixer('preview-container')}>
          <div id="preview" className={prefixer('instructions')}>
            Tässä on luomasi tehtävän tehtäväpohja ja malliratkaisu.
            Malliratkaisun tehtäväpohjasta poikkeavat rivit on merkitty sinisellä taustavärillä.
            Ne eivät ole tehtävän tekijälle annettavassa tehtäväpohjassa.<br />
            Mikäli näyttää siltä, että tehtäväpohjassa on malliratkaisuun tarkoittamiasi rivejä,
            palaathan takaisin ja korjaat asian.
          </div>
          {/* <div className={prefixer('model-and-template')}> */}
          <div className={prefixer('preview-code-wrapper')}>
            <div id="preview-template" className={prefixer('instructions')}>
                Tehtäväpohja
              </div>
            <CodeMirror
              aria-labelledby="templatePreview"
              className={prefixer('preview-code')}
              options={{
                mode: 'text/x-java',
                lineNumbers: true,
                tabSize: 4,
                indentUnit: 4,
                readOnly: 'nocursor',
                dragDrop: false,
              }}
              value={this.template}
              aria-required
            />
          </div>
          <div className={prefixer('preview-code-wrapper')}>
            <div id="preview-model" className={prefixer('instructions')}>
                Malliratkaisu
              </div>
            <CodeMirror
              aria-labelledby="modelPreview"
              className={prefixer('preview-code')}
              options={{
                mode: 'text/x-java',
                lineNumbers: true,
                tabSize: 4,
                indentUnit: 4,
                readOnly: 'nocursor',
                dragDrop: false,
              }}
              value={this.model}
              ref={(input) => { this.modelCm = input; }}
              aria-required
            />
          </div>
          {/* </div> */}
          <div className={prefixer('preview-buttons')}>
            <button
              type="button"
              className={prefixer('cancel')}
              onClick={(e) => {
                e.preventDefault();
                this.props.handleClosePreview();
              }}
            >
            Return
            </button>
            <button
              type="button"
              className={prefixer('sender')}
              onClick={(e) => {
                e.preventDefault();
                this.props.handleSubmit();
                this.props.handleClosePreview();
              }}
            >
            Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state: State) {
  return {
    solutionRows: state.form.modelSolution.solutionRows,
    editableModelSolution: state.form.modelSolution.editableModelSolution,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(deleteMarkersAction());
      dispatch(formSubmitButtonPressedAction());
    },
    handleClosePreview() {
      dispatch(changePreviewStateAction(false));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
