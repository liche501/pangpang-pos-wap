import React, { Component } from 'react';
// import { SearchBar, WhiteSpace, WingBlank } from 'antd-mobile';
import { Drawer, List, NavBar, Icon } from 'antd-mobile';
import SpotSet from './SpotSetContainer';
import ProductList from './ProductListContainer';


let tempMenuData = [
    {},
    { menuName: "销售", menuCode: "productList" },
    { menuName: "卖场", menuCode: "spotSet" },
];

export default class Home extends Component {
    state = {
        open: false,
        position: 'left',
        selectMenuCode: "productList",
    }

    onOpenChange = (...args) => {
        // console.log(args);
        this.setState({ open: !this.state.open });
    }
    selectMenuClick = (menuCode) => {
        // console.log(menuCode);
        this.setState({ selectMenuCode: menuCode })
        this.onOpenChange()
    }
    render() {
        let content;
        switch (this.state.selectMenuCode) {
            case "productList":
                content = <ProductList />
                break;
            case "validate":

                break;
            case "spotSet":
                content = <SpotSet />
                break;
            default:
                break;
        }
        const sidebar = (<List>
            {tempMenuData.map((i, index) => {
                if (index === 0) {
                    return (<List.Item key={index} style={{ backgroundColor: "#22242f", color: "white", height: 300 }}
                        multipleLine
                    >userInfo</List.Item>);
                }
                return (<List.Item key={i.menuCode} onClick={(menuCode) => { this.selectMenuClick(i.menuCode) }}
                >{i.menuName}</List.Item>);
            })}
        </List>);

        const drawerProps = {
            open: this.state.open,
            position: this.state.position,
            onOpenChange: this.onOpenChange,
            dragHandleStyle: { backgroundColor: "red" }
        };
        return (
            <div>
                <NavBar iconName="koubei-o" mode="light" onLeftClick={this.onOpenChange} style={{ backgroundColor: "#3e9ce9", color: "white", }}
                    rightContent={[
                        <Icon key="0" type="search" style={{ marginRight: '0rem' }} onClick={_ => { alert("right") }} size="md" />,
                    ]}
                ><span style={{ color: "white", }}>NavBar</span></NavBar>

                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight - 90 }}
                    sidebar={sidebar}
                    dragHandleStyle={{ display: 'none' }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    {...drawerProps}
                >
                    {content}
                </Drawer>
            </div>
        )
    }
}
