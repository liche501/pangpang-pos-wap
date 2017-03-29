import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List, Radio, Modal,Toast } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import pay1 from '../../public/zfb.gif';
import pay2 from '../../public/wxzf.gif';
import ticket from '../../public/ticket.gif';
import cartAPI from '../api/cart.js';
import orderAPI from '../api/order.js';
import { FaQrcode } from 'react-icons/lib/fa'


const Item = List.Item;
const RadioItem = Radio.RadioItem;
const prompt = Modal.prompt;
const styles = {};

export default class PayContainer extends Component {
    state = {
        menuName: "支付",
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        userName: '某某某',
        userId: '001293398440',
        payType:'Ali',
        salePrice:0,
        discount:0,
        customerId:0,
        customerNo:"",
        customerGrade:0,
    }
    handleClick() {
        let cartId = sessionStorage.getItem("cartId");

        if(cartId){
            cartAPI.setPayment(cartId,{"method":this.state.payType,"amount":parseFloat(this.state.salePrice)})
                    .then(res=>{
                             orderAPI.placeOrder({"cartId":parseInt(cartId,10)})
                                .then(res=>{
                                        Toast.info('生成订单');
                                        sessionStorage.removeItem('cartId');

                                        setTimeout(() => {
                                            window.location = '/';
                                        }, 1000);
                                    })
                                    .catch(error=>{
                                        Toast.fail('生成失败');
                            })
                        })
        }

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
                if(res.success) {
                    if(res.result.items !== null ){
                        this.setState({ salePrice: res.result.salePrice,
                                        discount: res.result.discount});
                    }else{
                        this.setState({ salePrice: 0});
                        this.setState({ discount: 0});
                    }

                    if(res.result.customerInfo !== null ){
                        this.setState({ customerId: res.result.customerInfo.id,
                                        customerNo: res.result.customerInfo.no,
                                        customerGrade:res.result.customerInfo.grade
                                    });
                    }
                    else{
                        this.setState({ customerId: 0,
                                        customerNo: '',
                                        customerGrade:0
                                    });
                    }
                }
            })
         }
    }
    onPayTypeChange = (payType) =>{
        this.setState({
            payType
        });
    }
    handleScanButtonClick = (type) => {
        if(type === 'customer'){
            prompt(
            '会员','请输入会员号',
            [
                {text:'取消'},
                {
                    text:'保存',
                    onPress:(value)=>{
                        cartAPI.setCustomer(sessionStorage.getItem('cartId'),{"no":value})
                        .then(res=>{
                            Toast.info('会员保存成功',1);
                            this.refreshCartData();
                        })
                        .catch(error=>{
                            Toast.fail('会员保存失败',1);
                        })
                    }
                }
            ],'plain-text','EE0000211453'
            )
        }
        else if(type === 'coupon'){
            prompt(
            '优惠券','请输入优惠券号',
            [
                {text:'取消'},
                {
                    text:'保存',
                    onPress:(value)=>{
                        cartAPI.setCoupon(sessionStorage.getItem('cartId'),{"no":value})
                        .then(res=>{
                            Toast.info('优惠券保存成功',1);
                            this.refreshCartData();
                        })
                        .catch(error=>{
                            Toast.fail('优惠券保存失败',1);
                        })
                    }
                }
            ],'plain-text','EE4E52FEF46F7B30DE'
            )
        }
    }
    render() {
        return (
            <div style={{background:'#f6f6f6'}}>
                <Navi style={styles.background} leftIcon="left" title={this.state.menuName} onLeftClick={()=>{history.back()}}/>
                <div className="row">
                    <div style={styles.div}>
                        <div style={styles.div1} >
                            <p style={styles.p}>Lv.{this.state.customerGrade}</p>
                        </div>
                        <div className="row-text" style={{ lineHeight: '1.5' }}>
                            <div style={styles.div2}>ID : {this.state.customerId}</div>
                            <div style={{ fontSize: '0.4rem' }}>会员号 : {this.state.customerNo}</div>
                        </div>
                    </div>
                </div>
                <WhiteSpace />
                <WingBlank>
                <List>
                    <Item data-seed="logId" style={styles.background}>
                        <div style={styles.div3}>
                            <FaQrcode style={styles.span}></FaQrcode>
                            <Button onClick={()=>this.handleScanButtonClick('customer')} size='small' style={{marginRight: '0.6rem',display: 'inline-block',border:0}}>Customer</Button>
                            <span>|</span> 
                            <Button onClick={()=>this.handleScanButtonClick('coupon')} size='small' style={{marginLeft: '0.6rem',display: 'inline-block',border:0}}>Coupon/SALE</Button>
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
        margin:'50px auto'
    },
    span: {
        color:'#42A2EA',
        fontSize:'1rem',
        marginLeft: '0.5rem',
        marginRight: '0.5rem'
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