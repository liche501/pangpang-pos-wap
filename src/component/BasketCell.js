import React, { Component, PropTypes } from 'react';
import { Flex  } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';

let styles = {};

export default class BasketCell extends Component {
    constructor() {
        super();
        this.state = {
            img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
            des: 'PCVIPALESDKSNEKF',
        }
    }
    static propTypes = {
        rowData: PropTypes.object.isRequired
    }
    // static defaultProps = {
    //     rowData: {}
    // }
    render() {  
        let {rowData} = this.props;
        //console.log(rowData)
        return (
            <div className="row">
                <div style={{width:'91%',margin:'0 auto 0.2rem',height:'0.4rem',overflow:'hidden'}}>{rowData.sku.name}</div>
                <Flex style={styles.flex}>
                    <div style={{width:'75%',paddingLeft:'0.3rem'}}>
                        <div style={styles.rowData}>{rowData.sku.code}</div>
                        <div style={{ textAlign: 'left' }}>
                            {rowData.listPrice !== rowData.salePrice && <span style={styles.event}>折</span>}
                            <span style={styles.discount}>X {rowData.quantity}</span>
                        </div>
                    </div>
                    <div style={{width:'20%',textAlign:'center'}}>
                        {rowData.listPrice !== rowData.salePrice?<p style={styles.listPrice}>￥{rowData.listPrice}</p>:<p style={styles.listPrice}></p>}
                        {rowData.listPrice == rowData.salePrice?<p>￥{rowData.salePrice}</p>:<p style={{ color: "#f00" }}>￥{rowData.salePrice}</p>}
                    </div>
                </Flex>
            </div>

        )
    }
}

styles = {
    flex: {
        marginTop: '-0.35rem',
        marginBottom: '-0.35rem'
    },
    // img: {
    //     height: '1.4rem',
    //     width: "1.4rem",
    //     marginRight: '0.4rem',
    // },
    rowData: {
        marginBottom: '0.2rem',
        height:'0.35rem',
        overflow:'hidden',
        textAlign: "left",
    },
    discount: {
        position: "relative",
        marginLeft: "20px",
    },
    td: {
        width: "2.2rem",
        textAlign:'center' 
    },
    listPrice: {
        textDecoration: "line-through",
        minHeight:'36px'
    },
    item: {
        backgroundColor:'#fff',
        borderBottom:'1px solid #eee',
        height:150
    },
    foot: {
        paddingTop: 10,
        textAlign: 'center' 
    },
    event:{
        display:"inline-block",
        backgroundColor:"#d787fc",
        color:"white",
        width:"0.5rem",
        height:"0.5rem",
        lineHeight:"0.5rem",
        textAlign:"center",
    }
}
