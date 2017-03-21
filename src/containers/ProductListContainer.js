import React, { Component } from 'react';
import { SearchBar, Button, WhiteSpace, List, ListView } from 'antd-mobile';
import imgMD from '../../public/MD.jpg';

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}

const data = [
    {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        des: '刺绣圆点连衣裙 PCVIPALESDKSNEKF',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        des: '刺绣圆点连衣裙 PCVIPALESDKSNEKF',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        des: '刺绣圆点连衣裙 PCVIPALESDKSNEKF',
    },
];
let index = data.length - 1;

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const Item = List.Item;

export default class ProductListContainer extends Component {
    state = {
        value: '服装',
        focused: false,
    };
    onChange = (value) => {
        this.setState({ value });
    };
    clear = () => {
        this.setState({ value: '' });
    };

    constructor(props) {
        super(props);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.dataBlob = {};
        this.sectionIDs = [];
        this.rowIDs = [];
        this.genData = (pIndex = 0) => {
            for (let i = 0; i < NUM_SECTIONS; i++) {
                const ii = (pIndex * NUM_SECTIONS) + i;
                const sectionName = `Section ${ii}`;
                this.sectionIDs.push(sectionName);
                this.dataBlob[sectionName] = sectionName;
                this.rowIDs[ii] = [];

                for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
                    const rowName = `S${ii}, R${jj}`;
                    this.rowIDs[ii].push(rowName);
                    this.dataBlob[rowName] = rowName;
                }
            }
            // new object ref
            this.sectionIDs = [].concat(this.sectionIDs);
            this.rowIDs = [].concat(this.rowIDs);
        };

        this.state = {
            dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
            isLoading: true,
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
                isLoading: false,
            });
        }, 600);
    }
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.genData(++pageIndex);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
                isLoading: false,
            });
        }, 1000);
    }
    render() {
        const separator = (sectionID, rowID) => (
            <div key={`${sectionID}-${rowID}`} style={{
                backgroundColor: '#F5F5F9',
                height: 8,
                borderTop: '1px solid #ECECED',
                borderBottom: '1px solid #ECECED',
            }}
                />
        );
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = data.length - 1;
            }
            const obj = data[index--];
            return (
                <div key={rowID} className="row">
                    <div style={{ display: 'flex', padding: '0.3rem 0' }}>
                        <table className="row-text">
                            <tbody>
                            <tr>
                                <td>
                                    <img style={{ height: '1.28rem', marginRight: '0.3rem' }} src={obj.img} />
                                </td>
                                <td>
                                    <div style={{ marginBottom: '0.16rem', width: '80%',textAlign:"left" }}>{obj.des}</div>
                                    <div style={{textAlign:'left'}}>
                                        <img style={{ width: "50px", height: "50px" }} src={imgMD} />
                                        <span style={{ position: "relative", marginLeft: "20px", bottom: "12px" }}>9.5折</span>
                                    </div>
                                </td>
                                <td style={{ width: "150px", textAlign: "left" }}>
                                    <p style={{ textDecoration: "line-through" }}>￥299.00</p>
                                    <p style={{ color: "#f00" }}>￥284.05</p>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        };

        return (
            <div>
                <SearchBar placeholder="搜索" autoFocus />
                <Item extra="内容内容" arrow="horizontal" onClick={() => { } }>
                    <img className="product-img" src={imgMD} />
                </Item>
                <div style={{ margin: '0 auto', width: '96%' }}>
                    <ListView ref="lv"
                        dataSource={this.state.dataSource}
                        renderFooter={() => <div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中...' : '加载完毕'}
                        </div>}
                        renderBodyComponent={() => <MyBody />}
                        renderRow={row}
                        renderSeparator={separator}
                        className="fortest"
                        style={{
                            height: document.documentElement.clientHeight * 3 / 4,
                            overflow: 'auto',
                            border: '1px solid #ddd',
                            margin: '0.1rem 0',
                        }}
                        pageSize={4}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        onScroll={() => {  } }
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                        />
                </div>
            </div>
        );
    }
}
