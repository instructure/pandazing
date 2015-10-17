import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import UserInfo from '../components/UserInfo.jsx';
import AiList from '../components/AiList.jsx';
import Editor from '../components/Editor.jsx';
import GameViz from '../components/GameViz.jsx';
import Border from '../components/Border.jsx';
import Title from '../components/Title.jsx';
import GameSetup from '../components/GameSetup.jsx';

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
    const ai = this.findAi(this.props.editingAi);
    this.createGame();
    this.game.run([
      {source: ai.source},
      {source: Game.dummyAi()},
      {source: Game.dummyAi()},
      {source: Game.dummyAi()}
    ]);
  }

  playMulti(players) {
    this.createGame();
    players = players.map(name => {
      var [uid, ai] = name.split('/');
      return { source: this.props.ais[uid][ai].source };
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
    const editingAi = this.findAi(this.props.editingAi);
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
        <GameViz game={this.state.game}/>

        <div className={Styles.controlPanel}>
          <Border className={Styles.editor}>
            { editingAi ?
            <Editor uid={user.uid} program={editingAi}
              onRename={(newName) => dispatch(renameAi(user.uid, editingAi.name, newName))}
              onChange={(newSource) => dispatch(editAi(user.uid, editingAi.name, newSource))}
              onReturn={() => dispatch(selectEditingAi(null))}
              onPlay={this.playSolo} />
            :
            <AiList user={user} ais={_.values(userAis)}
              onLogin={() => dispatch(loginUser())}
              onLogout={() => dispatch(logoutUser())}
              onSelect={(event) => dispatch(selectEditingAi(event.target.value))}
              onCreate={() => dispatch(newAi(user.uid, user.handle, 'Untitled', Game.aiTemplate()))} />
            }
          </Border>

          <Border className={Styles.gameSetup}>
            <GameSetup ais={allAis}
              onPlay={this.playMulti} />
          </Border>
        </div>
      </div>
    );
  }
}

export default connect(a => a)(App);
