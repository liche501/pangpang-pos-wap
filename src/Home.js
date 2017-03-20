import React, { Component } from 'react';
import { SearchBar, WhiteSpace, WingBlank } from 'antd-mobile';
import { Drawer, List, NavBar } from 'antd-mobile';
import SpotSet from './SpotSet.js';
import ProductList from './ProductList.js';


let tempMenuData = [
    { menuName: "销售", menuCode: "productList" },
    { menuName: "卖场", menuCode: "spotSet" },
];

class Home extends Component {
    state = {
        open: false,
        position: 'left',
        selectMenuKey: "productList",
    }

    onOpenChange = (...args) => {
        // console.log(args);
        this.setState({ open: !this.state.open });
    }
    render() {
        let content;
        switch (this.state.selectMenuKey) {
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
            {[...Array(5).keys()].map((i, index) => {
                if (index === 0) {
                    return (<List.Item key={index} style={{backgroundColor:"#22242f",color:"white",height:300}}
                        multipleLine
                    >标题111</List.Item>);
                }
                return (<List.Item key={index} onClick={_ => { console.log(index); this.onOpenChange() }}
                    thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                >Category{index}</List.Item>);
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
                <NavBar iconName="ellipsis" onLeftClick={this.onOpenChange}>Basic</NavBar>
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

export default Home;