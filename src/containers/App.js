import React, { Component } from 'react';
import { Router, Route, hashHistory,browserHistory } from 'react-router';
import HomeContainer from './HomeContainer';
import LoginContainer from './LoginContainer';
import BasketListContainer from './BasketListContainer';
import ProductDetailContainer from './ProductDetailContainer';
import PayContainer from './PayContainer';
import SettlementContainer from './SettlementContainer';

import { getQueryString } from '../common/extend.js';
var FastClick = require('fastclick');
FastClick.attach(document.body);

function validateAccount(nextState, replaceState) {
  if (nextState.location.pathname !== "/login" && !sessionStorage.getItem("account")) {
    replaceState('/login?token=' + getQueryString("token"));
  } else if (nextState.location.pathname === "/login" && sessionStorage.getItem("account")) {
    replaceState('/');
  }
}

function isWeiXin(){ 
  var ua = window.navigator.userAgent.toLowerCase(); 
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
    return true; 
  }else{ 
    return false; 
  } 
} 
export default class App extends Component {
  componentDidMount() {
    if(!isWeiXin()){ 
        var div = document.createElement("div");
        div.style.width = document.documentElement.clientWidth;
        div.style.textAlign = "center";
        div.style.fontSize = ".5rem";
        div.style.marginTop = "1rem";
        div.innerText = "请在微信中打开";
        document.body.innerHTML= div.outerHTML;
      } 
  }
  render() {
    return (
      <Router history={hashHistory} >
        <Route path='/' component={HomeContainer} onEnter={validateAccount} >
        </Route>
        <Route path='/basketlist' component={BasketListContainer} onEnter={validateAccount} />
        <Route path='/product-detail' component={ProductDetailContainer} onEnter={validateAccount} />
        <Route path='/settlement' component={SettlementContainer} onEnter={validateAccount} />        
        <Route path='/paylist' component={PayContainer} onEnter={validateAccount} />
        <Route path='/login' component={LoginContainer} onEnter={validateAccount} >
        </Route>
      </Router>
    );
  }
}


