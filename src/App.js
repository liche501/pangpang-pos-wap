import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import { List, Checkbox } from 'antd-mobile';
import './App.css';

const CheckboxItem = Checkbox.CheckboxItem;
class App extends Component {
  onChange = (val) => {
    console.log(val);
  }
  render() {
    const data = [
      { value: 0, label: '博士' },
      { value: 1, label: '本科' },
      { value: 2, label: '高中' },
    ];
    return (
      <div>
        <Button className="btn" type="primary">primary 按钮</Button>
        <List renderHeader={() => 'CheckboxItem 演示'}>
        {data.map(i => (
          <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
            {i.label}
          </CheckboxItem>
        ))}
        <CheckboxItem key="disabled" data-seed="logId" disabled defaultChecked multipleLine>
          初中<List.Item.Brief>辅助文字内容</List.Item.Brief>
        </CheckboxItem>
      </List>
      </div>
    );
  }
}

export default App;
