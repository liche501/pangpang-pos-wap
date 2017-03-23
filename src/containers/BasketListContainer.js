import React, { Component } from 'react';
import { SwipeAction, List, ListView } from 'antd-mobile';
import Navi from '../component/Navi.js';
import BasketCell from '../component/BasketCell';
import productAPI from '../api/product.js';
import cartAPI from '../api/cart.js';


const Item = List.Item;
const price = 200;
const menuName = "购物车";

var pageNum = 0;
//每页显示数据的条数  
const pageSize = 10;

export default class BasketList extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: dataSource.cloneWithRows([]),
            isLoading: false,
            hasMore:true,
        };
    }
    componentDidMount() {
        // this.addItemsFromCart(226,95373,1)
        this.refreshCartData();
    }
    // 给购物车添加商品
    addItemsFromCart = (cartId, skuId, qty) => {
        cartAPI.addItemsFromCart(cartId, { skuId: skuId, quantity: qty }).then(res => {
            // console.log(res);
            this.refreshCartData(cartId);
        })
    }
    // 从购物车删除商品
    removeItemsFromCart = (cartId, skuId, qty) => {
        cartAPI.removeItemsFromCart(cartId, { skuId: skuId, quantity: qty }).then(res => {
            // console.log(res);
            this.refreshCartData(cartId);
        })
    }
    // 查询购物车，重新计算价格，数量
    refreshCartData = () => {
        let cartId = sessionStorage.getItem("cartId");
        // console.log(cartId)
        if(cartId){
            this.setState((state, props) => { return { isLoading: true }});
            cartAPI.getCartById(cartId).then(res=>{
                console.log(res.result)
                if(res.success && res.result.items !== null ){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(res.result.items),
                        isLoading: false,
                    });
                }else{
                    this.setState({isLoading:false,hasMore:false})
                }
            })
        }
    }

    _removeRow = (rowData) => {
        let cartId = sessionStorage.getItem("cartId");
        // console.log(rowData)
        this.removeItemsFromCart(cartId,rowData.sku.id,rowData.quantity)
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
                <SwipeAction
                            style={{ backgroundColor: 'gray' }}
                            autoClose
                            right={[
                                {
                                    text: '删除',
                                    onPress:()=>{this._removeRow(rowData)},
                                    style: { backgroundColor: '#F4333C', color: 'white' },
                                },
                            ]}
                            onOpen={() => {console.log("removeRow open")}}
                            onClose={() => console.log('removeRow close')}
                >
                    <BasketCell rowData={rowData} />
                </SwipeAction>
        );
    }
    render() {
        return (
            <div>
                <Navi  leftIcon="left" rightIcon="right" onRightClick={()=>{window.location="/#/paylist"}} title={menuName} onLeftClick={()=>{history.back()}} />
                <Item style={{ backgroundColor: "#fff", borderBottom: '10px solid #f6f6f6' }} extra={'￥'+price}>Total</Item>
                <div style={{ margin: '0 auto', width: '96%'  }}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={{ paddingTop: 10, textAlign: 'center' }}>
                            {this.state.hasMore?(this.state.isLoading ? '加载中...' : '加载完毕'):"没有数据"}
                        </div>}
                        renderRow={this._renderRow}
                        className="fortest"
                        style={{
                            height: document.documentElement.clientHeight -90 -100-40,
                            overflow: 'auto',
                            border: '1px solid #ddd',
                            margin: '0.1rem 0',
                        }}

                    />
                </div>
            </div>
        )
    }
}