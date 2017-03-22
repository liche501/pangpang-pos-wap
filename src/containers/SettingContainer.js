import React, { Component } from 'react';
import { List, Switch } from 'antd-mobile';
import { createForm } from 'rc-form';
import Navi from '../component/Navi.js';

export default class SettingContainer extends Component {
    constructor() {
        super();
        this.state = {
            menuName: "设置"
        }
    }
    render() {
        return (
            <div>
                <Navi style={{ backgroundColor: "#fff" }} leftIcon="ellipsis" title={this.state.menuName} />
                <List>
                    11111111111
                </List>
            </div>
        )
    }
}