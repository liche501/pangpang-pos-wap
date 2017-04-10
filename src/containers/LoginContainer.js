import React, { Component } from 'react';
import { ActivityIndicator,Toast } from 'antd-mobile';
import accountAPI from '../api/account.js';
import { getQueryString } from '../common/extend.js';

let styles = {
    container: {
        display: "flex",
        justifyContent: "flex-start",
    },
}

class Login extends Component {
    state={
        animating:true
    }
    componentDidMount() {
        let token = getQueryString("token");
        if(!token){
            this.setState({animating:false})
            Toast.fail('登陆失败', 3);
            return;
        } 
        
        accountAPI.autoLogin(token).then(res => {
            this.setState({animating:false})
            if(res.success){
                sessionStorage.setItem("account", JSON.stringify({ token: res.result.token}))
                window.location = "/"
            }
        }).catch(error => {
            this.setState({animating:false})
            Toast.fail('登陆失败!!!', 3);
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
            <div style={styles.container}>
                <ActivityIndicator
                toast
                text="正在加载"
                animating={this.state.animating}
              />
            </div>
        );
    }
}

export default Login;