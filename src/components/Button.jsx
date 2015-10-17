import React from 'react';

import Styles from './Button.css';

export default class Button extends React.Component {
  render() {
    return (
      <button className={Styles[this.props.buttonType]} disabled={this.props.disabled} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: React.PropTypes.func,
  buttonType: React.PropTypes.string,
  disabled: React.PropTypes.bool
};

Button.defaultProps = {
  buttonType: 'button'
};
