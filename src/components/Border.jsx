import React from 'react';

import Styles from './Border.css';

export default class Border extends React.Component {
  render() {
    return (
      <div className={Styles.root}>
        {this.props.children}
      </div>
    );
  }
}
