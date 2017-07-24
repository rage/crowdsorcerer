// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'state/reducer';
import prefixer from 'utils/class-name-prefixer';
import { giveReviewAction } from 'state/review';
import MdSentimentVeryDissatisfied from 'react-icons/lib/md/sentiment-very-dissatisfied';
import MdSentimentDissatisfied from 'react-icons/lib/md/sentiment-dissatisfied';
import MdSentimentNeutral from 'react-icons/lib/md/sentiment-neutral';
import MdSentimentSatisfied from 'react-icons/lib/md/sentiment-satisfied';
import MdSentimentVerySatisfied from 'react-icons/lib/md/sentiment-very-satisfied';

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;

class ReviewScale extends Component {

  constructor(props) {
    super(props);

    this.focusables = [];
  }

  componentDidMount() {
    this.focusables[1] = document.getElementById(`${this.props.question}-veryDissatisfied`);
    this.focusables[2] = document.getElementById(`${this.props.question}-dissatisfied`);
    this.focusables[3] = document.getElementById(`${this.props.question}-neutral`);
    this.focusables[4] = document.getElementById(`${this.props.question}-satisfied`);
    this.focusables[5] = document.getElementById(`${this.props.question}-verySatisfied`);
  }

  focusables: Array<HTMLElement | null>

  props: {
    question: string,
    answer: number,
    giveReview: (string, number) => void,
  }

  radioOnKeyDown(e: KeyboardEvent) {
    let answer = !this.props.answer ? 0 : this.props.answer;
    let reviewKeyPressed = false;
    switch (e.keyCode) {
      case KEY_UP:
      case KEY_RIGHT:
        answer = (answer + 1 <= 5) ? (answer + 1) : 1;
        this.props.giveReview(this.props.question, answer);
        reviewKeyPressed = true;
        break;
      case KEY_DOWN:
      case KEY_LEFT:
        answer = (answer - 1 >= 1) ? (answer - 1) : 5;
        this.props.giveReview(this.props.question, answer);
        reviewKeyPressed = true;
        break;
      default:
    }
    if (reviewKeyPressed && this.focusables[answer]) { this.focusables[answer].focus(); }
  }

  render() {
    const notChosen = prefixer('scale-icon');
    const highlighted = `${notChosen}-highlighted`;
    return (
      <div
        className={prefixer('scale')}
        role="radiogroup"
        aria-label={`${this.props.question}`}
        tabIndex="0"
      >
        <MdSentimentVeryDissatisfied
          className={this.props.answer === 1 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 1)}
          id={`${this.props.question}-veryDissatisfied`}
          role="radio"
          aria-checked={this.props.answer === 1}
          onKeyDown={e => this.radioOnKeyDown(e)}
          tabIndex={this.props.answer === 1 || this.props.answer === undefined ? '0' : '-1'}
        />
        <MdSentimentDissatisfied
          className={this.props.answer === 2 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 2)}
          id={`${this.props.question}-dissatisfied`}
          role="radio"
          aria-checked={this.props.answer === 2}
          tabIndex={this.props.answer === 2 ? '0' : '-1'}
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
        <MdSentimentNeutral
          className={this.props.answer === 3 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 3)}
          id={`${this.props.question}-neutral`}
          role="radio"
          aria-checked={this.props.answer === 3}
          tabIndex={this.props.answer === 3 ? '0' : '-1'}
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
        <MdSentimentSatisfied
          className={this.props.answer === 4 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 4)}
          id={`${this.props.question}-satisfied`}
          role="radio"
          aria-checked={this.props.answer === 4}
          tabIndex={this.props.answer === 4 ? '0' : '-1'}
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
        <MdSentimentVerySatisfied
          className={this.props.answer === 5 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 5)}
          id={`${this.props.question}-verySatisfied`}
          role="radio"
          aria-checked={this.props.answer === 5}
          tabIndex={this.props.answer === 5 ? '0' : '-1'}
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    giveReview(question: string, value: number) {
      dispatch(giveReviewAction(question, value));
    },
  };
}

export default connect(null, mapDispatchToProps)(ReviewScale);

