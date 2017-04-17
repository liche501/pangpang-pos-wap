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
            <div className="row" style={{margin:'-0.1rem 0'}}>
                <div style={{width:'92%',height:'0.4rem',overflow:'hidden'}}>{rowData.sku.name}</div>
                <Flex style={styles.flex}>
                    <div style={{width:'75%'}}>
                        <div style={styles.rowData}>{rowData.sku.code}</div>
                        <div style={{ textAlign: 'left' }}>
                            {rowData.listPrice !== rowData.salePrice ? <span style={styles.event}>折</span>:<span style={styles.events}></span>}
                            <span style={styles.discount}>x {rowData.quantity}</span>
                        </div>
                    </div>
                    <div style={{width:'25%',textAlign:'right'}}>
                        {rowData.listPrice !== rowData.salePrice?<div style={styles.listPrice}>￥{rowData.listPrice}</div>:<div style={styles.listPrice}></div>}
                        {rowData.listPrice == rowData.salePrice?<div>￥{rowData.salePrice}</div>:<div style={{ color: "#f00" }}>￥{rowData.salePrice}</div>}
                    </div>
                </Flex>
                {(()=>{
                    if(rowData.sku.discountName){
                        return(
                            <div style={{width:'92%',height:'0.4rem',overflow:'hidden',color:'#f00'}}>{rowData.sku.discountName}</div>
                        )
                    }
                })()}
            </div>

        )
    }
}

styles = {
    flex: {
        // marginTop: '-0.2rem',
        // marginBottom: '-0.2rem'
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
        marginLeft: "3rem",
    },
    td: {
        width: "2.2rem",
        textAlign:'center' 
    },
    listPrice: {
        textDecoration: "line-through",
        minHeight:'36px',
        marginBottom:'0.2rem'
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
    },
    events:{
        display:"inline-block",
        width:"0.5rem",
        height:"0.5rem",
    }
}
