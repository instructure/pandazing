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
    <userId>: {
      <name>: { name: '', source: '' }
    },
    editingAi: <name> // <userId> is the logged-in user
  }
}
*/

function user(state = {}, action) {
  switch (action.type) {
    case actions.USER_UPDATE:
      return action.user;
    default:
      return state;
  }
}

function ais(state = {}, action) {
  switch (action.type) {
    case actions.AIS_UPDATE:
      return Object.assign({}, state, action.ais);
    case actions.SELECT_EDITING_AI:
      return Object.assign({}, state, { editingAi: action.name });
    default:
      return state;
  }
}

export default combineReducers({
  user,
  ais
});
