import React, { Component,PropTypes } from 'react';
import imgMD from '../../public/MD.jpg';

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
                    <table className="row-text" style={{ width: '7rem' }}>
                        <tbody>
                            <tr>
                                <td>
                                    <img style={{ height: '1.28rem', width: "1.28rem", marginRight: '0.3rem', marginLeft: '-0.3rem' }} src={this.state.img} />
                                </td>
                                <td style={{ width: '80%' }}>
                                    <div style={{ marginBottom: '0.16rem', textAlign: "left" }}>{rowData.sku.name}</div>
                                    <div style={{ textAlign: 'left' }}>
                                        <img style={{ width: "50px", height: "50px" }} src={imgMD} />
                                        <span style={{ position: "relative", marginLeft: "20px", top: '5px' }}>9.5折</span>
                                    </div>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                    <p style={{ textDecoration: "line-through" }}>￥{rowData.listPrice}</p>
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