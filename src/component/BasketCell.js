import React, { Component, PropTypes } from 'react';
import imgMD from '../../public/MD.jpg';

const styles = {};

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
        // console.log(rowData)
        return (
            <div className="row">
                <div style={{ display: 'flex' }}>
                    <table className="row-text">
                        <tbody>
                            <tr>
                                <td style={{ width: '5%' }}>
                                    <div style={styles.div}>
                                        <img style={styles.img1} src={this.state.img} />
                                    </div>
                                </td>
                                <td style={{ width: '45%' }}>
                                    <div style={styles.rowData}>{rowData.sku.name}</div>
                                    <div style={styles.div1}>
                                        <img style={styles.img} src={imgMD} />
                                        <span style={styles.discount}>9.5折</span>
                                    </div>
                                </td>
                                <td style={{ width: '10%', textAlign: "left" }}>
                                    <p style={styles.listPrice}>￥{rowData.listPrice}</p>
                                    <p style={styles.salePrice}>￥{rowData.salePrice}</p>
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
        height: '1.28rem',
        width: "1.28rem",
        marginRight: '0.3rem'
    },
    div1: {
        textAlign: 'left' 
    },
    img: {
        width: "50px",
        height: "50px"
    },
    img1: {
        height: '1.28rem' 
    },
    discount: {
        position: "relative",
        marginLeft: "20px",
        top: '-10px'
    },
    rowData: {
        width: '80%',
        marginBottom: '0.16rem',
        textAlign: "left",
        overflow: 'hidden'
    },
    listPrice: {
        textDecoration: "line-through"
    },
    salePrice: {
        color: "#f00"
    }
}
