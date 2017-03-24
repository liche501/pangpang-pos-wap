import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import accountAPI from '../api/account.js';
import { getQueryString } from '../common/extend.js';

class Login extends Component {
    componentDidMount() {
        let token = getQueryString("token");
        // console.log(token)
        if(!token) return;
        accountAPI.autoLogin(token).then(res => {
            if(res.success){
                sessionStorage.setItem("account", JSON.stringify({ token: res.result.token}))
            }
            window.location = "/"
        }).catch(error => {
            console.log(error)
        })
        
    }
    // _login = () => {
    //     console.log("login start")
    //     accountAPI.login("LABS", "saleswoman", "1234").then(res => {
    //         console.log(res)
    //         sessionStorage.setItem("account", JSON.stringify({ token: res.result.token}))
    //         // sessionStorage.setItem("account", JSON.stringify({ token: "11111111" }))
    //         window.location = "/"
    //     }).catch(error => {
    //         console.log(error)
    //     })

    // }
    render() {
        return (
            <div >
                <Button className="btn" type="primary" style={{ marginTop: "40%" }} >登陆</Button>
            </div>
        );
    }
}

export default Login;