import React, { Component } from 'react';
import { SwipeAction, List, ListView } from 'antd-mobile';
import Navi from '../component/Navi.js';
import imgMD from '../../public/MD.jpg';
import BasketCell from '../component/BasketCell';

const Item = List.Item;

export default class BasketList extends Component {
    state = {
        menuName: "购物车",
    }

    render() {
        return (
            <div>
                <Navi style={{ backgroundColor: "#fff"}} leftIcon="left" title={this.state.menuName} />
                <Item style={{ backgroundColor: "#fff", borderBottom:'10px solid #f6f6f6'  }} extra={'￥Price'}>Total</Item>
                <List>
                    <SwipeAction
                        style={{ backgroundColor: 'gray' }}
                        autoClose
                        right={[
                            {
                                text: '删除',
                                onPress: () => console.log('删除'),
                                style: { backgroundColor: '#F4333C', color: 'white' },
                            },
                        ]}
                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}
                    >
                        <List.Item style={{ backgroundColor: "#fff" }}>
                            <BasketCell />
                        </List.Item>
                    </SwipeAction>
                </List>
            </div>
        )
    }
}