import React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import _ from 'underscore';

import UserInfo from '../components/UserInfo.jsx';
import Editor from '../components/Editor.jsx';
import GameViz from '../components/GameViz.jsx';
import Border from '../components/Border.jsx';

import mixin from 'react-mixin';

import Styles from './App.css';

import Game from '../tank_game/Game';

import {
  localLogin, loginUser, logoutUser, newAi, selectEditingAi, editAi, renameAi
} from '../store/actions';

class App extends React.Component {
  constructor() {
    super();
    this.playSolo = this.playSolo.bind(this);
    this.playMulti = this.playMulti.bind(this);
  }

  componentWillMount() {
    // create a dummy game just to show the viz
    this.createGame();
    this.props.dispatch(localLogin());
  }

  createGame() {
    if (this.game) {
      this.game.abort();
    }
    this.game = new Game();
    this.game.onupdate = game => this.setState({game});
    this.setState({game: this.game});
  }

  playSolo() {
    const ai = this.findAi(this.props.ais.editingAi);
    this.createGame();
    this.game.run([
      {source: ai.source},
      {source: Game.dummyAi()},
      {source: Game.dummyAi()},
      {source: Game.dummyAi()}
    ]);
  }

  playMulti() {
    this.createGame();
    var players = [];
    var getAi = name => {
      var [uid, ai] = name.split('/');
      return this.props.ais[uid][ai];
    };
    [1, 2, 3, 4].forEach(i => {
      // TODO: redux-ify this and save choices with localStorage
      var name = findDOMNode(this.refs[`player${i}Ai`]).value;
      if (name !== 'none') {
        players.push({source: getAi(name).source });
      }
    });
    this.game.run(players);
  }

  findAi(name) {
    return this.userAis()[name];
  }

  userAis() {
    return this.props.ais[this.props.user.uid] || {};
  }

  render() {
    const { user, dispatch, ais } = this.props;
    const editingAi = this.findAi(ais.editingAi);
    const userAis = this.userAis();

    var allAis = Object.keys(this.props.ais).map(uid =>
      Object.keys(this.props.ais[uid]).map(name => {
        var key = `${uid}/${name}`;
        var disp = `${this.props.ais[uid][name].username}/${name}`;
        return <option key={key} value={key}>{disp}</option>;
      })
    );
    return (
      <div className={Styles.root}>
        <Border>
          <UserInfo
              onLogin={() => dispatch(loginUser())}
              onLogout={() => dispatch(logoutUser())}
              user={user}/>
        </Border>

        <GameViz game={this.state.game}/>

        <div className={Styles.main}>

            <Border>
              <div className={Styles.bot}>
                <h2>MAKE YOUR PANDA BOT</h2>

                <div className={Styles.bot_stuff}>
                  <div className={Styles.botedit}>
                    <Editor program={editingAi}
                      onRename={(newName) => dispatch(renameAi(user.uid, editingAi.name, newName))}
                      onChange={(newSource) => dispatch(editAi(user.uid, editingAi.name, newSource))} />
                  </div>

                  <div className={Styles.botlist}>
                    <button className="button--link" disabled={!user.uid} onClick={() =>
                        dispatch(newAi(user.uid, user.handle, 'Untitled', Game.aiTemplate()))}>
                      [+] New Bot
                    </button>
                    <div>
                      <select size={10}
                              value={ais.editingAi && ais.editingAi}
                              onChange={(event) => dispatch(selectEditingAi(event.target.value))}>
                        { _.values(userAis).map(ai =>
                          <option key={ai.name} value={ai.name}>{ai.name}</option>) }
                      </select>
                    </div>
                    <div className={Styles.actions}>
                      <button  disabled={!editingAi} onClick={this.playSolo}>Test Bot</button>
                    </div>
                  </div>
                </div>

              </div>
            </Border>



            <div className={Styles.multibot}>
              <div className={Styles.border}>
              <div className={Styles.multibot_select}>
                <h2>BATTLE SETUP</h2>

                <div>
                  <select ref='player1Ai'>
                    <option value='none'>None</option>
                    { allAis }
                  </select>
                  <br/>
                  <select ref='player2Ai'>
                    <option value='none'>None</option>
                    { allAis }
                  </select>
                  <br/>
                  <select ref='player3Ai'>
                    <option value='none'>None</option>
                    { allAis }
                  </select>
                  <br/>
                  <select ref='player4Ai'>
                    <option value='none'>None</option>
                    { allAis }
                  </select>
                </div>
              </div>
              </div>
              <button className={Styles.button_battle} onClick={this.playMulti}>Battle!</button>
            </div>

        </div>
      </div>
    );
  }
}

export default connect(a => a)(App);
