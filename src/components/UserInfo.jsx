import React from 'react';
import Button from '../components/Button.jsx';
import Styles from './UserInfo.css';

export default class UserInfo extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <div className={Styles.root}>
      {user.uid &&
        <div className={Styles.user}>
          Hello, {user.handle}
        </div>
      }
      {user.uid ?
        <Button onClick={this.props.onLogout}>Log Out</Button> :
        <Button onClick={this.props.onLogin}>Log In!</Button>
      }
      </div>);
  }
}
