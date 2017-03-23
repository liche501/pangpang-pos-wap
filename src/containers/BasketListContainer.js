import React, { Component } from 'react';
import { SwipeAction, List, ListView } from 'antd-mobile';
import Navi from '../component/Navi.js';
import BasketCell from '../component/BasketCell';
import productAPI from '../api/product.js';


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
        this.searchProducts();
    }
    searchProducts= ()=>{    
        this.setState((state, props) => { return { isLoading: true }});
            
        productAPI.searchSkus("",pageSize * pageNum,pageSize).then((res)=>{
            console.log(res.result)
            if(res.success && res.result.items !== null){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(res.result.items),
                    isLoading: false,
                });
                if (res.result.items.length<pageSize){
                    this.setState({hasMore:false,isLoading:false})
                }
            }else{
                this.setState({hasMore:false,isLoading:false})
            }
        })
    }
    searchMoreProducts =  () => {
        pageNum++;
        productAPI.searchSkus("",pageSize * pageNum,pageSize).then((res)=>{
            if(res.success && res.result.items !== null){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows([...this.state.dataSource._dataBlob.s1, ...res.result.items]),
                    isLoading: false,
                });
                if (res.result.items.length<pageSize){
                    this.setState({hasMore:false,isLoading:false})
                }
            }else{
                this.setState({hasMore:false,isLoading:false})
            }            
        })
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
                <SwipeAction
                            style={{ backgroundColor: 'gray' }}
                            autoClose
                            right={[
                                {
                                    text: '删除',
                                    onPress: () => console.log('删除'),
                                    style: { backgroundColor: '#F4333C', color: 'white' },
                                },
                            ]}
                            onOpen={() => console.log('global open')}
                            onClose={() => console.log('global close')}
                >
                    <BasketCell />
                </SwipeAction>
        );
    }
    onEndReached = (event) => {
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.searchMoreProducts();
        }, 500);
    }
    render() {
        return (
            <div>
                <Navi  leftIcon="left" title={menuName} onLeftClick={()=>{history.back()}} />
                <Item style={{ backgroundColor: "#fff", borderBottom: '10px solid #f6f6f6' }} extra={'￥'+price}>Total</Item>
                <div style={{ margin: '0 auto', width: '96%' }}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={{ paddingTop: 10, textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完毕'}
                        </div>}
                        renderRow={this._renderRow}
                        className="fortest"
                        style={{
                            height: document.documentElement.clientHeight - 90 - 88,
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