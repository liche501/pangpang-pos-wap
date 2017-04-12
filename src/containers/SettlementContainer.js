import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List, Switch, Modal, Toast, ActivityIndicator } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import pay1 from '../../public/zfb.gif';
import pay2 from '../../public/wxzf.gif';
import ticket from '../../public/ticket.gif';
import cartAPI from '../api/cart.js';
import orderAPI from '../api/order.js';
import { MdFullscreen } from 'react-icons/lib/md';
import wx from 'weixin-js-sdk';

const Item = List.Item;
const prompt = Modal.prompt;
const antAlert = Modal.alert;
const styles = {};

export default class SettlementContainer extends Component {
    state = {
        menuName: "订单结算",
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        userName: '某某某',
        userId: '001293398440',
        payType: 'Ali',
        listPrice: 0,
        salePrice: 0,
        discount: 0,
        customerMobile: 0,
        customerNo: "",
        customerGrade: 0,
        couponNo: "",
        currentPoints: 0,
        availableMileage: 0,
        isSetCustomer: false,
        isSetCoupon: false,
        mileageUsed:false,
        animating:false,

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
                if (res.success) {
                    if (res.result.items !== null) {
                        this.setState({
                            listPrice: res.result.listPrice,
                            salePrice: res.result.salePrice,
                            discount: res.result.discount
                        });
                    } else {
                        this.setState({ salePrice: 0, discount: 0 });
                    }
                    this.setState({ isSetCoupon: res.result.couponNo ? true : false,
                                    couponNo: res.result.couponNo,
                    });
                    if(res.result.payments){
                        let tempMileage = 0;
                        res.result.payments.map((payment)=>{
                            if(payment.method === "mileage"){
                                tempMileage += parseFloat(payment.amount)
                            }
                        })
                        if(tempMileage === 0){
                            this.setState({mileageUsed:false});
                        }else{
                            this.setState({mileageUsed:true});
                        }
                        console.log("tempMileage==>",tempMileage)
                    }
                    if (res.result.customerInfo !== null) {
                        this.setState({
                            customerId: res.result.customerInfo.id,
                            customerMobile: res.result.customerInfo.mobile,
                            customerNo: res.result.customerInfo.no,
                            customerGrade: res.result.customerInfo.grade,
                            currentPoints: res.result.customerInfo.mileage.currentPoints,
                            availableMileage: res.result.customerInfo.availableMileage,
                            isSetCustomer: res.result.customerInfo.no ? true : false,
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
    onPayTypeChange = (payType) => {
        this.setState({
            payType
        });
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
        if(!this.state.mileageUsed){
            cartAPI.setPaymentForMileage(sessionStorage.getItem("cartId"), { "amount": parseFloat(this.state.availableMileage) }).then(res => {
                console.log(res)
                this.refreshCartData();
                this.changeLoading();
            })
        }else{
            cartAPI.setPaymentForMileage(sessionStorage.getItem("cartId"), { "amount": parseFloat(-this.state.availableMileage) }).then(res => {
                console.log(res)
                this.refreshCartData();
                this.changeLoading();
            })
        }
        
    }
    changeLoading = () => {
        this.setState({animating:!this.state.animating});
    }
    render() {
        let customerContent, couponContent;

        if (this.state.isSetCustomer) {
            customerContent = (
                <div className="row"  >
                    <div style={styles.div}>
                        <div style={styles.div1} >
                            <p style={styles.p}>VIP{this.state.customerGrade}</p>
                        </div>
                        <div className="row-text">
                            <div>手机号: {this.state.customerMobile}</div>
                            <div>会员号 : {this.state.customerNo}</div>
                            <div>
                                积&nbsp;&nbsp;&nbsp;分 :
                                <span style={{ color: 'orange' }}>{this.state.currentPoints}</span>
                            </div>
                            <div>
                                本次可用积分 :
                                <span style={{ color: 'orange' }}>{this.state.availableMileage}</span>
                                <Switch checked={this.state.mileageUsed} disabled={this.state.availableMileage===0?true:false} onChange={this._mileageChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            customerContent = (
                <List>
                    <Item data-seed="logId" style={styles.background}>
                        <div style={styles.div3}>
                            <div>
                                <Button onClick={() => this._inputButtonClick('customer')} size='small' style={styles.btn1}>会员登录</Button>
                            </div>
                            <div style={{ position: 'absolute', top: 0, left: '4rem' }}>
                                <MdFullscreen style={styles.span} onClick={() => { this._scanButtonClick("customer") } }></MdFullscreen>
                            </div>
                        </div>
                    </Item>
                </List>
            )
        }

        if (this.state.isSetCoupon) {
            couponContent = (
                <WingBlank>
                    <List >
                        <Item data-seed="logId" style={styles.background} >
                            <div style={styles.div3}>
                                <div style={styles.div2}>
                                    优惠券
                                </div>
                                <div style={styles.coupon}>
                                    <span style={{ fontSize: "0.25rem" }}>{this.state.couponNo}</span>
                                    <div style={styles.date}>2017.05.01~2017.06.01</div>
                                </div>
                            </div>
                        </Item>
                    </List>
                </WingBlank>
            )
        } else {
            couponContent = (
                <List>
                    <Item data-seed="logId" style={styles.background}>
                        <div style={styles.div3}>
                            <div>
                                <Button onClick={() => this._inputButtonClick('coupon')} size='small' style={styles.btn1}>查询优惠券</Button>
                            </div>
                            <div style={{ position: 'absolute', top: 0, left: '4rem' }}>
                                <MdFullscreen style={styles.span} onClick={() => { this._scanButtonClick("coupon") } }></MdFullscreen>
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
                <List>
                    <div style={styles.info}>
                        <p>
                            金额：
                            <span style={{ float: 'right' }}>￥{this.state.listPrice}元</span>
                        </p>
                        <p>
                            优惠：
                            <span style={{ float: 'right' }}>-￥{this.state.discount}元</span>
                        </p>
                        <p>
                            积分：
                            <span style={{ float: 'right' }}>-￥{this.state.discount}元</span>
                        </p>
                    </div>
                </List>
                <List>
                    <div style={styles.total}>
                        合计：
                            <span style={{ float: 'right' }}>￥{this.state.salePrice}元</span>
                    </div>
                </List>
                <WhiteSpace />

                <Button className="btn" type="primary" style={styles.btn} onClick={() => window.location.href = `/#/paylist?availableMileage=${this.state.availableMileage}`}>提交订单</Button>
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
    input: {
        fontSize: '0.25rem',
        textAlign: 'center',
        borderRadius: '10px',
        width: '1.85rem',
        height: '0.6rem'
    },
    // div2: {
    //     marginBottom: '0.16rem',
    //     fontSize: '0.4rem'
    // },
    div2: {
        width: '1.8rem',
        fontSize: '0.35rem',
        color: '#42A2EA',
        fontWeight: 'bold',
        // marginLeft: '0.2rem',
        borderRight: '1px solid #e8e8e8'
    },
    div3: {
        // lineHeight: '2',
        lineHeight: '3.5',
        textAlign: 'left'
    },
    div4: {
        lineHeight: '2',
        textAlign: 'center'
    },
    coupon: {
        position: 'absolute',
        // top: '0.05rem',
        top: 0,
        left: '2.8rem'
    },
    date: {
        fontSize: '0.2rem',
        marginTop: '-0.15rem'
    },
    info: {
        width: '75%',
        // width: '5.5rem',
        fontSize: '0.35rem',
        margin: '0 auto',
        paddingBottom: '1px'
    },
    total: {
        width: '75%',
        // width: '5.5rem',
        fontSize: '0.35rem',
        margin: '35px auto 0',
        paddingBottom: '35px'
    },
    pay: {
        width: '50%',
        // width: '3.5rem',
        borderRight: '5px solid #ddd'
    },
    paywx: {
        width: '45%',
        // width: '3.3rem',
        position: 'absolute',
        top: '0',
        right: '30px'
    },
    p: {
        width: '1rem',
        margin: '0.55rem auto'
    },
    span: {
        color: '#42A2EA',
        fontSize: '1.5rem',
        marginLeft: '0.5rem',
        marginRight: '0.8rem',
        paddingLeft:'0.6rem',
        borderLeft: '1px solid #ececec',
    },
    img: {
        width: '1rem',
        height: '0.7rem',
        position: 'absolute',
        top: '50%',
        // top: '0.65rem',
        transform: 'translateY(-50%)',
        // left:'10%'
    },
    img1: {
        width: '50px',
        height: '40px'
    },
    price: {
        fontSize: '0.5rem',
        fontWeight: 'bold',
        marginLeft: '25%'
        // marginLeft: '1.5rem'
    },
    discount: {
        color: 'orange',
        fontWeight: 'bold'
    },
    btn: {
        width: '90%',
        margin: '7% auto 0',
        // width: '6.5rem',
        // margin: '0.5rem auto 0',
        fontWeight: 'bold'
    },
    btn1: {
        fontSize:'0.35rem',
        marginLeft: '1rem',
        display: 'inline-block',
        border: 0
    },
}