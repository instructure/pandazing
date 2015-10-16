import React from 'react';
import classNames from 'classnames';

import Styles from './Sprite.css';

export default class Sprite extends React.Component {
  render() {
    var styles = {
      top: this.props.y + 'em',
      left: this.props.x + 'em'
    };
    var spriteClassNames = classNames(
      Styles.root,
      Styles[this.props.sprite],
      Styles[this.props.facing]
    );
    return (
      <div
        className={spriteClassNames}
        style={styles} />
    );
  }
}
