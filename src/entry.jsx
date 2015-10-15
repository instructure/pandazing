import React from 'react';
import App from './components/App.jsx';
import Firebase from 'firebase';

var fb = new Firebase('https://inst-tanks.firebaseio.com');

React.render(<App store={fb} />, document.getElementById('app'));
