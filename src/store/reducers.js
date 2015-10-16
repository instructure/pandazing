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
    editingAi: <name>
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
      return Object.assign({}, state, { editingAi: action.name });
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
