import React from 'react';

export default class UserInfo extends React.Component {
  render() {
    return (<div>
      {this.props.user &&
        <div>
          <img width="32" height="32" src={this.props.user.avatar} />
          {this.props.user.handle}
        </div>
      }
      {this.props.user ?
        <button onClick={this.props.onLogout}>Log Out</button> :
        <button onClick={this.props.onLogin}>Log In!</button>}
    </div>);
  }
}
