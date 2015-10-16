export const USER_UPDATE = 'USER_UPDATE';
export const FIREBASE_LOGIN = 'FIREBASE_LOGIN';
export const AIS_UPDATE = 'AIS_UPDATE';
export const SELECT_EDITING_AI = 'SELECT_EDITING_AI';

import Firebase from 'firebase';
const firebase = new Firebase('https://inst-tanks.firebaseio.com');

// used internally when the user object is updated in firebase
function userUpdate(user) {
  return { type: USER_UPDATE, user };
}

function userAIsUpdate(ais) {
  return { type: AIS_UPDATE, ais };
}

// used internally when we get logged in, either via oauth or saved localStorage
function loggedIn(uid) {
  const node = firebase.child('users').child(uid);
  return dispatch => {
    node.on('value', data => dispatch(userUpdate(data.exportVal())));
    // should really subscribe to specific child updates
    firebase.child('ais').child(uid).on('value', data => {
      let vals = [];
      // need to return false to continue iteration
      data.forEach(val => vals.push(val.val()) && false);
      dispatch(userAIsUpdate(vals));
    });
  };
}

// attempt to login using the saved session in localStorage
export function localLogin() {
  return dispatch => {
    var authData = firebase.getAuth();
    if (authData) {
      dispatch(loggedIn(authData.uid));
    }
  };
}

// initiate a new github login
export function loginUser() {
  return dispatch => {
    firebase.authWithOAuthPopup('github', (error, authData) => {
      // TODO: error
      var user = {
        uid: authData.uid,
        handle: authData.github.username,
        avatar: authData.github.profileImageURL,
        name: authData.github.displayName,
        email: authData.github.email
      };
      firebase.child('users').child(user.uid).set(user);
      dispatch(loggedIn(user.uid));
    });
  };
}

export function selectEditingAI(name) {
  return { type: SELECT_EDITING_AI, name };
}
