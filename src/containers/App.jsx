import React from 'react';
import { connect } from 'react-redux';
import UserInfo from '../components/UserInfo.jsx';
import Editor from '../components/Editor.jsx';
import GameViz from '../components/GameViz.jsx';

import ReactFireMixin from 'reactfire';
import mixin from 'react-mixin';

import Styles from './App.css';

import Game from '../tank_game/Game';

import { localLogin, loginUser, selectEditingAI } from '../store/actions';

// HAX
var template =
`
function takeTurn(map) {
  if (Math.random() > 0.7) {
    turnRight();
  } else if (Math.random() > 0.7) {
    turnLeft();
  } else {
    moveForward();
  }
}
`;

var dummyAi =
`
function takeTurn() {
  doNothing();
}
`;


class App extends React.Component {
  state = {
    loginError: false
  };

  constructor() {
    super();
    this.edit = this.edit.bind(this);
    this.playSolo = this.playSolo.bind(this);
    this.playMulti = this.playMulti.bind(this);
    this.logout = this.logout.bind(this);
    this.newProgram = this.newProgram.bind(this);
    this.changeName = this.changeName.bind(this);
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
    this.createGame();
    this.game.run([
      {source: this.props.ais.editingAi.source},
      {source: dummyAi},
      {source: dummyAi},
      {source: dummyAi}
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
      var name = this.refs[`player${i}Ai`].getDOMNode().value;
      if (name !== 'none') {
        players.push({source: getAi(name).source });
      }
    });
    this.game.run(players);
  }

  logout() {
    this.props.store.unauth();
    this.setState({uid: null});
    if (this.firebaseRefs.user) {
      this.unbind('user');
    }
  }

  edit(newCode) {
    this.firebaseRefs.currentAi.update({source: newCode});
  }

  changeName(event) {
    var newName = event.target.value;
    if (newName.length > 0) {
      this.firebaseRefs.currentAi.remove();
      var node = this.firebaseRefs.currentAi.parent().child(newName);
      node.set({ name: newName, source: this.state.currentAi.source });
      this.unbind('currentAi');
      this.bindAsObject(node, 'currentAi');
    }
  }

  newProgram() {
    var node = this.props.store.child(`ais/${this.state.uid}/Untitled`);
    node.set({ name: 'Untitled', source: template });
    this.selectProgram('Untitled');
  }

  render() {
    const { dispatch, ais } = this.props;
    if (this.state.loginError) {
      return <div>Could not log in</div>;
    } else {
      var allAis = this.props.allAis && Object.keys(this.props.allAis).map(uid =>
        uid !== '.key' &&
        Object.keys(this.props.allAis[uid]).map(name => {
          var key = `${uid}/${name}`;
          return <option key={key} value={key}>{key}</option>;
        })
      );
      return (
        <div className={Styles.root}>
          <div className={Styles.main}>
            <GameViz game={this.state.game}/>
            <div className={Styles.editing}>
              <div>
                { ais.editingAi &&
                    <Editor program={ais.editingAi}
                      onRename={this.changeName}
                      onChange={this.edit} />
                }
                { ais.editingAi && <button onClick={this.playSolo}>Play Solo</button> }
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
              onLogout={this.logout}
              user={this.props.user}/>
            { this.props.user && <button onClick={this.newProgram}>New Program</button> }
            <br/>
            { ais.userAis.length > 0 &&
                <select size={5}
                        value={ais.editingAi && ais.editingAi.name}
                        onChange={(event) => dispatch(selectEditingAI(event.target.value))}>
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
