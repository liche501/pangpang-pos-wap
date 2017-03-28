import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List, Radio } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import pay1 from '../../public/zfb.gif';
import pay2 from '../../public/wxzf.gif';
import ticket from '../../public/ticket.gif';
import cartAPI from '../api/cart.js';


const Item = List.Item;
const RadioItem = Radio.RadioItem;
const styles = {};

export default class PayContainer extends Component {
    state = {
        menuName: "订单",
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        userName: '某某某',
        userId: '001293398440',
        payType:'Ali',
        salePrice:0,
        discount:0
    }
    handleClick() {
        window.location = '/#/product-detail'
    }
    componentWillMount() {
        this.refreshCartData();
    }

    // 查询购物车，重新计算价格，数量
    refreshCartData = () => {
        let cartId = sessionStorage.getItem("cartId");

        if(cartId){
            cartAPI.getCartById(cartId).then(res=>{
                    console.log('====>',res.result)
                    if(res.success && res.result.items !== null ){
                        this.setState({ salePrice: res.result.salePrice});
                        this.setState({ discount: res.result.discount});
                    }else{
                        this.setState({ salePrice: 0});
                        this.setState({ discount: 0});
                    }
            })
         }
    }
    onPayTypeChange = (payType) =>{
        this.setState({
            payType
        });
    }
    render() {
        return (
            <div style={{background:'#f6f6f6'}}>
                <Navi style={styles.background} leftIcon="left" title={this.state.menuName} onLeftClick={()=>{history.back()}}/>
                <div className="row">
                    <div style={styles.div}>
                        <div style={styles.div1} >
                            <p style={styles.p}>Lv.5</p>
                        </div>
                        <div className="row-text" style={{ lineHeight: '1.5' }}>
                            <div style={styles.div2}>姓&nbsp;名 : {this.state.userName}</div>
                            <div style={{ fontSize: '0.4rem' }}>会员号 : {this.state.userId}</div>
                        </div>
                    </div>
                </div>
                <WhiteSpace />
                <WingBlank>
                    <List>
                        <Item data-seed="logId" style={styles.background}>
                            <div style={styles.div3}>
                                <span style={styles.span}>汉光百货 </span>
                                 <span>|</span> 
                                 <span> Coupon/SALE</span>
                            </div>
                        </Item>
                    </List>
                </WingBlank>
                <WhiteSpace />
                <List>
                    <Item data-seed="logId" style={styles.background}>
                        <div style={styles.div4}>
                            <img src={ticket} style={styles.img}/>
                            <span style={styles.price}> ￥{this.state.salePrice} </span>
                            <span style={styles.discount}>(已优惠 {this.state.discount} 元)</span>
                        </div>
                    </Item>
                </List>
                <WhiteSpace />
                <List>
                    <RadioItem className='pay-am-list-item-middle' key='Alipay' checked={this.state.payType === 'Ali'} onChange={() => this.onPayTypeChange('Ali')}>
                        <div style={{textAlign:'center'}}>
                                <img src={pay1} style={{marginRight:'5px'}} alt=""/> &nbsp;
                                <span>支付宝</span>
                            </div>
                    </RadioItem>
                    <RadioItem className='pay-am-list-item-middle' key='Wxpay' checked={this.state.payType === 'Wx'} onChange={() => this.onPayTypeChange('Wx')}>
                        <div style={{textAlign:'center'}}>
                                <img src={pay2} style={styles.img1} alt=""/> &nbsp;
                                <span>微&nbsp;信</span>
                        </div>
                    </RadioItem>
                </List>
                <Button className="btn" type="primary" style={styles.btn} onClick={()=>this.handleClick()}>Pay Confirm ￥450</Button>
            </div>
        )
    }
}

styles = {
    background: {
        backgroundColor:'#fff'
    },
    div: {
        display: 'flex',
        padding: '0.3rem 0' 
    },
    div1: {
        height: '1.28rem',
        width:'2rem',
        fontSize:'0.5rem',
        marginRight:'0.5rem',
        backgroundColor:'#f6f6f6'
    },
    div2: {
        marginBottom: '0.16rem',
        fontSize: '0.4rem'
    },
    div3: {
        lineHeight:'2',
        textAlign:'left'
    },
    div4: {
        lineHeight:'2',
        textAlign:'center'
    },
    p: {
        width:'1rem',
        margin:'30px auto'
    },
    span: {
        color:'#42A2EA',
        fontSize:'0.4rem',
        fontWeight:'bold',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
    },
    img: {
        width:'1rem',
        height:'0.7rem',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left:'20%'
    },
    img1: {
        width:'50px',
        height:'40px'
    },
    price: {
        fontSize:'0.5rem',
        fontWeight:'bold',
        marginLeft:'20%'
    },
    discount: {
        color:'orange',
        fontWeight:'bold'
    },
    btn: {
        width: '90%',
        margin: '7% auto 0',
        fontWeight:'bold'
    }
}