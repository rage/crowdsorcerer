// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import Transition from 'react-motion-ui-pack';

export default class ProgressBar extends Component {

  constructor(props: Object) {
    super(props);
    this.state = { animationStart: 0, width: 300 };
  }


  state: {
    animationStart: number,
    width: number,
  }

  componentWillReceiveProps() {
    const width = this.progressBar.getBoundingClientRect().width;
    this.setState({ animationStart: this.props.progressPercent, width });
  }

  progressBar: HTMLDivElement;

  props: {
    progressPercent: number,
  }

  scale(n: number): number {
    const scaledProgressPercent = (n === undefined ? 0 : n);
    return scaledProgressPercent * this.state.width;
  }

  render() {
    const progressValue = this.scale(this.props.progressPercent);
    return (
      <div className={prefixer('progress-bar')} ref={(e) => { this.progressBar = e; }}>
        <Transition
          appear={{ width: this.scale(this.state.animationStart) }}
          enter={{ width: progressValue }}
          leave={{ width: progressValue }}
        >
          <div key={progressValue.toString()} className={prefixer('progress')} />
        </Transition>
      </div>
    );
  }
}

