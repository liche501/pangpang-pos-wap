import React, { Component, PropTypes } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { FaBars } from 'react-icons/lib/fa';
import { MdFullscreen } from 'react-icons/lib/md';

export default class Navi extends Component {
    static propTypes = {
        leftIcon: PropTypes.any,
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
    componentDidMount() {
        document.getElementsByClassName("am-navbar-right")[0].onclick = this.props.onRightClick
    }
    
    render() {
        let rightContent
        switch(this.props.rightIcon){
            case "pay":
                rightContent = <div key="0" style={{ marginRight: 0 }} onClick={this.props.onRightClick} >支付</div>
            break;
            case "scan":
                
                
                rightContent = <div style={{backgroundColor:"red",width:"150px",textAlign:"right"}} ><MdFullscreen style={{fontSize:'0.8rem'}} /></div>
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

