import React, { useState } from 'react';
import { Menu } from 'antd';

const items = [
    {
      key: '1',
      label: '市场概览',
    },
    {
      key: '2',
      label: '市场规模',
      children: [
        {
          key: '21',
          label: '市场规模统计（交易所公布）',
        },
        {
          key: '22',
          label: '市场数据统计（Wind统计）',
        },
        {
          key: '23',
          label: '行业规模统计（Wind统计）',
        },
      ],
    },
    {
      key: '3',
      label: '股票概览',
      children: [
        {
          key: '31',
          label: '上市股票一览',
        },
        {
          key: '32',
          label: '上市公司基本资料',
        },
        {
          key: '33',
          label: '上市公司规模排名',
        },
      ],
    },
    {
      key: '4',
      label: '备查资料',
      children: [
        {
          key: '41',
          label: '股票更名',
        },
        {
          key: '42',
          label: '公司更名',
        },
        {
          key: '43',
          label: '实施ST',
        },
        {
          key: '44',
          label: '撤销ST',
        },
        {
          key: '45',
          label: '暂停上市',
        },
        {
          key: '46',
          label: '恢复上市',
        },
      ],
    },
    {
      key: '5',
      label: '退市资料',
      children: [
        {
          key: '51',
          label: '退市资料',
        },
        {
          key: '52',
          label: '退市风险预警',
        },
      ],
    },
  ];
const App = () => {
    const [selectedKeys, setSelectedKeys] = useState([]);

    const handleClick = (e) => {
        const { key } = e;
        setSelectedKeys([key]);
    };

    return (
        <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={handleClick}
            style={{ width: "100%", height: '100vh', backgroundColor: '#45454D', color: 'white' }}
        >
            {items.map((item) => (
                item.children ? (
                    <Menu.SubMenu 
                        key={item.key} 
                        title={
                            <span style={{ color: selectedKeys.some(key => key.startsWith(item.key)) ? 'deepskyblue' : 'white' }}>
                                {item.label}
                            </span>
                        }
                    >
                        {item.children.map((child) => (
                            <Menu.Item 
                                key={child.key} 
                                style={{ 
                                    backgroundColor: selectedKeys.includes(child.key) ? 'deepskyblue' : 'inherit',
                                    color: 'white'
                                }}
                            >
                                {child.label}
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                ) : (
                    <Menu.Item 
                        key={item.key} 
                        style={{ 
                            backgroundColor: selectedKeys.includes(item.key) ? 'deepskyblue' : 'inherit',
                            color: 'white'
                        }}
                    >
                        {item.label}
                    </Menu.Item>
                )
            ))}
        </Menu>
    );
};

export default App;