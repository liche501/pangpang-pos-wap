import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import HomeContainer from './HomeContainer';
import LoginContainer from './LoginContainer';



function validateAccount(nextState, replaceState) {
  if (nextState.location.pathname !== "/login" && !sessionStorage.getItem("account")) {
    replaceState('/login');
  } else if (nextState.location.pathname === "/login" && sessionStorage.getItem("account")) {
    replaceState('/');
  }
}


export default class App extends Component {
  render() {
    return (
      <Router history={hashHistory} >
        <Route path='/' component={HomeContainer} onEnter={validateAccount}>
        </Route>

        <Route path='/login' component={LoginContainer} onEnter={validateAccount}>
        </Route>
      </Router>
    );
  }
}


