import React from 'react';

import Title from './Title.jsx';
import Button from './Button.jsx';

import Styles from './AiList.css';

export default class AiList extends React.Component {
  render() {
    const { user, ais } = this.props;
    const uid = user && user.uid;

    return (
      <div className={Styles.root}>
        <Title>MAKE YOUR PANDA BOT</Title>
        <p>{ uid && `Hello, ${user.handle}. ` }Your Bots:</p>
        <select size={10}
                onChange={this.props.onSelect}>
          { ais.map(ai =>
            <option key={ai.name} value={ai.name}>{ai.name}</option>) }
        </select>
        <div className={Styles.actions}>
          {this.actions()}
        </div>
      </div>
    );
  }

  actions() {
    if (this.props.user.uid) {
      return ([
        <Button key='new' onClick={this.props.onCreate}>
          [+] New Bot
        </Button>,
        <Button key='logout' onClick={this.props.onLogout}>
          Log Out
        </Button>
      ]);
    } else {
      return (
        <Button onClick={this.props.onLogin}>
          Log In To Create A Bot
        </Button>
      );
    }
  }
}
