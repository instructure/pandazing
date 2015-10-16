import React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import UserInfo from '../components/UserInfo.jsx';
import Editor from '../components/Editor.jsx';
import GameViz from '../components/GameViz.jsx';

import ReactFireMixin from 'reactfire';
import mixin from 'react-mixin';

import Styles from './App.css';

import Game from '../tank_game/Game';

import {
  localLogin, loginUser, logoutUser, newAi, selectEditingAi, editAi, renameAi
} from '../store/actions';

class App extends React.Component {
  state = {
    loginError: false
  };

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
    const ai = this.findAi(this.props.ais.userAis, this.props.ais.editingAi);
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
      return this.props.allAis[uid][ai];
    };
    [1, 2, 3, 4].forEach(i => {
      var name = findDOMNode(this.refs[`player${i}Ai`]).value;
      if (name !== 'none') {
        players.push({source: getAi(name).source });
      }
    });
    this.game.run(players);
  }

  findAi(ais, name) {
    return ais.filter(a => a.name === name)[0];
  }

  render() {
    const { user, dispatch, ais } = this.props;
    const editingAi = this.findAi(ais.userAis, ais.editingAi);

    if (this.state.loginError) {
      return <div>Could not log in</div>;
    } else {
      var allAis = this.props.allAis && Object.keys(this.props.allAis).map(uid =>
        uid !== '.key' &&
        Object.keys(this.props.allAis[uid]).map(name => {
          var key = `${uid}/${name}`;
          var disp = `${this.props.allAis[uid][name].username}/${name}`;
          return <option key={key} value={key}>{disp}</option>;
        })
      );
      return (
        <div className={Styles.root}>
          <div className={Styles.main}>
            <GameViz game={this.state.game}/>
            <div className={Styles.editing}>
              <div>
                <Editor program={editingAi}
                  onRename={(newName) => dispatch(renameAi(user.uid, editingAi.name, newName))}
                  onChange={(newSource) => dispatch(editAi(user.uid, editingAi.name, newSource))} />
                <button disabled={!editingAi} onClick={this.playSolo}>Play Solo</button>
              </div>
              <div>
                <p>Multiplayer</p>
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
                <br/>
                <button onClick={this.playMulti}>Battle</button>
              </div>
            </div>
          </div>
          <div className={Styles.sidebar}>
            <UserInfo
              onLogin={() => dispatch(loginUser())}
              onLogout={() => dispatch(logoutUser())}
              user={this.props.user}/>
            { this.props.user &&
              <button onClick={() =>
                  dispatch(newAi(user.uid, user.handle, 'Untitled', Game.aiTemplate()))}>
                New Program
              </button> }
            <br/>
            { ais.userAis.length > 0 &&
                <select size={5}
                        value={ais.editingAi && ais.editingAi}
                        onChange={(event) => dispatch(selectEditingAi(event.target.value))}>
                  { ais.userAis.map(ai => <option key={ai.name} value={ai.name}>{ai.name}</option>) }
                </select>
            }
          </div>
        </div>
      );
    }
  }
}

mixin(App.prototype, ReactFireMixin);

export default connect(a => a)(App);
