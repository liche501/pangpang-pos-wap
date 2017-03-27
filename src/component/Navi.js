import React, { Component, PropTypes } from 'react';
import { NavBar, Icon } from 'antd-mobile';

export default class Navi extends Component {
    static propTypes = {
        leftIcon: PropTypes.string,
        rightIcon: PropTypes.string,
        title: PropTypes.string,
        mode: PropTypes.string,
        onLeftClick: PropTypes.func,
        onRightClick: PropTypes.func,

    }
    static defaultProps = {
        title: 'title',
        mode: "light",
        leftIcon:"",
        rightIcon: "",
    }
    render() {
        return (
            <NavBar iconName={this.props.leftIcon} mode={this.props.mode} onLeftClick={this.props.onLeftClick} style={{ backgroundColor: "#3e9ce9", color: "white", height:'1.2rem' }}
                rightContent={[
                    <Icon key="0" type={this.props.rightIcon} style={{ marginRight: '0rem' }} onClick={this.props.onRightClick} size="md" />,
                ]}
            >
                <span style={{ color: "white", fontSize:'0.5rem' }}>{this.props.title}</span>
            </NavBar>
        );
    }
}

