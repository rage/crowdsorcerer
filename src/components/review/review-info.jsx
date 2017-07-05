// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';

export default class ReviewInfo extends Component {

  render() {
    return (
      <div className={prefixer('peer-review-info')}>
        <div className={prefixer('peer-review-title')}>Vertaisarviointi</div>
        <div className={prefixer('peer-review-instructions')}>Quisque dignissim quam eu mi lobortis, sed rutrum arcu sollicitudin. Aliquam hendrerit libero eu aliquet cursus. In ut nibh quis arcu efficitur semper vitae a leo. Maecenas tempor, neque sed placerat blandit, mi ligula tincidunt justo, eu commodo diam risus eget orci.</div>
        <div className={prefixer('zip-load-buttons')}>
          <button className={prefixer('zip-load-button')}>Lataa mallivastauksen ZIP </button>
          <button className={prefixer('zip-load-button')}>Lataa tehtäväpohjan ZIP </button>
        </div>
      </div>
    );
  }
}
