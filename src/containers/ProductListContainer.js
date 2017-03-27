import React, { Component } from 'react';
import { SearchBar, List, ListView, Popup } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
// import cartAPI from '../api/cart.js';
import productAPI from '../api/product.js';
import cartAPI from '../api/cart.js';
import { Router, Route, hashHistory } from 'react-router';
import ProductDetailContainer from './ProductDetailContainer';

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
const styles = {};
let skusData = [], productStyles = {};
export default class ProductListContainer extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            cartId:0,
            dataSource: dataSource.cloneWithRows([]),
            isLoading: true,
            hasMore:true,
            // searchKey:"EEAB7",
            searchKey:"",
        };
    }

    componentWillMount() {
        this.initCard();
    }
    
    componentDidMount() {
        this.searchProducts();
    }
    initCard = async () => {
        let cartId = sessionStorage.getItem("cartId");
        console.log(cartId)
        if (cartId) {
            this.setState({ cartId: Number(cartId) });
        } else {
            await cartAPI.createCart().then((res) => {
                sessionStorage.setItem("cartId", Number(res.result.id));
            })
        }

    }
    // 查询购物车，重新计算价格，数量
    refreshCartData = (cartId) => {
        this.props.getCartById(cartId);
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
    _rowClick = (rowData) => {
        // console.log(rowData)
        productAPI.getContentById(rowData.id).then(res => {
            // console.log(res)
            skusData = res.result.skus;
            productStyles = res.result.options;
            return res.result;
        }).then((data) => {
            Popup.show(<ProductDetailContainer skusData={skusData} productStyles={productStyles} />, { animationType: 'slide-up', maskClosable: false });
        });
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <div key={rowID} className="row" onClick={()=>{this._rowClick(rowData)}}>
                <div style={styles.div}>
                    <table className="row-text">
                        <tbody>
                            <tr>
                                <td style={{width:'5%'}}>
                                    <div style={styles.img}>
                                        <img style={{ height: '1.28rem' }} src="https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png" alt="" />
                                    </div>
                                </td>
                                <td style={{width:'45%'}}>
                                    <div style={styles.rowData}>{rowData.name.length>20?rowData.name.substring(0,20):rowData.name}</div>
                                    <div style={{ textAlign: 'left' }}>
                                        <img style={styles.img1} src={imgMD} alt="" />
                                        <span style={styles.discount}>9.5折</span>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <p style={styles.listPrice}>￥{rowData.listPrice}</p>
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
    _showModal = () =>{

    }
    render() {

        return (
            <div>
                <SearchBar placeholder="搜索" value={this.state.searchKey}  
                    onSubmit={this._searchKeySubmit}
                    onChange={this._searchKeyChange} 
                    onClear={this._searchKeyClear}
                />
                <Item style={styles.item} extra="内容内容" arrow="horizontal" onClick={this._topContentClick}>
                    <img className="product-img" src={imgMD} alt="" />
                </Item>
                <div style={styles.div1}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={styles.foot}>
                            {this.state.hasMore?(this.state.isLoading ? '加载中...' : '加载完毕'):"没有数据"}
                        </div>}
                        renderBodyComponent={() => <MyBody />}
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
        );
    }
}

styles = {
    div: {
        display: 'flex',
        padding: '0.3rem 0' 
    },
    div1: {
        margin: '0 auto',
        width: '96%' 
    },
    img: {
        height: '1.28rem',
        width: "1.28rem",
        marginRight: '0.3rem' 
    },
    img1: {
        width: "50px",
        height: "50px"
    },
    rowData: {
        marginBottom: '0.16rem',
        width:'80%',
        height:'0.65rem',
        overflow:'hidden',
        textAlign: "left"
    },
    discount: {
        position: "relative",
        marginLeft: "20px",
        bottom: "12px" 
    },
    td: {
        width: "10%",
        textAlign:'center' 
    },
    listPrice: {
        textDecoration: "line-through"
    },
    item: {
        backgroundColor:'#fff',
        borderBottom:'1px solid #eee'
    },
    foot: {
        paddingTop: 10,
        textAlign: 'center' 
    }
}
