import React, { Component } from 'react';
// import { SearchBar, WhiteSpace, WingBlank } from 'antd-mobile';
import { Drawer, List, NavBar, Icon } from 'antd-mobile';
import SpotSet from './SpotSetContainer';
import ProductList from './ProductListContainer';
import imgMD from '../../public/MD.jpg';
import Navi from '../component/Navi.js';

let tempMenuData = [
    {},
    { menuName: "购物车", menuCode: "productList" },
    { menuName: "退 货", menuCode: "spotSet" },
];
const leftMenuWidth = document.documentElement.clientWidth / 3 * 2;
export default class Home extends Component {
    state = {
        open: false,
        position: 'left',
        selectMenuCode: "productList",
        menuName: "销售",
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
        if (this.refs.productListComponent) {
            this.refs.productListComponent.scanQRCode();
        }
    }
    render() {
        let content;
        switch (this.state.selectMenuCode) {
            case "productList":
                content = <ProductList ref="productListComponent" />
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
            <div>
                {tempMenuData.map((menu, index) => {
                    if (index === 0) {
                        return (
                            <div style={{ backgroundColor: "#22242f", color: "white", width:'90%',margin:'0 auto',borderBottom:'1px solid #fff' }}>
                                <List.Item key={index} 
                                    multipleLine
                                    >
                                    <div className="home-box">
                                        <img className="home-img" src={imgMD} />
                                        <p style={{ color: "#fff", margin: "30px 8px 0" }}>userInfo</p>
                                    </div>
                                </List.Item>
                            </div>
                        );
                    }
                    return (
                        <div style={{ width: '90%', margin: '0 auto', borderBottom: '1px solid #fff' }}>
                            <List.Item key={menu.menuCode} onClick={(menuCode, menuName) => { this.selectMenuClick(menu.menuCode, menu.menuName) } }
                                >
                                <div style={{ backgroundColor: '#22242E', color: "#fff", textAlign: 'center' }}>{menu.menuName}</div>
                            </List.Item>
                        </div>
                    );
                })}
            </div>
        );

        const drawerProps = {
            open: this.state.open,
            position: this.state.position,
            onOpenChange: this.onOpenChange,
            dragHandleStyle: { backgroundColor: "red" }
        };
        let menuContent
        if (this.state.selectMenuCode === "productList") {
            menuContent = <Navi leftIcon="menu"
                title={this.state.menuName}
                onLeftClick={this.onOpenChange}
                rightIcon="scan"
                onRightClick={this._scanButtonClick}
                />
        } else {
            menuContent = <Navi leftIcon="menu"
                title={this.state.menuName}
                onLeftClick={this.onOpenChange}
                />
        }
        return (
            <div>
                {menuContent}
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight - 90 }}
                    sidebar={sidebar}
                    dragHandleStyle={{ display: 'none' }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebarStyle={{ width: leftMenuWidth }}
                    {...drawerProps}
                    >
                    {content}
                </Drawer>
            </div>
        )
    }
}
