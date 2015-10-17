import React from 'react';

import Styles from './Title.css';

export default class Title extends React.Component {
  render() {
    return (
      <h1 className={Styles.title}>
        {this.props.children}
      </h1>
    );
  }
}
