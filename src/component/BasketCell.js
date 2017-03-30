import React, { Component, PropTypes } from 'react';
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
                <div style={styles.div}>
                    <table className="row-text">
                        <tbody>
                            <tr>
                                <td style={{ width: '5%' }}>
                                    <div style={styles.img}>
                                         {rowData.sku.images && rowData.sku.images.small?<img style={{ height: '1.28rem',width:'1.28rem' }} src={rowData.sku.images.small.url} alt="" />:''}
                                    </div>
                                </td>
                                <td style={{ width: '45%' }}>
                                    <div style={styles.rowData}>{rowData.sku.name}</div>
                                    <div style={{ textAlign: 'left' }}>
                                        <span style={styles.discount}>X {rowData.quantity}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <p style={styles.listPrice}>￥{rowData.listPrice}</p>
                                    <p style={{ color: "#f00" }}>￥{rowData.salePrice}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        )
    }
}

styles = {
    div: {
        display: 'flex',
        padding: '0.3rem 0' 
    },
    div1: {
        margin: '0 auto',
        width: '96%' 
    },
    img: {
        height: '1.28rem',
        width: "1.28rem",
        marginRight: '0.3rem',
        border: '0.5px solid gray'        
    },
    img1: {
        width: "50px",
        height: "50px"
    },
    rowData: {
        marginBottom: '0.16rem',
        width:'80%',
        height:'0.65rem',
        overflow:'hidden',
        textAlign: "left"
    },
    discount: {
        position: "relative",
        marginLeft: "20px",
        bottom: "12px" 
    },
    td: {
        width: "10%",
        textAlign:'center' 
    },
    listPrice: {
        textDecoration: "line-through"
    },
    item: {
        backgroundColor:'#fff',
        borderBottom:'1px solid #eee',
        height:150
    },
    foot: {
        paddingTop: 10,
        textAlign: 'center' 
    }
}
