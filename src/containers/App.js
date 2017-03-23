import React, { Component } from 'react';
import { Router, Route, hashHistory } from 'react-router';
import HomeContainer from './HomeContainer';
import LoginContainer from './LoginContainer';
import BasketListContainer from './BasketListContainer';
import ProductDetailContainer from './ProductDetailContainer';
import PayContainer from './PayContainer';



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
        <Route path='/' component={HomeContainer} onEnter={validateAccount} >
        </Route>
        <Route path='/basketlist' component={BasketListContainer} onEnter={validateAccount} />
        <Route path='/product-detail' component={ProductDetailContainer} onEnter={validateAccount} />
        <Route path='/paylist' component={PayContainer} onEnter={validateAccount} />
        <Route path='/login' component={LoginContainer} onEnter={validateAccount} >
        </Route>
      </Router>
    );
  }
}


