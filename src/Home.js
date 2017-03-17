import React, { Component } from 'react';
import { SearchBar, WhiteSpace, WingBlank } from 'antd-mobile';
import { Drawer, List, NavBar } from 'antd-mobile';
import './App.css';

class Home extends Component {
    state = {
        open: false,
        position: 'left',
    }
    onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
    }
    render() {
        const sidebar = (<List>
            {[...Array(5).keys()].map((i, index) => {
                if (index === 0) {
                    return (<List.Item key={index}
                        thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                        multipleLine
                    >标题</List.Item>);
                }
                return (<List.Item key={index}
                thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                >Category{index}</List.Item>);
            })}
        </List>);

        const drawerProps = {
            open: this.state.open,
            position: this.state.position,
            onOpenChange: this.onOpenChange,
        };
        return (
            <div>
                <NavBar iconName="ellipsis" onLeftClick={this.onOpenChange}>Basic</NavBar>
                    <Drawer
                        className="my-drawer"
                        style={{ minHeight: document.documentElement.clientHeight - 200 }}
                        sidebar={sidebar}
                        dragHandleStyle={{ display: 'none' }}
                        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                        {...drawerProps}
                    >
                        Click upper-left corner icon
                    </Drawer>
            </div>
        )
    }
}

export default Home;