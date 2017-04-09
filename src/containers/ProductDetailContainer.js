import React, { Component } from 'react';
import { Popup, List, Button, Tag, Icon, Stepper, Flex, WhiteSpace } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';
import cartAPI from '../api/cart.js';


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
    
    <div className="inline-box"  >
        <div style={styles.div} >
            <Button size='small' >XL</Button>
        </div>
    </div>
);

export default class ProductDetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qtyCount: 1,
            selectSizeKey: "",
            selectColorKey: "",
            
            selectedSku: null,
            pdStyle:{},
        };
        this.meetFirstConditionData = [];
        this.meetSecondConditionData = [];
    }
    static propTypes = {
        skusData: React.PropTypes.arrayOf(React.PropTypes.shape({
            code: React.PropTypes.string.isRequired,
            id: React.PropTypes.number.isRequired,
            //images: React.PropTypes.object.isRequired,
            options: React.PropTypes.array.isRequired,
            salePrice: React.PropTypes.any.isRequired,
        })),
        productStyles: React.PropTypes.shape({
            Size: React.PropTypes.array.isRequired,
            Color: React.PropTypes.array.isRequired,
        }).isRequired,
        targetSize: React.PropTypes.string,
        targetColor: React.PropTypes.string,
        // closeModal: React.PropTypes.func.isRequired,
        // openModal: React.PropTypes.func.isRequired,

    }
    async componentDidMount() {
        // console.log(this.props.skusData)
        // console.log(this.props.productStyles)
        let totalHeight = document.documentElement.clientHeight;
        let pd = document.getElementById("productDetailContainer");
        let pdStyle = pd.getBoundingClientRect();
        let pdHeight = pdStyle.height;
        
        if(pdHeight/totalHeight > 0.9)
        {
            let pdStyle = {height:pdHeight/2.5,overflow:'scroll'}
            this.setState({pdStyle:pdStyle});
        }
        if(this.props.targetSize && this.props.targetColor){
            await this._sizeItemPress(this.props.targetSize)
            await this._colorItemPress(this.props.targetColor)
        }
    }

    onClose = () => {
        this.setState({ qtyCount:1 });
        Popup.hide();
    }
    onChange = (qty) => {
        this.setState({ qtyCount:qty });
    }

    selectFirstCondition = (size) => {
        let skusData = this.props.skusData;
        this.meetFirstConditionData = [];
        this.meetSecondConditionData = [];

        skusData.map((sku) => {
            sku.options.map((obj) => {
                if (obj.k == "Size") {
                    if (obj.v == size) {
                        this.meetFirstConditionData.push(sku)
                    }
                }
            })
        })
    }
    selectSecondCondition = (color) => {
        let skusData = this.props.skusData;
        this.meetSecondConditionData = [];

        this.meetFirstConditionData.map((sku) => {
            sku.options.map((obj) => {
                if (obj.k  == "Color") {
                    if (obj.v == color) {
                        this.meetSecondConditionData.push(sku);
                        this.setState({selectedSku:sku});
                    }
                }
            })
        })

    }

    _pressConfirmButton = () => {
        console.log(this.meetSecondConditionData.length)
        if (this.meetSecondConditionData.length == 1 && this.state.qtyCount > 0) {
            let cartId = sessionStorage.getItem("cartId");
            let skuId = this.meetSecondConditionData[0].id;
            // 给购物车添加商品
            cartAPI.addItemsFromCart(cartId, { skuId: skuId, quantity: this.state.qtyCount }).then(res => {
                console.log(res);
                this.props.refreshCartData();
                Popup.hide();
            })
        }
        
    }
    _sizeItemPress = async (size) => {
        if (this.state.selectSizeKey == size) {
            return;
        }
        // console.log("size->", size);
        await this.selectFirstCondition(size);
        // console.log(this.meetFirstConditionData);
        await this.setState({ selectSizeKey: size });
        await this.setState({ selectColorKey: "" });

    }
    _colorItemPress = async (color) => {
        if (!this._existColor(color) || this.state.selectColorKey == color) {
            return;
        }
        await this.selectSecondCondition(color);
        await this.setState({ selectColorKey: color });
        // await console.log(this.meetSecondConditionData[0].images.medium.url );

    }
    _existColor = (color) => {
        let isExist = false;
        for (let i = 0; i < this.meetFirstConditionData.length; i++) {
            if (this.meetFirstConditionData[i].options[1].v == color) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }
    
    render() {
        let sizeContent = this.props.productStyles["Size"].map((val,i) => {
            
            return (
                <div className="inline-box" onClick={()=>{this._sizeItemPress(val)}} key={i} >
                    <div>
                        <Button style={this.state.selectSizeKey === val?{ backgroundColor: "#3e9ce9",color: "white" } : {} } size='small' >{val}</Button>
                    </div>
                </div>
            )
        })
        let colorContent = this.props.productStyles["Color"].map((color, i) => {
            if (this._existColor(color)) {
                return (
                    <div className="inline-box" key={i} onClick={() => this._colorItemPress(color)} >
                        <div>
                            <Button style={this.state.selectColorKey === color ? { backgroundColor: "#3e9ce9", color: "white", } : {}} size='small'>{color}</Button>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="inline-box" key={i} onClick={() => this._colorItemPress(color)} >
                        <div style={this.state.selectColorKey === color ? { color: "#cccccc", } : {}}>
                            <Button size='small' disabled>{color}</Button>
                        </div>
                    </div>
                )
            }

        })
        return (
            <div id="productDetailContainer">
                <List renderHeader={() => (
                    <div style={{ position: 'relative' }} >
                        物品选择
                        <span style={styles.span} onClick={this.onClose}>
                            <Icon type="cross"  />
                        </span>
                    </div>)}
                    className="popup-list"
                    >
                    <div style={{ margin: '0 auto' }}>
                        <table style={styles.table}>
                            <tbody>
                                <tr>
                                    <td style={{textAlign:'center',width:'30%'}}>
                                        {
                                            this.state.selectedSku !== null && this.state.selectedSku.images !== null && this.state.selectedSku.images.medium !== null ?
                                            <img src={this.state.selectedSku.images.medium.url} style={{height:'350px'}}/>
                                            :
                                            ''
                                        }
                                    </td>
                                    <td style={{textAlign:'left'}}>
                                    {
                                        this.state.selectedSku !== null ?
                                            <ul style={styles.ul}>
                                                <li>{this.state.selectedSku.name.length>40?this.state.selectedSku.name.substring(0,40)+'...':this.state.selectedSku.name}</li>
                                                <li>货号 : {this.state.selectedSku.code}</li>
                                                <li>价格 : {this.state.selectedSku.salePrice}</li>
                                                <li>已选尺码 : {this.state.selectedSku.options[0].v}</li>
                                                <li>颜色 : {this.state.selectedSku.options[1].v}</li>
                                            </ul>
                                            :
                                            <ul style={styles.ul}>
                                                <li>羽绒服</li>
                                                <li>货号 : PCVIPSALES01BMFRE</li>
                                                <li>价格 : 30000</li>
                                                <li>已选尺码 : M</li>
                                                <li>颜色 : 白色</li>
                                            </ul>
                                    }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <List style={this.state.pdStyle}>
                        <List >
                            <div style={{ margin: '0.2rem auto' }}>
                                <p style={styles.txt}>尺码</p>
                                <Flex wrap="wrap" id='flex' style={styles.table}>
                                    {sizeContent}
                                </Flex>
                            </div>
                        </List>
                        <List>
                            <div style={{ margin: '0.2rem auto' }}>
                                <p className='productColor' style={styles.txt}>颜色</p>
                                <Flex wrap="wrap" id='flex' style={styles.table}>
                                    {colorContent}
                                </Flex>
                            </div>
                        </List>
                        <List.Item style={{ backgroundColor: '#fff' }} extra={
                            <Stepper
                                style={styles.stepper}
                                showNumber min={1} value={this.state.qtyCount} onChange={this.onChange}
                                />}
                            wrap
                            >
                            数量
                        </List.Item>
                    </List>
                </List>
                <List style={{ padding: '0.15rem' }}>
                    <Button type="primary" onClick={this._pressConfirmButton}>确定</Button>
                </List>
            </div>
        )
    }
}

styles = {
    div: {
        marginBottom:'-0.1rem',
        marginRight:'0.2rem',
    },
    span: {
        position: 'absolute',
        right: 3,
        top: -5,
    },
    table: {
        width: '92%',
        margin: '0 auto',
        fontSize:'0.25rem' , 
    },
    ul: {
        listStyle: 'none',
        lineHeight: '0.5rem',
        paddingLeft:0, 
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