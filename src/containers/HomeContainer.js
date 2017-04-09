import React, { Component } from 'react';
// import { SearchBar, WhiteSpace, WingBlank } from 'antd-mobile';
import { Drawer, List, NavBar, Icon } from 'antd-mobile';
import SpotSet from './SpotSetContainer';
import ProductList from './ProductListContainer';
import imgMD from '../../public/MD.jpg';
import Navi from '../component/Navi.js';

import wxAPI from '../api/wx.js';
import wx from 'weixin-js-sdk';

let tempMenuData = [
    {},
    { menuName: "销售", menuCode: "productList" },
    { menuName: "卖场", menuCode: "spotSet" },
];
const leftMenuWidth = document.documentElement.clientWidth/3*2;
export default class Home extends Component {
    state = {
        open: false,
        position: 'left',
        selectMenuCode: "productList",
        menuName: "销售",
    }
    componentWillMount() {
        // wx.ready(() => {
        //     Toast.success('可以扫一扫啦');
        // })
        wx.error(err => {
            Toast.fail('微信JSSKD错误')
            console.error(err);
        })

        const apiList = ['checkJsApi', 'scanQRCode', 'getNetworkType']
        wxAPI.setWexinConfig(false, apiList, window.location.href).then(wxconfig => {
            // console.log(wxconfig)
        })
    }
    onOpenChange = (...args) => {
        // console.log(args);
        this.setState({ open: !this.state.open });
    }
    selectMenuClick = (menuCode, menuName) => {
        // console.log(menuCode, menuName);
        this.setState({ selectMenuCode: menuCode, menuName: menuName });
        this.onOpenChange();
    }
    _scanButtonClick = () => {
        let self = this;
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                self.refs.productListComponent.getSku("42AB616-6")
                // alert(result);
            }
        })
    }
    render() {
        let content;
        switch (this.state.selectMenuCode) {
            case "productList":
                content = <ProductList  ref="productListComponent"/>
                break;
            case "validate":

                break;
            case "spotSet":
                content = <SpotSet />
                break;
            default:
                break;
        }

        const sidebar = (
            <List>
                {tempMenuData.map((menu, index) => {
                    if (index === 0) {
                        return (
                            <List.Item key={index} style={{ backgroundColor: "#22242f", color: "white", height: 300 ,width:leftMenuWidth}}
                                multipleLine
                            >
                            <div className="home-box">
                                <img className="home-img" src={imgMD}/>
                                <p style={{color:"#fff",margin:"10px 16px"}}>userInfo</p>
                            </div>
                            </List.Item>
                        );
                    }
                    return (
                        <List.Item key={menu.menuCode} onClick={(menuCode, menuName) => { this.selectMenuClick(menu.menuCode, menu.menuName) }}
                        >
                            <div style={{backgroundColor:'#22242E',color:"#fff"}}>{menu.menuName}</div>
                        </List.Item>
                    );
                })}
            </List>
        );

        const drawerProps = {
            open: this.state.open,
            position: this.state.position,
            onOpenChange: this.onOpenChange,
            dragHandleStyle: { backgroundColor: "red" }
        };
        return (
            <div>
                <Navi leftIcon="menu" 
                      title={this.state.menuName} 
                      onLeftClick={this.onOpenChange}
                      rightIcon="scan"
                      onRightClick={this._scanButtonClick} 
                />
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight - 90 }}
                    sidebar={sidebar}
                    dragHandleStyle={{ display: 'none' }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebarStyle={{width:leftMenuWidth}}
                    {...drawerProps}
                    >
                    {content}
                </Drawer>
            </div>
        )
    }
}
