import React from 'react';
import Button from '../components/Button.jsx';
import Styles from './UserInfo.css';

export default class UserInfo extends React.Component {
  render() {
    return (
      <div className={Styles.userinfo}>
      {this.props.user.uid &&
        <div>
          Hello, {this.props.user.handle}
        </div>
      }
      {this.props.user.uid ?
        <Button onClick={this.props.onLogout}>Log Out</Button> :
        <Button onClick={this.props.onLogin}>Log In!</Button>
      }
      </div>);
  }
}
