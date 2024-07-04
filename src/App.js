import React from 'react';
import { Layout, Row, Col } from 'antd';
import Header from './components/Header'; // 引入 Header 组件
import MyTable from './components/Table'; // 引入 Table 组件
import MyChart from './components/MyChart'; // 引入 Chart 组件
const { Sider, Content } = Layout;

const App = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width="15%" style={{ backgroundColor: '#45454D' }}> {/* 左侧导航栏 */}
        <Header /> {/* 使用 Header 组件 */}
      </Sider>
      <Layout>
        <Content style={{ padding: '20px' }}>
          <Row gutter={[16, 16]} style={{ height: '100%' }}>
            <Col span={24} style={{ backgroundColor: '#f0f2f5', height: '60%' }}> {/* 右侧上半部分 */}
              {/* <div style={{ padding: '20px' }}>上半部分内容</div> */}
              <MyTable />
            </Col>
            <Col span={24} style={{ backgroundColor: '#ffffff', height: '40%' }}> {/* 右侧下半部分 */}
              <MyChart />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;