import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';

export default class SpotSetContainer extends Component {
    render() {
        return (
            <div id="spot">
                <p>
                    <a>天山店</a>
                </p>
                <p>
                    <a>上海正大广场</a>
                </p>
                <p>
                    <a>北京西单店</a>
                </p>
                <p>
                    <a>北京王府井店</a>
                </p>
            </div>
        );
    }
}
