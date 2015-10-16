import { combineReducers } from 'redux';
import * as actions from './actions';

function user(state = null, action) {
  switch (action.type) {
    case actions.USER_UPDATE:
      return action.user;
    default:
      return state;
  }
}

export default combineReducers({
  user
});
