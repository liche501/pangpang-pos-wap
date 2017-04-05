import React, { Component } from 'react';
import { SearchBar, List, ListView, Popup,  RefreshControl  } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import productAPI from '../api/product.js';
import cartAPI from '../api/cart.js';
import ProductDetailContainer from './ProductDetailContainer';
import { IoBag } from 'react-icons/lib/io'

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
let styles = {};
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
            totalPrice: 0,
            totalCount: 0,
            refreshing:false,
        };
    }

    componentWillMount() {
        //this.initCard();
    }
    
    async componentDidMount() {
        await setTimeout(() => {
            this.initCard();
        }, 300);
        await setTimeout(() => {
            this.searchProducts();
        }, 300);
    }

    // 查询购物车，重新计算价格，数量
    refreshCartData = () => {
        let cartId = sessionStorage.getItem("cartId");

        if(cartId){
            cartAPI.getCartById(cartId).then(res=>{
                    //console.log('====>',res.result)
                    if(res.success && res.result.items !== null ){
                        this.setState({ totalPrice: res.result.salePrice });
                        this.setState({ totalCount: res.result.quantity});
                    }else{
                        this.setState({ totalPrice: 0 });
                        this.setState({ totalCount: 0 });
                    }
            })
         }
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

        this.refreshCartData();
    }
    
    searchProducts= ()=>{        
        productAPI.searchSkus(this.state.searchKey,pageSize * pageNum,pageSize).then((res)=>{
            //console.log(res.result)
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

    onRefresh = async () => {
        this.setState({ refreshing: true });
        await this._searchKeySubmit();
        this.setState({ refreshing: false });
    };

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
            //console.log(res)
            skusData = res.result.skus;
            productStyles = res.result.options;
            return res.result;
        }).then((data) => {
            Popup.show(<ProductDetailContainer skusData={skusData} productStyles={productStyles} refreshCartData={this.refreshCartData}/>, { animationType: 'slide-up', maskClosable: false });
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
                                        {rowData.images && rowData.images.small?<img style={{ height: '1.28rem',width:'1.28rem' }} src={rowData.images.small.url} alt="" />:''}
                                    </div>
                                </td>
                                <td style={{width:'45%'}}>
                                    <div style={styles.rowData}>{rowData.name.length>20?rowData.name.substring(0,20):rowData.name}</div>
                                    <div style={{ textAlign: 'left' }}>

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
            <div style={{background:'#fff'}}>
                <SearchBar placeholder="搜索" value={this.state.searchKey}  
                    onSubmit={this._searchKeySubmit}
                    onChange={this._searchKeyChange} 
                    onClear={this._searchKeyClear}
                />
                <Item style={styles.item} arrow="horizontal" onClick={this._topContentClick}>
                    <div style={{display:'inline-block',
                                        width:'85%',
                                        marginLeft:'0.5rem',
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color:'#108ee9',
                                        fontWeight:'bold'
                                }}>
                        <div style={{float:'left'}}>
                            <IoBag size={70} />
                            <div style={{fontSize:'0.25rem',       
                                        position: 'absolute',
                                        top: '0.38rem',
                                        left: '0.12rem',
                                        width: '0.5rem',
                                        textAlign: 'center'
                            }}>
                               {this.state.totalCount}
                            </div>
                        </div>
                        <div style={{float:'right',fontSize:'0.5rem'}}>￥{this.state.totalPrice}</div>
                    </div>
                </Item>
                <div style={styles.div1}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={styles.foot}>
                            {this.state.hasMore?(this.state.isLoading ? '加载中...' : ''):"没有数据"}
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
                        refreshControl={<RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                                />}
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
        marginRight: '0.3rem',
        border: '0.5px solid gray'        
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
        borderBottom:'1px solid #eee',
        height:100
    },
    foot: {
        paddingTop: 10,
        textAlign: 'center' 
    }
}
