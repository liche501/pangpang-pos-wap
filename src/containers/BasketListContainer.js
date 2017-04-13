import React, { Component } from 'react';
import { SwipeAction, List, ListView ,Flex} from 'antd-mobile';
import Navi from '../component/Navi.js';
import BasketCell from '../component/BasketCell';
import productAPI from '../api/product.js';
import cartAPI from '../api/cart.js';

const Item = List.Item;
let styles = {};

var pageNum = 0;
//每页显示数据的条数  
const pageSize = 10;

export default class BasketList extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: dataSource.cloneWithRows([]),
            suggests:[],
            isLoading: false,
            hasMore: true,
            totalPrice: 0,
            qty: 0,
        };
    }
    componentDidMount() {
        // this.addItemsFromCart(450,95374,2)
        this.refreshCartData();
        // 处理顶部有空白的bug
       let ele = document.getElementById("productList")
       let eleChild = document.getElementById("productList").childNodes
       ele.removeChild(eleChild[1])
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
                        totalPrice: res.result.salePrice,
                        qty: res.result.quantity,
                        suggests: res.result.suggests?res.result.suggests:[],
                    });
                }else if(res.success && res.result.items === null ){
                    this.setState({
                                    dataSource: this.state.dataSource.cloneWithRows([]),
                                    isLoading:false,
                                    hasMore:false,
                                    totalPrice: 0
                    })
                }
                else{
                    this.setState({
                                    isLoading:false,
                                    hasMore:false,
                                    totalPrice: 0
                })}
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
                            style={{ backgroundColor: 'gray',
                                    display: 'flex',
                                    }}
                            autoClose
                            right={[
                                {
                                    text: '删除',
                                    onPress:()=>{this._removeRow(rowData)},
                                    style: { backgroundColor: '#F4333C', color: 'white' },
                                },
                            ]}
//                             onOpen={() => {console.log("removeRow open")}}
//                             onClose={() => console.log('removeRow close')}
                >
                    <BasketCell rowData={rowData} />
                </SwipeAction>
        );
    }
    render() {
        return (
            <div style={{background:'#fff'}}>
                <Navi  leftIcon="left" 
                       rightIcon="text" 
                       rightText="结算" 
                       title={`购物车(${this.state.qty})`} 
                       onLeftClick={()=>{history.back()}} 
                       onRightClick={()=>{window.location="/#/settlement"}}
                />
                <div style={{width:"100%",backgroundColor:"#45d3c6",position:"fixed",bottom:0,color:"white",fontSize:"0.3rem"}}>
                
                {(()=>{
                    return this.state.suggests.map((item,key)=>{
                        return (
                            <Flex key={key} style={{margin:"0.1rem"}} justify="between">
                                <span>
                                    + {item.name}
                                </span>
                                <span>
                                    ¥{item.salePrice}
                                </span>
                            </Flex>
                        )
                    })
                })()}
                </div>
                <Item style={styles.item}>
                    <div style={{display:'inline-block',
                                        width:'100%',
                                        // width:'6.2rem',
                                        position: 'absolute',
                                        top: '50%',
                                        // top: '0.45rem',
                                        transform: 'translateY(-50%)',
                                        // transform: 'translateY(-0.35rem)',
                                        color:'#108ee9',
                                        fontWeight:'bold',
                                        fontSize:'0.5rem'
                                }}>
                        <div style={{float:'left'}}>Total</div>
                        <div style={{float:'right'}}>￥{this.state.totalPrice}</div>
                    </div>
                </Item>
                <div id="productList" style={styles.div}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={styles.foot}>
                            {this.state.hasMore?(this.state.isLoading ? '加载中...' : ''):"没有数据"}
                            </div>}
                        renderRow={this._renderRow}
                        renderSeparator={this.separator}
                        className="fortest"
                        style={{
                            height: document.documentElement.clientHeight - 90 - 88 - 90 -40,
                            overflow: 'auto',
                            border: '1px solid #ddd',
                            margin: '0.1rem 0',
                        }}
                        pageSize={10}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={40}
                    />
                </div>
            </div>
        )
    }
}

styles = {
    item: {
        backgroundColor: "#fff",
        borderBottom: '10px solid #f6f6f6',
        height:100,
        padding: '0 0.5rem'
    },
    div: {
        margin: '0 auto',
        // width: '96%'  
        // width: '6.9rem'  
    },
    foot: {
        paddingTop: 10,
        textAlign: 'center' 
    }
}