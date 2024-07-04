import React from 'react';
import { Layout, Row, Col } from 'antd';
import Header from './components/Header'; // 引入 Header 组件
import MyTable from './components/Table'; // 引入 Table 组件
import MyChart from './components/MyChart'; // 引入 Chart 组件
import { Button } from 'antd'; // 引入 Ant Design 的 Button 组件
import { ExpandOutlined } from '@ant-design/icons'; // 引入 Ant Design 的图标

const { Sider, Content } = Layout;

const App = () => {
  const [expandedSize, setExpandedSize] = React.useState('45%');

  const handleExpandClick = () => {
    setExpandedSize(expandedSize === '45%' ? '100%' : '45%');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider 
        width="15%" 
        style={{ 
          backgroundColor: '#45454D', 
          position: 'fixed', 
          height: '100vh', 
          overflow: 'auto' 
        }}> {/* 左侧导航栏 */}
        <Header /> {/* 使用 Header 组件 */}
      </Sider>
      <Layout style={{ marginLeft: '15%' }}> {/* 调整内容布局 */}
        <Content style={{ padding: '20px' }}>
          <Row gutter={[16, 16]} style={{ height: '100%' }}>
            {expandedSize === '45%' && (
              <Col span={24} style={{ backgroundColor: '#f0f2f5', height: '55%' }}> {/* 右侧上半部分 */}
                <MyTable />
              </Col>
            )}
            <Col span={24} className="expandable-col" style={{ backgroundColor: '#ffffff', height: expandedSize, position: 'relative', transition: 'height 0.3s' }}> {/* 右侧下半部分 */}
              <Button 
                shape="circle" 
                icon={<ExpandOutlined />} 
                style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }} 
                onClick={handleExpandClick}
              />
              <div style={{ height: '100%', overflow: 'auto' }}>
                <MyChart expandedSize={expandedSize} /> {/* 传递 expandedSize 状态 */}
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;