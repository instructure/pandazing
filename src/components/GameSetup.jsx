import React from 'react';
import { findDOMNode } from 'react-dom';

import Title from './Title.jsx';
import Button from './Button.jsx';

import Styles from './GameSetup.css';

export default class GameSetup extends React.Component {
  onPlay() {
    let players = [];
    [1, 2, 3, 4].forEach(i => {
      // TODO: redux-ify this and save choices with localStorage
      var name = findDOMNode(this.refs[`player${i}Ai`]).value;
      if (name !== 'none') {
        players.push(name);
      }
    });
    this.props.onPlay(players);
  }

  render() {
    const { ais, onPlay } = this.props;

    return (
      <div className={Styles.root}>
        <Title>BATTLE SETUP</Title>
        <select ref='player1Ai'>
          <option value='none'>None</option>
          { ais }
        </select>
        <select ref='player2Ai'>
          <option value='none'>None</option>
          { ais }
        </select>
        <select ref='player3Ai'>
          <option value='none'>None</option>
          { ais }
        </select>
        <select ref='player4Ai'>
          <option value='none'>None</option>
          { ais }
        </select>
        <Button buttonType='battle'
            onClick={this.onPlay.bind(this)}>
          Battle!
        </Button>
      </div>
    );
  }
}
