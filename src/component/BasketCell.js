import React, { Component } from 'react';
import imgMD from '../../public/MD.jpg';

export default class BasketCell extends Component {
    constructor() {
        super();
        this.state = {
            img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
            des: 'PCVIPALESDKSNEKF',
        }
    }
    render() {
        return (
            <div className="row">
                <div style={{ display: 'flex' }}>
                    <table className="row-text" style={{ width: '7rem' }}>
                        <tr>
                            <td>
                                <img style={{ height: '1.28rem', width: "1.28rem", marginRight: '0.3rem', marginLeft:'-0.3rem' }} src={this.state.img} />
                            </td>
                            <td style={{width:'80%'}}>
                                <div style={{ marginBottom: '0.16rem', textAlign: "left" }}>{this.state.des}</div>
                                <div style={{ textAlign: 'left' }}>
                                    <img style={{ width: "50px", height: "50px" }} src={imgMD} />
                                    <span style={{ position: "relative", marginLeft: "20px", top: '5px' }}>9.5折</span>
                                </div>
                            </td>
                            <td style={{textAlign: "left" }}>
                                <p style={{ textDecoration: "line-through" }}>￥299.00</p>
                                <p style={{ color: "#f00" }}>￥284.05</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

        )
    }
}