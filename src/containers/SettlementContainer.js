import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List, Switch, Modal, Toast, ActivityIndicator, Flex } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import pay1 from '../../public/zfb.gif';
import pay2 from '../../public/wxzf.gif';
import ticket from '../../public/ticket.gif';
import cartAPI from '../api/cart.js';
import orderAPI from '../api/order.js';
import { MdCropFree } from 'react-icons/lib/md';
import wx from 'weixin-js-sdk';

const Item = List.Item;
const prompt = Modal.prompt;
const antAlert = Modal.alert;
const styles = {};

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
export default class SettlementContainer extends Component {
    state = {
        menuName: "订单结算",
        listPrice: 0,
        salePrice: 0,
        remainAmount: 0,
        discount: 0,

        customerMobile: 0,
        customerNo: "",
        customerGrade: 0,
        couponNo: "",

        currentPoints: 0,
        availableMileage: 0,

        payments:[],

        isSetCustomer: false,
        isSetCoupon: false,
        mileageUsed: false,
        animating: false,
    }

    componentWillMount() {
        this.refreshCartData();
    }
    componentDidMount() {

    }

    // 查询购物车，重新计算价格，数量
    refreshCartData = () => {
        let cartId = sessionStorage.getItem("cartId");

        if (cartId) {
            cartAPI.getCartById(cartId).then(res => {
                console.log('====>', res.result)
                let rs = res.result;
                if (res.success) {
                    if (rs.items !== null) {
                        this.setState({
                            listPrice: rs.listPrice,
                            salePrice: rs.salePrice,
                            discount: rs.discount,
                            remainAmount: rs.remainAmount,
                        });
                    } else {
                        this.setState({ salePrice: 0, discount: 0 });
                    }
                    this.setState({
                        payments: rs.payments || [],
                        isSetCoupon: rs.couponNo ? true : false,
                        couponNo: rs.couponNo,
                        availableMileage: rs.mileage.available,
                        currentPoints: rs.mileage.current,
                        mileageUsed: rs.mileage.use === 0 ? false : true,
                    });

                    if (rs.customerInfo !== null) {
                        this.setState({
                            customerId: rs.customerInfo.id,
                            customerMobile: rs.customerInfo.mobile,
                            customerNo: rs.customerInfo.no,
                            customerGrade: rs.customerInfo.grade,
                            isSetCustomer: rs.customerInfo.no ? true : false,
                        });
                    }
                    else {
                        this.setState({
                            customerId: 0,
                            customerMobile: "",
                            customerNo: '',
                            customerGrade: 0
                        });
                    }
                }
            })
        }
    }
    _inputButtonClick = (type) => {
        if (type === 'customer') {
            prompt(
                '会员', '请输入会员号',
                [
                    { text: '取消' },
                    {
                        text: '保存',
                        onPress: (value) => {
                            if (!value) {
                                Toast.info('顾客号为空', 1);
                                return
                            }
                            this.setCustomer(value)
                        }
                    }
                ], 'plain-text', 'EE0000053147'
            )
        }
        else if (type === 'coupon') {
            prompt(
                '优惠券', '请输入优惠券号',
                [
                    { text: '取消' },
                    {
                        text: '保存',
                        onPress: (value) => {
                            if (!value) {
                                Toast.info('优惠卷为空', 1);
                                return
                            }
                            this.setCoupon(value)
                        }
                    }
                ], 'plain-text', 'EE4EEDE03E762A2AA2'
            )
        }
    }
    _scanButtonClick = (type) => {
        let self = this;
        // wx.scanQRCode({
        //     needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        //     scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        //     success: function (res) {
        //         var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        //         alert(result);

        //     }
        // })

        if (type === 'customer') {
            this.setCustomer("EE0000053147")
        } else if (type === 'coupon') {
            // alert("coupon")
            this.setCoupon("EE4EEDE03E762A2AA2")
        }
    }
    setCustomer = (value) => {
        cartAPI.setCustomer(sessionStorage.getItem('cartId'), { "no": value })
            .then(res => {
                this.setState({ isSetCustomer: true });
                Toast.info('会员保存成功', 1);
                this.refreshCartData();
            })
            .catch(error => {
                Toast.fail('会员保存失败', 1);
            })
    }
    setCoupon = (value) => {
        cartAPI.setCoupon(sessionStorage.getItem('cartId'), { "no": value })
            .then(res => {
                console.log(res)
                this.setState({ isSetCoupon: true })
                Toast.info('优惠券保存成功', 1);
                this.refreshCartData();
            })
            .catch(error => {
                Toast.fail('优惠券保存失败', 1);
            })
    }
    _cancelCart = () => {
        let cartId = sessionStorage.getItem("cartId");
        antAlert('取消订单', '确定取消订单么?', [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定', onPress: () => {
                    cartAPI.removeCartById(cartId).then(res => {
                        if (res.success) {
                            sessionStorage.removeItem("cartId")
                            window.location.href = "/"
                        }
                    })
                }, style: { fontWeight: 'bold' }
            },
        ])
    }
    _mileageChange = () => {
        this.changeLoading();
        if (!this.state.mileageUsed) {
            cartAPI.setPaymentForMileage(sessionStorage.getItem("cartId"), { "amount": parseFloat(this.state.availableMileage) }).then(res => {
                console.log(res)
                this.refreshCartData();
                this.changeLoading();
            })
        } else {
            cartAPI.setPaymentForMileage(sessionStorage.getItem("cartId"), { "amount": 0 }).then(res => {
                console.log(res)
                this.refreshCartData();
                this.changeLoading();
            })
        }

    }
    changeLoading = () => {
        this.setState({ animating: !this.state.animating });
    }
    render() {
        let customerContent, couponContent;

        if (this.state.isSetCustomer) {
            customerContent = (
                <List>
                    <div className="row"  >
                        <div style={styles.div}>
                            <div style={styles.div1} >
                                <p style={styles.p}>VIP{this.state.customerGrade}</p>
                            </div>
                            <div className="row-text">
                                <div>手&nbsp;&nbsp;&nbsp;机 : {this.state.customerMobile}</div>
                                <div>会员号 : {this.state.customerNo}</div>
                                <div>
                                    积&nbsp;&nbsp;&nbsp;分 :
                                    <span style={{ color: 'orange' }}> {this.state.currentPoints}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Flex style={{ padding: '0.2rem 0.35rem' }} justify="between">
                        <span>可用积分<span style={{ color: 'orange' }}>{this.state.availableMileage}</span>, 冲抵<span style={{ color: 'orange' }}>¥{this.state.availableMileage}元</span></span>
                        <Switch style={{ }} checked={this.state.mileageUsed} disabled={this.state.availableMileage === 0 || this.state.remainAmount === 0 ? true : false} onChange={this._mileageChange} />
                    </Flex>
                </List>
            )
        } else {
            customerContent = (
                <List>
                    <Item data-seed="logId" style={styles.background}>
                        <div style={styles.div3}>
                            <div>
                                <Button onClick={() => this._inputButtonClick('customer')} size='small' style={styles.btn1}>会员登录</Button>
                            </div>
                            <div style={{ position: 'absolute', top: 7, left: '4rem' }}>
                                <MdCropFree style={styles.span} onClick={() => { this._scanButtonClick("customer") } }></MdCropFree>
                            </div>
                        </div>
                    </Item>
                </List>
            )
        }

        if (this.state.isSetCoupon) {
            couponContent = (
                <List >
                    <Item data-seed="logId" style={styles.background} >
                        <div style={styles.div3}>
                            <div style={styles.div2}>
                                优惠券
                                </div>
                            <div style={styles.coupon}>
                                <div style={{ fontSize: "0.32rem" }}>{this.state.couponNo}</div>
                                <span style={styles.date}>2017.05.01~2017.06.01</span>
                            </div>
                        </div>
                    </Item>
                </List>
            )
        } else {
            couponContent = (
                <List>
                    <Item data-seed="logId" style={styles.background}>
                        <div style={styles.div3}>
                            <div>
                                <Button onClick={() => this._inputButtonClick('coupon')} size='small' style={styles.btn1}>查询优惠券</Button>
                            </div>
                            <div style={{ position: 'absolute', top: 7, left: '4rem' }}>
                                <MdCropFree style={styles.span} onClick={() => { this._scanButtonClick("coupon") } }></MdCropFree>
                            </div>
                        </div>
                    </Item>
                </List>

            )
        }


        return (
            <div style={{ background: '#f6f6f6' }}>
                <Navi leftIcon="left"
                    title={this.state.menuName}
                    onLeftClick={() => { history.back() } }
                    rightIcon="text"
                    rightText="取消订单"
                    onRightClick={this._cancelCart}
                    />
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.state.animating}
                    />
                <WhiteSpace />
                {couponContent}
                <WhiteSpace />
                {customerContent}
                <WhiteSpace />
                <List style={{marginBottom:"1.24rem"}}>
                    <div style={styles.info}>
                        <p>
                            价格：
                            <span style={{ float: 'right' }}>
                                <span>￥{this.state.listPrice}元</span>
                            </span>
                        </p>
                        <p>
                            优惠：
                            <span style={{ float: 'right' }}>-￥{this.state.discount}元</span>
                        </p>
                        <p style={{color: 'orange' }}>
                            热销价：
                            <span style={{ float: 'right' }}>
                                <span>￥{this.state.salePrice}元</span>
                            </span>
                        </p>
                        {this.state.mileageUsed ? (
                            <p>
                                积分抵现：
                                <span style={{ float: 'right' }}>-￥{this.state.availableMileage}元</span>
                            </p>
                        ) : null}
                        {(()=>{
                            return this.state.payments.map((item,key)=>{
                                return(
                                    <p key={key}>
                                        {formatPayType(item.method)}：
                                        <span style={{ float: 'right' }}>￥{item.amount}元</span>
                                    </p>
                                )
                            })
                        })()}
                        {/*<p style={{color: 'orange'}}>
                            需支付：
                                <span style={{ float: 'right' }}>￥{this.state.remainAmount}元</span>
                        </p>*/}
                    </div>
                </List>

                <Flex justify="center" style={{position:"fixed",width:"100%",bottom:"0.2rem"}}>
                    <Button className="btn" type="primary" 
                            style={{width:"90%",fontWeight: 'bold',}} 
                            onClick={() => window.location.href = `/#/paylist?availableMileage=${this.state.availableMileage}`}
                    >需支付(￥{this.state.remainAmount}元)
                    </Button>
                </Flex>
            </div>
        )
    }
}

styles = {
    background: {
        backgroundColor: '#fff'
    },
    div: {
        display: 'flex',
        padding: '0.3rem 0'
    },
    div1: {
        height: '1.7rem',
        width: '2rem',
        fontSize: '0.5rem',
        color: 'orange',
        marginRight: '0.35rem',
        backgroundColor: '#f6f6f6'
    },
    div2: {
        fontSize: '0.35rem',
        color: '#42A2EA',
        fontWeight: 'bold',
        paddingLeft: '0.35rem'
    },
    div3: {
        // lineHeight: '2',
        lineHeight: '4',
        textAlign: 'left'
    },
    coupon: {
        position: 'absolute',
        height: '1.7rem',
        top: 0,
        left: '2rem',
        borderLeft: '1px solid #e8e8e8',
        paddingLeft: '0.5rem'
    },
    date: {
        fontSize: '0.2rem',
        // marginTop: '-0.15rem'
        position: 'relative',
        top: '-0.9rem'
    },
    info: {
        width: '75%',
        // width: '5.5rem',
        fontSize: '0.35rem',
        margin: '0 auto',
        paddingBottom: '1px'
    },
    p: {
        width: '1rem',
        margin: '0.55rem auto'
    },
    span: {
        color: '#42A2EA',
        fontSize: '1.2rem',
        marginLeft: '0.5rem',
        marginRight: '0.8rem',
        paddingLeft: '0.6rem',
        borderLeft: '1px solid #ececec',
    },
    btn1: {
        fontSize: '0.35rem',
        marginLeft: '1rem',
        display: 'inline-block',
        border: 0
    },
}