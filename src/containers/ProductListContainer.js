import React, { Component } from 'react';
import { SearchBar, List, ListView } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
// import cartAPI from '../api/cart.js';
import productAPI from '../api/product.js';
import { Router, Route, hashHistory } from 'react-router';


function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}

var pageNum = 0;
//每页显示数据的条数  
const pageSize = 10;

const Item = List.Item;

export default class ProductListContainer extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            dataSource: dataSource.cloneWithRows([]),
            isLoading: true,
            hasMore:true,
            searchKey:"EEAB7",
        };
    }
    componentDidMount() {
        this.searchProducts();
    }
    searchProducts= ()=>{        
        productAPI.searchSkus(this.state.searchKey,pageSize * pageNum,pageSize).then((res)=>{
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
        productAPI.searchSkus(this.state.searchKey,pageSize * pageNum,pageSize).then((res)=>{
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
    separator = (sectionID, rowID) => (
        <div key={`${sectionID}-${rowID}`} style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
        }}
        />
    )
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <div key={rowID} className="row">
                <div style={{ display: 'flex', padding: '0.3rem 0' }}>
                    <table className="row-text">
                        <tbody>
                            <tr>
                                <td>
                                    <img style={{ height: '1.28rem', marginRight: '0.3rem' }} src="https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png" alt="" />
                                </td>
                                <td>
                                    <div style={{ marginBottom: '0.16rem', width: '80%', textAlign: "left" }}>{rowData.name.length>20?rowData.name.substring(0,20):rowData.name}</div>
                                    <div style={{ textAlign: 'left' }}>
                                        <img style={{ width: "50px", height: "50px" }} src={imgMD} alt="" />
                                        <span style={{ position: "relative", marginLeft: "20px", bottom: "12px" }}>9.5折</span>
                                    </div>
                                </td>
                                <td style={{ width: "150px", textAlign: "left" }}>
                                    <p style={{ textDecoration: "line-through" }}>￥{rowData.listPrice}</p>
                                    <p style={{ color: "#f00" }}>￥{rowData.salePrice}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    _searchKeyChange = (e) => {
        this.setState({searchKey:e});
    }
    _searchKeySubmit = async() => {
        pageNum = 0;
        await this.setState({
            dataSource: this.state.dataSource.cloneWithRows([]),
            isLoading: false,
        });    
        this.searchProducts()
    }
    _searchKeyClear = () => {
        this.setState({searchKey:""});
    }
    _topContentClick = () => {
        window.location = "/#/basketlist"
    }
    render() {

        return (
            <div>
                <SearchBar placeholder="搜索" value={this.state.searchKey}  
                    onSubmit={this._searchKeySubmit}
                    onChange={this._searchKeyChange} 
                    onClear={this._searchKeyClear}
                />
                <Item style={{backgroundColor:'#fff', borderBottom:'1px solid #eee'}} extra="内容内容" arrow="horizontal" onClick={this._topContentClick}>
                    <img className="product-img" src={imgMD} alt="" />
                </Item>
                <div style={{ margin: '0 auto', width: '96%' }}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={{ paddingTop: 10, textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完毕'}
                        </div>}
                        renderBodyComponent={() => <MyBody />}
                        renderRow={this._renderRow}
                        renderSeparator={this.separator}
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
        );
    }
}
