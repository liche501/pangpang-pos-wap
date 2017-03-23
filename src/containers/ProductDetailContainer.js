import React, { Component } from 'react';
import { Popup, List, Button, Icon, Stepper } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = {
        onTouchStart: e => e.preventDefault(),
    };
}


export default class ProductDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            val: 1,
            sel: ''
        };
    }
    onClick = () => {
        Popup.show(<div>
            <List renderHeader={() => (
                <div style={{ position: 'relative' }}>
                    物品选择
                    <span
                        style={{
                            position: 'absolute', right: 3, top: -5,
                        }}
                        onClick={() => this.onClose('cancel')}
                        >
                        <Icon type="cross" />
                    </span>
                </div>)}
                className="popup-list"
                >
                <div style={{ margin: '0.2rem auto' }}>
                    <table style={{ width: '92%', margin: '0 auto' }}>
                        <tbody>
                            <tr>
                                <td>
                                    <img src={imgMD} />
                                </td>
                                <td>
                                    <ul style={{ listStyle: 'none', lineHeight: '0.5rem' }}>
                                        <li>羽绒服</li>
                                        <li>货号 : PCVIPSALES01BMFRE</li>
                                        <li>价格 : 30000</li>
                                        <li>已选尺码M</li>
                                        <li>颜色 : 白色</li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <List>
                    <div style={{ margin: '0.2rem auto' }}>
                        <table style={{ width: '92%', margin: '0 auto' }}>
                            <tbody>
                                <tr>
                                    <td colspan='4'>尺码</td>
                                </tr>
                                <tr>
                                    <td>
                                        <Button className='btn' disabled size='small'>XS</Button>
                                    </td>
                                    <td>
                                        <Button className='btn' disabled size='small'>S</Button>
                                    </td>
                                    <td>
                                        <Button className='btn' type='primary' size='small'>M</Button>
                                    </td>
                                    <td>
                                        <Button className='btn' disabled size='small'>L</Button>
                                    </td>
                                    <td>
                                        <Button className='btn' disabled size='small'>XL</Button>
                                    </td>
                                </tr>
                                <tr style={{ textAlign: 'center' }}>
                                    <td>
                                        150/76
                                    </td>
                                    <td>
                                        155/80
                                    </td>
                                    <td>
                                        160/84
                                    </td>
                                    <td>
                                        165/88
                                    </td>
                                    <td>
                                        170/92
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </List>
                <List>
                    <div style={{ margin: '0.2rem auto' }}>
                                <ul style={{width:'92%',float:'left', listStyle:'none'}}>
                                    <li>
                                        <Button className='btn' inline type='primary' size='small'>白&nbsp;色</Button>
                                    </li>
                                    <li>
                                        <Button className='btn' inline disabled size='small'>黑&nbsp;色</Button>
                                    </li>
                                    <li>
                                        <Button className='btn' inline disabled size='small'>红&nbsp;色</Button>
                                    </li>
                                    <li>
                                        <Button className='btn' inline disabled size='small'>卡其色</Button>
                                    </li>
                                </ul>
                    </div>
                </List>
            </List>
            <ul style={{ padding: '0.18rem 0.3rem', listStyle: 'none' }}>
                <li>
                    <List.Item style={{ backgroundColor: '#fff' }} extra={
                        <Stepper
                            style={{ width: '100%', minWidth: '2rem' }}
                            showNumber max={10} min={1} value={this.state.val} onChange={this.onChange}
                            useTouch={false}
                            />}
                        wrap
                        >
                        数量
                    </List.Item>
                </li>
                <li style={{ marginTop: '0.18rem' }}>
                    <Button type="primary" onClick={() => this.onClose('cancel')}>确定</Button>
                </li>
            </ul>
        </div>, { animationType: 'slide-up', maskProps, maskClosable: false });
    };
    onClose = (sel) => {
        this.setState({ sel });
        Popup.hide();
        // window.location = '/#/paylist';
    };
    onChange = (val) => {
        // console.log(val);
        this.setState({ val });
    }
    render() {
        return (
            <div style={{ padding: '0.15rem' }}>
                <Button onClick={this.onClick}>显示</Button>
            </div>
        )
    }
}