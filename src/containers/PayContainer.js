import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List, Radio, Modal, Toast } from 'antd-mobile';
import cartAPI from '../api/cart.js';
import orderAPI from '../api/order.js';


const Item = List.Item;
const RadioItem = Radio.RadioItem;
const prompt = Modal.prompt;
const antAlert = Modal.alert;
const styles = {};
const menuName = "支付中心"

export default class PayContainer extends Component {
    state = {
        menuName: "结算中心",
        
    }
    _placeOrderClick = () => {
        let cartId = sessionStorage.getItem("cartId");

        if (cartId) {
            cartAPI.setPayment(cartId, { "method": this.state.payType, "amount": parseFloat(this.state.salePrice) })
                .then(res => {
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
                })
        }
    }
    render() {
        return (
            <div style={{ background: '#f6f6f6' }}>
                <Navi leftIcon="left" 
                      title={menuName} 
                      onLeftClick={() => { history.back() } } 
                />
                <Button className="btn" type="primary" style={styles.btn} onClick={() => this._placeOrderClick()}>支付完成</Button>

            </div>
        )
    }
}

styles = {
    btn: {
        width: '90%',
        margin: '7% auto 0',
        // width: '6.5rem',
        // margin: '0.5rem auto 0',
        fontWeight: 'bold'
    },
}