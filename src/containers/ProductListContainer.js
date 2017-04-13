import React, { Component } from 'react';
import { SearchBar, List, ListView, Popup, RefreshControl, Toast, ActivityIndicator, Flex  } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import productAPI from '../api/product.js';
import cartAPI from '../api/cart.js';
import wxAPI from '../api/wx.js';
import wx from 'weixin-js-sdk';

import ProductDetailContainer from './ProductDetailContainer';
import { IoBag } from 'react-icons/lib/io'

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
            dataSource: dataSource.cloneWithRows([]),
            isLoading: true,
            hasMore:true,
            // searchKey:"EEAB7",
            searchKey:"",
            totalPrice: 0,
            totalCount: 0,
            refreshing:false,
            animating:false,
        };
    }

    async componentWillMount() {
        this.initWXConfig();
        await this.initCard();
        await this.searchProducts();
    }
    
    componentDidMount() {
        // 处理顶部有空白的bug
       let ele = document.getElementById("productList")
       let eleChild = document.getElementById("productList").childNodes
       ele.removeChild(eleChild[1])
    }
    componentWillReceiveProps(props){
        // console.log(props.scanData)
        // if(props.scanData){
        //     this._rowClick({id:2})
        // }
    }
    initWXConfig = () => {
        // this.changeLoading();
        // let self = this;
        // wx.ready(() => {
        //     self.changeLoading();
        // })
        wx.error(err => {
            Toast.fail('微信JSSKD错误')
            console.error(err);
        })
        const apiList = ['checkJsApi', 'scanQRCode', 'getNetworkType']
        wxAPI.setWexinConfig(false, apiList, window.location.href).then(wxconfig => {
            // console.log(wxconfig)
        })
    }
    initCard = async () => {
        let cartId = sessionStorage.getItem("cartId");
        console.log(cartId)
        if (cartId) {
        } else {
            await cartAPI.createCart().then((res) => {
                sessionStorage.setItem("cartId", Number(res.result.id));
            })
        }

        this.refreshCartData();
    }

    // 查询购物车，重新计算价格，数量
    refreshCartData = () => {
        let cartId = sessionStorage.getItem("cartId");

        if(cartId){
            cartAPI.getCartById(cartId).then(res=>{
                    //console.log('====>',res.result)
                    if(res.success && res.result.items !== null ){
                        this.setState({ totalPrice: res.result.salePrice, totalCount: res.result.quantity });
                    }else{
                        this.setState({ totalPrice: 0, totalCount: 0  });
                    }
            })
         }
    }
    
    searchProducts= ()=>{   
        productAPI.searchContents(this.state.searchKey,0,pageSize).then((res)=>{
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
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows([]),
                        hasMore:false,
                        isLoading:false
                    })
            }
        })
    }

    searchMoreProducts =  () => {
        pageNum++;
        productAPI.searchContents(this.state.searchKey,pageSize * pageNum,pageSize).then((res)=>{
            if(res.success && res.result.items !== null){
                // console.log(res.result)
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
            height: 1,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
        }}
        />
    )
    scanQRCode = () => {
        this.changeLoading()
        let self = this;
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                self.getSku("EEAA8A011101000")
            }
        })
    }
    changeLoading = () => {
        this.setState({animating:!this.state.animating});
    }
    getSku = (scanData) =>{
        console.log(scanData)
        productAPI.searchSkus(scanData,0,pageSize).then(res => {
            // console.log(res.result)
            if(res.success ){
                if(res.result.items && res.result.items.length === 1){
                    let item = res.result.items[0];
                    let targetSize = item.options[0].v
                    let targetColor = item.options[1].v
                    let contentId = item.contentId
                    return {contentId,targetSize,targetColor};
                }else{
                    throw new Error("查询结果有误")
                }
            }else{
                throw new Error("查询失败")
            }
        }).then((resSku) => {
            productAPI.getContentById(resSku.contentId).then(res => {
                return res.result
            }).then(resContent => {
                skusData = resContent.skus;
                productStyles = resContent.options;
                Popup.show(<ProductDetailContainer skusData={skusData} 
                                                productStyles={productStyles} 
                                                refreshCartData={this.refreshCartData}
                                                targetSize={resSku.targetSize}
                                                targetColor={resSku.targetColor}
                                                changeLoading={this.changeLoading}
                            />, 
                { animationType: 'slide-up', maskClosable: false });
            })
        }).catch(err => {
            console.error(err.message)
            Toast.fail(err.message, 2);
        });
    }
    _rowClick = (rowData) => {
        // console.log(rowData)
        productAPI.getContentById(rowData.id).then(res => {
            //console.log(res)
            skusData = res.result.skus;
            productStyles = res.result.options;
            return res.result;
        }).then((data) => {
            Popup.show(<ProductDetailContainer skusData={skusData} 
                                               productStyles={productStyles} 
                                               refreshCartData={this.refreshCartData}
                        />, 
            { animationType: 'slide-up', maskClosable: false });
        });
    }
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <div key={rowID} className="row" onClick={()=>{this._rowClick(rowData)}}>
                <Flex>
                    <div style={styles.img}>
                        {rowData.images && rowData.images.small?<img style={{ height: '1.28rem',width:'1.28rem',border: '0.5px solid gray',padding:1,marginTop:'0.05rem'}} src={rowData.images.small.url} alt="" />:''}
                    </div>
                    <div style={{width:'55%'}}>
                        <div style={styles.rowData}>{rowData.name.length>20?rowData.name.substring(0,20):rowData.name}</div>
                        <div style={{ textAlign: 'left' }}>
                            {rowData.code}
                        </div>
                    </div>
                    <div style={{width:'18%',textAlign:'right'}}>
                        <p style={styles.listPrice}>￥{rowData.listPrice}</p>
                        <p style={{ color: "#f00" }}>￥{rowData.salePrice}</p>
                    </div>
                </Flex>
            </div>
        );
    }
    _searchKeyChange = (e) => {
        this.setState({searchKey:e});
    }
    _searchKeySubmit = () => {  
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
            <div style={{background:'#fff'}}>
                <SearchBar placeholder="搜索" value={this.state.searchKey}  
                    onSubmit={this._searchKeySubmit}
                    onChange={this._searchKeyChange} 
                    onClear={this._searchKeyClear}
                />
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.state.animating}
                />
                <Item style={styles.item} arrow="horizontal" onClick={this._topContentClick}>
                    <div style={{display:'inline-block',
                                        width:'85%',
                                        // width:'6rem',
                                        marginLeft:'0.5rem',
                                        position: 'absolute',
                                        top: '47%',
                                        // top: '0.45rem',
                                        transform: 'translateY(-50%)',
                                        color:'#108ee9',
                                        fontWeight:'bold'
                                }}>
                        <div style={{float:'left',marginTop:'0.09rem'}}>
                            <IoBag style={{width:'1.1rem',height:'0.6rem',marginLeft:'-0.15rem'}}/>
                            <div style={{
                                        fontSize:'0.25rem',       
                                        position: 'absolute',
                                        top: '0.3rem',
                                        left: '0.1rem',
                                        width: '0.5rem',
                                        textAlign: 'center'
                            }}>
                               {this.state.totalCount}
                            </div>
                        </div>
                        <div style={{float:'right',fontSize:'0.5rem',marginRight:'0.3rem'}}>￥{this.state.totalPrice}</div>
                    </div>
                </Item>
                <div id="productList" style={{margin: '0 auto',}}>
                     <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={styles.foot}>
                            {this.state.hasMore?(this.state.isLoading ? '加载中...' : ''):"没有数据"}
                        </div>}
                        renderRow={this._renderRow}
                        renderSeparator={this.separator}
                        className="fortest"
                        style={{
                            height: document.documentElement.clientHeight - 90 - 88 - 90 - 40,
                            overflow: 'auto',
                        }}
                        pageSize={pageSize}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
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
    img: {
        height: '1.4rem',
        width: "1.4rem",
        marginRight: '0.4rem',
        // marginBottom:'0.01rem',
        // border: '0.5px solid gray',
    },
    img1: {
        width: "50px",
        height: "50px"
    },
    rowData: {
        marginBottom: '0.16rem',
        // height:'0.65rem',
        height:'0.6rem',
        overflow:'hidden',
        textAlign: "left"
    },
    discount: {
        position: "relative",
        marginLeft: "20px",
        bottom: "12px" 
    },
    td: {
        width: "2.2rem",
        // width: 200,
        textAlign:'center' 
    },
    listPrice: {
        textDecoration: "line-through",
        minHeight:'36px'
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
