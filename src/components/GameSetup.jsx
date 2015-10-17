import React from 'react';

import Title from './Title.jsx';
import Button from './Button.jsx';

import Styles from './GameSetup.css';

export default class GameSetup extends React.Component {
  render() {
    const { ais, onPlay } = this.props;

    return (
      <div className={Styles.root}>
        <div className={Styles.multibot_select}>
          <Title>BATTLE SETUP</Title>

          <div>
            <select ref='player1Ai'>
              <option value='none'>None</option>
              { ais }
            </select>
            <br/>
            <select ref='player2Ai'>
              <option value='none'>None</option>
              { ais }
            </select>
            <br/>
            <select ref='player3Ai'>
              <option value='none'>None</option>
              { ais }
            </select>
            <br/>
            <select ref='player4Ai'>
              <option value='none'>None</option>
              { ais }
            </select>
          </div>
        </div>
        <Button buttonType='battle'
            className={Styles.button_battle}
            onClick={onPlay}>
          Battle!
        </Button>
      </div>
    );
  }
}
