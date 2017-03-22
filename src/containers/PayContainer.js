import React, { Component } from 'react';
import Navi from '../component/Navi.js';
import { Button, ListView, WingBlank, WhiteSpace, List } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import pay1 from '../../public/zfb.gif';
import pay2 from '../../public/wxzf.gif';
import ticket from '../../public/ticket.gif';

const Item = List.Item;

export default class PayContainer extends Component {
    state = {
        menuName: "订单",
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        userName: '某某某',
        userId: '001293398440'
    }

    componentWillMount() {
        document.getElementsByTagName("body")[0].style.backgroundColor='#f6f6f6';
    }
    render() {
        return (
            <div>
                <Navi style={{ backgroundColor: "#fff" }} leftIcon="left" title={this.state.menuName} />
                <div className="row">
                    <div style={{ display: 'flex', padding: '0.3rem 0' }}>
                        <div style={{ height: '1.28rem',width:'2rem', fontSize:'0.5rem', marginRight:'0.5rem',backgroundColor:'#f6f6f6'}} >
                            <p style={{width:'1rem',margin:'30px auto'}}>Lv.5</p>
                        </div>
                        <div className="row-text" style={{ lineHeight: '1.5' }}>
                            <div style={{ marginBottom: '0.16rem', fontSize: '0.4rem' }}>姓&nbsp;名 : {this.state.userName}</div>
                            <div style={{ fontSize: '0.4rem' }}>会员号 : {this.state.userId}</div>
                        </div>
                    </div>
                </div>
                <WhiteSpace />
                <WingBlank>
                    <List>
                        <Item data-seed="logId" style={{backgroundColor:'#fff'}}>
                            <div style={{lineHeight:'2', textAlign:'left'}}>
                                <span style={{color:'#42A2EA', fontSize:'0.4rem', fontWeight:'bold'}}>汉光百货 </span>
                                 <span>|</span> 
                                 <span> Coupon/SALE</span>
                            </div>
                        </Item>
                    </List>
                </WingBlank>
                <WhiteSpace />
                <List>
                    <Item data-seed="logId" style={{backgroundColor:'#fff'}}>
                        <div style={{lineHeight:'2', textAlign:'center'}}>
                            <img src={ticket} style={{width:'1rem', height:'0.7rem',marginBottom:'15px'}}/>
                            <span style={{fontSize:'0.5rem', fontWeight:'bold'}}> ￥450 </span>
                            <span style={{color:'orange', fontWeight:'bold'}}>(已优惠 46 元)</span>
                        </div>
                    </Item>
                </List>
                <WhiteSpace />
                <List>
                    <Item style={{backgroundColor:'#fff'}} onClick={() => { } } >
                        <div style={{textAlign:'center'}}>
                            <img src={pay1} style={{marginRight:'5px'}}/>
                            <span>支付宝</span>
                        </div>
                    </Item>
                </List>
                <List>
                    <Item style={{backgroundColor:'#fff'}}>
                        <div style={{textAlign:'center'}}>
                            <img src={pay2} style={{width:'50px', height:'40px'}}/>
                            <span>微&nbsp;信</span>
                        </div>
                    </Item>
                </List>
                <Button style={{ width: '90%', margin: '7% auto 0', fontWeight:'bold' }} className="btn" type="primary">Pay Confirm ￥450</Button>
            </div>
        )
    }
}