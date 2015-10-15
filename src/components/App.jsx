import React from 'react';
import UserInfo from './UserInfo.jsx';
import Editor from './Editor.jsx';
import GameViz from './GameViz.jsx';

import ReactFireMixin from 'reactfire';
import mixin from 'react-mixin';

import Styles from './App.css';

// HAX
import Game from '../tank_game/Game';
window.game = new Game();
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


export default class App extends React.Component {
  state = {
    loginError: false,
    uid: null,
    user: null,
    ais: null, // the player's own ais
    allAis: null, // everybody's ais!
    currentAi: null
  };

  constructor() {
    super();
    this.edit = this.edit.bind(this);
    this.playSolo = this.playSolo.bind(this);
    this.playMulti = this.playMulti.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.newProgram = this.newProgram.bind(this);
    this.changeName = this.changeName.bind(this);
    this.programChanged = this.programChanged.bind(this);
  }

  componentWillMount() {
    var authData = this.props.store.getAuth();
    if (authData) {
      this.loggedIn(authData);
    }
    this.bindAsObject(this.props.store.child('ais'), 'allAis');
  }

  playSolo() {
    window.game.run([{source: this.state.currentAi.source}]);
  }

  playMulti() {
    var players = [];
    var getAi = name => {
      var [uid, ai] = name.split('/');
      return this.state.allAis[uid][ai];
    };
    var name = this.refs.player1Ai.getDOMNode().value;
    if (name !== 'none') {
      players.push({source: getAi(name).source });
    }
    name = this.refs.player2Ai.getDOMNode().value;
    if (name !== 'none') {
      players.push({source: getAi(name).source });
    }
    window.game.run(players);
  }

  login() {
    this.props.store.authWithOAuthPopup('github', (error, authData) => {
      if (error) {
        this.setState({loginError: true});
      } else {
        var userData = {
          handle: authData.github.username,
          avatar: authData.github.profileImageURL,
          name: authData.github.displayName,
          email: authData.github.email
        };
        var user = this.props.store.child('users').child(authData.uid);
        user.set(userData);
        this.loggedIn(authData);
      }
    });
  }

  logout() {
    this.props.store.unauth();
    this.setState({uid: null});
    if (this.firebaseRefs.user) {
      this.unbind('user');
    }
  }

  loggedIn(authData) {
    this.setState({uid: authData.uid});
    this.bindAsObject(this.props.store.child('users').child(authData.uid), 'user');
    this.bindAsArray(this.props.store.child('ais').child(authData.uid), 'ais');
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

  selectProgram(name) {
    var node = this.props.store.child(`ais/${this.state.uid}/${name}`);
    if (this.firebaseRefs.currentAi) {
      this.unbind('currentAi');
    }
    this.bindAsObject(node, 'currentAi');
  }

  programChanged(event) {
    this.selectProgram(event.target.value);
  }

  componentWillUpdate() {
    if (!this.state.currentAi && this.state.ais && this.state.ais.length > 0) {
      this.selectProgram(this.state.ais[0].name);
    }
  }

  render() {
    if (this.state.loginError) {
      return <div>Could not log in</div>;
    } else {
      var allAis = this.state.allAis && Object.keys(this.state.allAis).map(uid =>
        uid !== '.key' &&
        Object.keys(this.state.allAis[uid]).map(name => {
          var key = `${uid}/${name}`;
          return <option key={key} value={key}>{key}</option>;
        })
      );
      return (
        <div className={Styles.root}>
          <div className={Styles.main}>
            <GameViz game={window.game}/>
            <div className={Styles.editing}>
              <div>
                { this.state.currentAi &&
                    <Editor program={this.state.currentAi}
                      onRename={this.changeName}
                      onChange={this.edit} />
                }
                { this.state.currentAi && <button onClick={this.playSolo}>Play Solo</button> }
              </div>
              <div>
                <p>Multiplayer</p>
                <select ref='player1Ai'>
                  <option value='none'>None</option>
                  { allAis }
                </select>
                <select ref='player2Ai'>
                  <option value='none'>None</option>
                  { allAis }
                </select>
                <button onClick={this.playMulti}>Battle</button>
              </div>
            </div>
          </div>
          <div className={Styles.sidebar}>
            <UserInfo
              onLogin={this.login}
              onLogout={this.logout}
              user={this.state.user}/>
            { this.state.user && <button onClick={this.newProgram}>New Program</button> }
            <br/>
            { this.state.ais &&
                <select size={5}
                        value={this.state.currentAi && this.state.currentAi.name}
                        onChange={this.programChanged}>
                  { this.state.ais.map(ai => <option key={ai.name} value={ai.name}>{ai.name}</option>) }
                </select>
            }
          </div>
        </div>
      );
    }
  }
}

mixin(App.prototype, ReactFireMixin);
