import React from 'react';
import Styles from './UserInfo.css';

export default class UserInfo extends React.Component {
  render() {
    return (
      <div className={Styles.userinfo}>
      {this.props.user &&
        <div>
          Hello, {this.props.user.handle}
        </div>
      }

      {this.props.user ?

        <button onClick={this.props.onLogout}>Log Out</button> :
        <button onClick={this.props.onLogin}>Log In!</button>

      }

      </div>);
  }
}
