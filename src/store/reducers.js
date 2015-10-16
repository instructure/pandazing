import { combineReducers } from 'redux';
import * as actions from './actions';

/*
{
  user: {
    uid: '',
    handle: '',
    avatar: '',
  },
  ais: {
    userAis: [
      { name: '', source: '' }
    ],
    editingAi: { name: '', source: '' }
  },
  allAis: {
    <userId>: {
      <name>: { name: '', source: '' }
    }
  }
}
*/

function user(state = null, action) {
  switch (action.type) {
    case actions.USER_UPDATE:
      return action.user;
    default:
      return state;
  }
}

function ais(state = { userAis: [] }, action) {
  switch (action.type) {
    case actions.AIS_UPDATE:
      return Object.assign({}, state, { userAis: action.ais });
    case actions.SELECT_EDITING_AI:
      const ai = state.userAis.filter(a => a.name === action.name)[0];
      return Object.assign({}, state, { editingAi: ai });
    default:
      return state;
  }
}

function allAis(state = {}, action) {
  switch (action.type) {
    case actions.ALL_AIS_UPDATE:
      return Object.assign({}, action.ais);
    default:
      return state;
  }
}

export default combineReducers({
  user,
  ais,
  allAis
});
