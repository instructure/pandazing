import React from 'react';
import classNames from 'classnames';

import Styles from './Border.css';

export default class Border extends React.Component {
  render() {
    return (
      <div className={classNames(Styles.root, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
