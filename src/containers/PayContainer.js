import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List, Radio, Modal, Toast, ActionSheet } from 'antd-mobile';
import cartAPI from '../api/cart.js';
import orderAPI from '../api/order.js';

import pay1 from '../../public/zfb.gif';
import pay2 from '../../public/wxzf.gif';
import { FaCreditCardAlt, FaMoney } from 'react-icons/lib/fa';



const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

const Item = List.Item;
const RadioItem = Radio.RadioItem;
const prompt = Modal.prompt;
const antAlert = Modal.alert;
const styles = {};
const menuName = "支付中心"

const formatPayType = (type) => {
    switch (type) {
            case "mileage":
                return "积分"
                break;
            case "ali":
                return "支付宝"
                break;
            case "weixin":
                return "微信"
                break;
            case "card":
                return "刷卡"
                break;
            case "cash":
                return "现金"
                break;
            default:
                return type
                break;
        }
}

const formatPayMethod = (type) => {
    switch (type) {
        case "mileage":
            return "积分"
            break;
        case "ali":
            return "支付宝"
            break;
        case "weixin":
            return "微信"
            break;
        case "card":
            return "刷卡"
            break;
        case "cash":
            return "现金"
            break;
        default:
            return "title"
            break;
    }
}

export default class PayContainer extends Component {
    state = {
        menuName: "结算中心",
        completePay: false,
        salePrice: 0,
        remainAmount: 0,
        payments: [],
        availableMileage: 0,
        mileageUse:0,

    }

    componentWillMount() {
        this.refreshCartData()
    }
    refreshCartData = () => {
        let cartId = sessionStorage.getItem("cartId");

        if (cartId) {
            cartAPI.getCartById(cartId).then(res => {
                console.log('refreshCartData====>', res.result)
                if (res.success) {
                    let rs = res.result
                    this.setState({
                        salePrice: rs.salePrice,
                        remainAmount: rs.remainAmount,
                        payments: rs.payments || [],
                        availableMileage: rs.mileage.available,
                        mileageUse: rs.mileage.use,
                    });
                }
            })
        }
    }
    _placeOrderClick = () => {
        let cartId = sessionStorage.getItem("cartId");
        if (cartId) {
            orderAPI.placeOrder({ "cartId": parseInt(cartId, 10) })
                .then(res => {
                    Toast.info('生成订单');
                    sessionStorage.removeItem('cartId');

                    setTimeout(() => {
                        window.location = '/';
                    }, 1000);
                })
                .catch(error => {
                    Toast.fail('生成失败');
                })
        }
    }
    _onPayTypeChange = (payType) => {
        this.setState({
            payType
        });
    }
    _inputButtonClick = (type) => {
        switch (type) {
            case "mileage":
                this.showPrompt("积分", type)
                break;
            case "ali":
                this.showPrompt("支付宝", type)
                break;
            case "weixin":
                this.showPrompt("微信", type)
                break;
            case "card":
                this.showPrompt("刷卡", type)
                break;
            case "cash":
                this.showPrompt("现金", type)
                break;
            default:
                break;
        }

    }
    showPrompt = (title, type) => {
        let cartId = sessionStorage.getItem("cartId")
        prompt(
            title, '请输入金额',
            [
                { text: '取消' },
                {
                    text: '保存',
                    onPress: (money) => {
                        console.log(money)
                        if(money > this.state.remainAmount ){
                            Toast.info('支付金额过大', 1);
                            return
                        }
                        if (!money && this.state.remainAmount > 0) {
                            // Toast.info('金额为空', 1);
                            // return
                            money = this.state.remainAmount
                        }else{
                            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                            if(!reg.test(money) || money === "0"){
                                Toast.info('请输入正确的金额', 1);
                                return
                            }
                        }
                        
                        if (type === "mileage") {
                            cartAPI.setPaymentForMileage(cartId, { "amount": parseFloat(money) }).then(res => {
                                this.refreshCartData();
                            })
                        } else {
                            cartAPI.setPayment(cartId, { "method": type, "amount": parseFloat(money) }).then(res => {
                                this.refreshCartData();
                            })
                        }
                    }
                }
            ],'default', this.state.remainAmount
        )
    }
    render() {
        return (
            <div style={{ background: '#f6f6f6' }}>
                <Navi leftIcon="left"
                    title={menuName}
                    onLeftClick={() => { history.back() } }
                    />
                <p style={{marginLeft:'0.5rem',fontSize:'0.35rem'}}>选择支付方式</p>
                <div>
                    <List style={{ width: '49%' }}>
                        <div>
                            <RadioItem className='pay-am-list-item-middle' key='cash' checked={false} onClick={() => this._inputButtonClick("cash")} >
                                <div style={styles.pay}>
                                    <FaMoney style={{fontSize:"0.4rem"}}/>&nbsp;&nbsp;&nbsp;
                                    <span>现&nbsp;金</span>
                                </div>
                            </RadioItem>
                        </div>
                    </List>
                    <WhiteSpace />
                    <List style={{ width: '49%', position: 'absolute', top: '2rem', left: '51%' }}>
                        <div>
                            <RadioItem className='pay-am-list-item-middle' key='card' checked={false} onClick={() => this._inputButtonClick("card")}>
                                <div style={styles.pay}>
                                    <FaCreditCardAlt style={{fontSize:"0.4rem"}}/>&nbsp;&nbsp;
                                    <span>&nbsp;刷&nbsp;卡&nbsp;&nbsp;</span>
                                </div>
                            </RadioItem>
                        </div>
                    </List>
                </div>
                <div>
                    <List style={{ width: '49%' }}>
                        <div>
                            <RadioItem className='pay-am-list-item-middle' key='Alipay' checked={false} onClick={() => this._inputButtonClick("ali")}>
                                <div style={styles.pay}>
                                    <img src={pay1} style={{ marginRight: '5px', marginBottom: '5px' }} alt="" /> &nbsp;
                                    <span>支付宝</span>
                                </div>
                            </RadioItem>
                        </div>
                    </List>
                    <WhiteSpace />
                    <List>
                        <div style={{ width: '49%', position: 'absolute', top: '-1.6rem', left: '51%' }}>
                            <RadioItem className='pay-am-list-item-middle' key='Wxpay' checked={false} onClick={() => this._inputButtonClick("weixin")}>
                                <div style={styles.pay} >
                                    <img src={pay2} style={styles.img} alt="" /> &nbsp;
                                    <span>微&nbsp;信</span>
                                </div>
                            </RadioItem>
                        </div>
                    </List>
                </div>
                <List>
                    <div style={styles.totalPrice}>
                        <p>
                            价格：
                            <span style={{ float: 'right' }}>
                                <span>￥{this.state.salePrice}</span>
                            </span>
                        </p>
                        {this.state.mileageUse !== 0 ? (
                            <p>
                                积分抵现：
                                <span style={{ float: 'right' }}>￥-{this.state.mileageUse}</span>
                            </p>
                        ) : null}
                        {(()=>{
                            return this.state.payments.map((item,key)=>{
                                return(
                                    <p key={key}>
                                        {formatPayType(item.method)}：
                                        <span style={{ float: 'right' }}>￥{item.amount}</span>
                                    </p>
                                )
                            })
                        })()}
                        <p style={{color: 'orange' }}>
                            未支付：
                            <span style={{ float: 'right' }}>￥{this.state.remainAmount}</span>
                        </p>
                    </div>
                </List>
                <Button className="btn" 
                        type="primary" 
                        style={styles.btn} 
                        disabled={this.state.remainAmount===0?false:true}  
                        onClick={() => this._placeOrderClick()}
                >确认支付￥{this.state.salePrice}
                </Button>
            </div>
        )
    }
}

styles = {
    pay: {
        textAlign: 'center',
        margin:'0.3rem',
        fontSize:'0.35rem' 
    },
    img: {
        width: '50px',
        height: '40px'
    },
    info: {
        width: '75%',
        // width: '5.5rem',
        fontSize: '0.35rem',
        margin: '0 auto',
        paddingBottom: '1px'
    },
    totalPrice: {
        width: '75%',
        fontSize: '0.35rem',
        margin: '35px auto 0',
        paddingBottom: '1px'
    },
    btn: {
        width: '90%',
        margin: '7% auto 0',
        fontWeight: 'bold'
    },
}