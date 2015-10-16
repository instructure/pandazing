export const USER_UPDATE = 'USER_UPDATE';
export const FIREBASE_LOGIN = 'FIREBASE_LOGIN';

import Firebase from 'firebase';
const firebase = new Firebase('https://inst-tanks.firebaseio.com');

// used internally when the user object is updated in firebase
function userUpdate(user) {
  return { type: USER_UPDATE, user };
}

// used internally when we get logged in, either via oauth or saved localStorage
function subscribeToUser(uid) {
  const node = firebase.child('users').child(uid);
  node.off();
  return dispatch =>
    node.on('value', (data) => dispatch(userUpdate(data.exportVal())));
}

// attempt to login using the saved session in localStorage
export function localLogin() {
  return dispatch => {
    var authData = firebase.getAuth();
    if (authData) {
      dispatch(subscribeToUser(authData.uid));
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
      dispatch(subscribeToUser(user.uid));
    });
  };
}
