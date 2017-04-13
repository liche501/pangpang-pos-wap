import React, { Component, PropTypes } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { FaBars } from 'react-icons/lib/fa';
import { MdCropFree } from 'react-icons/lib/md';

export default class Navi extends Component {
    static propTypes = {
        leftIcon: PropTypes.any,
        rightIcon: PropTypes.string,
        rightText: PropTypes.string,
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
    componentDidMount() {
        if(this.props.onRightClick){
            document.getElementsByClassName("am-navbar-right")[0].onclick = this.props.onRightClick
        }
    }
    
    render() {
        let rightContent
        switch(this.props.rightIcon){
            case "text":
                rightContent = <div key="0" style={{ marginRight: 0 }}  >{this.props.rightText}</div>
            break;
            case "scan":
                rightContent = <div style={{width:"150px",textAlign:"right"}} ><MdCropFree style={{fontSize:'0.6rem'}} /></div>
            break;
            default:
                rightContent = <Icon key="0" type={this.props.rightIcon} style={{ marginRight: '0rem' }} onClick={this.props.onRightClick} size="md" />
            break;
        }
        return (
            <NavBar iconName={this.props.leftIcon==="menu"?false:this.props.leftIcon} 
                    mode={this.props.mode} 
                    style={{ backgroundColor: "#3e9ce9", color: "white", }}
                    leftContent={this.props.leftIcon === "menu"? <FaBars style={{fontSize:".5rem"}}></FaBars>:null}
                    onLeftClick={this.props.onLeftClick} 
                    rightContent={rightContent}
            >
                <span style={{ color: "white", }}>{this.props.title}</span>
            </NavBar>
        );
    }
}

