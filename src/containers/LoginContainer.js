import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import accountAPI from '../api/account.js'

class Login extends Component {

    _login = () => {

        accountAPI.login("LABS", "saleswoman", "1234").then(res => {
            console.log(res)
            sessionStorage.setItem("account", JSON.stringify({ token: res.result.token}))
            // sessionStorage.setItem("account", JSON.stringify({ token: "11111111" }))
            window.location = "/"
        }).catch(error => {
            console.log(error)
        })

    }
    render() {
        return (
            <div>
                <Button className="btn" type="primary" style={{ marginTop: "40%" }} onClick={this._login}>登陆</Button>
            </div>
        );
    }
}

export default Login;