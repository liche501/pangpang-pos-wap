import React, { Component } from 'react';
import { Popup, List, Button, Icon, Stepper, Flex, WhiteSpace } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
const styles = {};

let maskProps;
if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = {
        onTouchStart: e => e.preventDefault(),
    };
}
const PlaceHolder = props => (
    <div {...props}>
        <div style={{marginRight:'0.1rem'}}>
            <Button size='small'>白色</Button>
        </div>
    </div>
);
const PlaceHolder1 = props => (
    <div {...props}>
        <div style={styles.div}>
            <Button size='small'>XL</Button>
            <p class='size' style={styles.p}>150/76</p>
        </div>
    </div>
);

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
                    <span style={styles.span} onClick={() => this.onClose('cancel')}>
                        <Icon type="cross" onClick={() => this.onClose('cancel')} />
                    </span>
                </div>)}
                className="popup-list"
                >
                <div style={{ margin: '0 auto' }}>
                    <table style={styles.table}>
                        <tbody>
                            <tr>
                                <td>
                                    <img src={imgMD} />
                                </td>
                                <td>
                                    <ul style={styles.ul}>
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
                        <p style={styles.txt}>尺码</p>
                        <Flex wrap="wrap" id='flex' style={styles.table}>
                            <PlaceHolder1 className="inline-box" />
                            <PlaceHolder1 className="inline-box" />
                            <PlaceHolder1 className="inline-box" />
                            <PlaceHolder1 className="inline-box" />
                            <PlaceHolder1 className="inline-box" />
                            <PlaceHolder1 className="inline-box" />
                            <PlaceHolder1 className="inline-box" />
                        </Flex>
                    </div>
                </List>
                <List>
                    <div style={{ margin: '0.2rem auto' }}>
                        <p class='productColor' style={styles.txt}>颜色</p>
                        <Flex wrap="wrap" id='flex' style={styles.table}>
                            <PlaceHolder className="inline" />
                            <PlaceHolder className="inline" />
                            <PlaceHolder className="inline" />
                            <PlaceHolder className="inline" />
                            <PlaceHolder className="inline" />
                            <PlaceHolder className="inline" />
                            <PlaceHolder className="inline" />
                        </Flex>
                    </div>
                </List>
            </List>
            <ul style={styles.step}>
                <li>
                    <List.Item style={{ backgroundColor: '#fff' }} extra={
                        <Stepper
                            style={styles.stepper}
                            showNumber min={1} defaultValue={1} onChange={this.onChange}
                            />}
                        wrap
                        >
                        数量
                    </List.Item>
                </li>
                <li style={{ marginTop: '0.18rem' }}>
                    <Button type="primary" onClick={this.handleClick}>确定</Button>
                </li>
            </ul>
        </div>, { animationType: 'slide-up', maskProps, maskClosable: false });
    };
    onClose = (sel) => {
        this.setState({ sel });
        Popup.hide();
    };
    onChange = (val) => {
        // console.log(val);
        this.setState({ val });
    }
    handleClick = () =>{
        Popup.hide();
        window.location = '/#/paylist';
    }
    render() {
        return (
            <div style={{ padding: '0.15rem' }}>
                <Button onClick={this.onClick}>显示</Button>
            </div>
        )
    }
}

styles = {
    div: {
        marginBottom:'-0.1rem',
        marginRight:'0.2rem'
    },
    p: {
        fontSize:'0.25rem' ,
        textAlign:'center',
        marginTop:'0.1rem',
        marginBottom:'0.1rem'
    },
    span: {
        position: 'absolute',
        right: 3,
        top: -5,
    },
    table: {
        width: '92%',
        margin: '0 auto' 
    },
    ul: {
        listStyle: 'none',
        lineHeight: '0.5rem' 
    },
    txt: {
        width: '92%',
        margin: '0.2rem auto 0.1rem'
    },
    step: {
        padding: '0 0.3rem',
        listStyle: 'none' 
    },
    stepper: {
        width: '100%',
        minWidth: '2rem' 
    }
}