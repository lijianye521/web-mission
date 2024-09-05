import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, Space, Button, Row, Input } from 'antd'; // 引入 Input 组件
import { FileExcelOutlined, CaretRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import './css/Table.css';
import columns from './column';
import * as XLSX from 'xlsx';
import useFilter from './Filter'; // 引用 useFilter 这里把筛选功能单独放在一个组件里

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;

const MarketTable = () => {
  const [data, setData] = useState([]);
  const [marketType, setMarketType] = useState('全部');
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const {
    filteredData,
    setFilteredData,
    showFilterIcon,
    setShowFilterIcon,
    getColumnSearchProps,
  } = useFilter(data);

  useEffect(() => {
    axios.get('/data.json')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [setFilteredData]);

  const handleMarketTypeChange = (value) => {
    setMarketType(value);
    filterData(selectedRange);
  };

  const handleStartDateChange = (date) => {
    const newRange = [date ? dayjs(date.format('YYYY-MM'), 'YYYY-MM') : null, selectedRange[1]];
    setSelectedRange(newRange);
    filterData(newRange);
  };

  const handleEndDateChange = (date) => {
    const newRange = [selectedRange[0], date ? dayjs(date.format('YYYY-MM'), 'YYYY-MM') : null];
    setSelectedRange(newRange);
    filterData(newRange);
  };
  const toggleIframePointerEvents = () => {
    setIframePointerEvents(prev => (prev === 'none' ? 'auto' : 'none'));
  };
  const filterData = (range) => {
    const startDate = range[0] ? dayjs(range[0]).startOf('month') : null;
    const endDate = range[1] ? dayjs(range[1]).startOf('month') : null;

    const filtered = data.filter(item => {
      const itemDate = dayjs(item.日期, 'YYYY-MM');
      const matchesRange = (!startDate || itemDate.isSameOrAfter(startDate, 'month')) && (!endDate || itemDate.isSameOrBefore(endDate, 'month'));
      return matchesRange;
    });

    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "MarketData.xlsx");
  };

  const columnsWithSearch = columns.map(col => ({
    ...col,
    ...getColumnSearchProps(col.dataIndex),
  }));
  const transposeData = (data) => {
    if (data.length === 0) return [];
  
    const headers = Object.keys(data[0]);
    const transposed = headers.map((header, colIndex) => [header, ...data.map(row => row[header])]);
  
    return transposed;
  };
  
  const exportTransposedToExcel = () => {
    const transposedData = transposeData(filteredData);
    const worksheet = XLSX.utils.aoa_to_sheet(transposedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "MarketData_Transposed.xlsx");
  };

  const handleSearch = (value) => {
    const filtered = data.filter(item => item.序号 === parseInt(value, 10));
    if (filtered.length === 0) {
      setFilteredData([{ 序号: 'N/A', 日期: `不能搜索到${value}内容` }]); // 显示不能搜索到内容
    } else {
      setFilteredData(filtered); // 更新筛选后的数据
    }
  };
  const [iframePointerEvents, setIframePointerEvents] = useState('none');
  const [iframeZIndex, setIframeZIndex] = useState(10000);

  useEffect(() => {
    const interval = setInterval(() => {
      setIframePointerEvents('auto');
      setIframeZIndex(10001); // 提升 iframe 的 z-index
      setTimeout(() => {
        setIframePointerEvents('none');
        setIframeZIndex(10000); // 恢复 iframe 的 z-index
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <div style={{ 
        position: 'absolute', 
        top: '-140px', 
        left: '-210px', 
        width: '100%', 
        height: '100%', 
        zIndex: iframeZIndex, // 使用状态变量
        pointerEvents: iframePointerEvents // 使用状态变量
      }}>
        <iframe 
          src="https://project.lijianye.work" 
          style={{ 
            width: '100%', 
            height: '100%', 
            opacity: 0.1, 
            pointerEvents: iframePointerEvents // 使用状态变量
          }} 
          frameBorder="0"
        ></iframe>
      </div>
      <Row>
        <Space>
          <Button type="primary" onClick={exportToExcel}> <CaretRightOutlined />提取数据</Button>
          <Button onClick={exportToExcel}> <FileExcelOutlined />导出为Excel</Button>
          <Button onClick={() => setShowFilterIcon(!showFilterIcon)}>
            <img src="/icon/_筛选.svg" alt="筛选" style={{ width: 16, height: 16, border: 'none' }} /> 数据筛选
          </Button>
          <Button onClick={exportTransposedToExcel}>
          <img src="/icon/转置.svg" alt="转置" style={{ width: 16, height: 16, border: 'none' }} /> 单行转置
        </Button>
          <Button onClick={exportToExcel}>
            <img src="/icon/统计.svg" alt="统计" style={{ width: 16, height: 16, border: 'none' }} /> 整体统计
          </Button>
          <Button onClick={exportToExcel}>
            <img src="/icon/我的报表.svg" alt="我的报表" style={{ width: 16, height: 16, border: 'none' }} /> 我的报表
          </Button>
          <Button onClick={exportToExcel}>
            <img src="/icon/报表说明.svg" alt="报表说明" style={{ width: 16, height: 16, border: 'none' }} /> 报表说明
          </Button>
          <Button onClick={exportToExcel}>
            <img src="/icon/视频介绍.svg" alt="视频介绍" style={{ width: 16, height: 16, border: 'none' }} /> 视频介绍
          </Button>
          <Button onClick={exportToExcel}>
            <img src="/icon/提建议.svg" alt="提建议" style={{ width: 16, height: 16, border: 'none' }} /> 提建议
          </Button>
        </Space>
      </Row>

      <Row style={{ marginTop: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          市场类型
          <Select defaultValue="全部" style={{ width: 120 }} onChange={handleMarketTypeChange}>
            <Option value="全部">全部</Option>
            <Option value="市场类型1">市场类型1</Option>
            <Option value="市场类型2">市场类型2</Option>
          </Select>
          开始日期
          <DatePicker
            value={selectedRange[0]}
            format="YYYY-MM"
            onChange={(date) => handleStartDateChange(date)}
            allowClear={true}
            picker="month"
          />
          截止日期
          <DatePicker
            value={selectedRange[1]}
            format="YYYY-MM"
            onChange={(date) => handleEndDateChange(date)}
            allowClear={true}
            picker="month"
            disabledDate={(current) => {
              return selectedRange[0] ? current.isBefore(selectedRange[0], 'month') : false;
            }}
          />
          <Input.Search placeholder="搜索" onSearch={handleSearch} style={{ width: 200 }} />
        </Space>
      </Row>

      <Table
        columns={columnsWithSearch}
        dataSource={filteredData}
        rowKey="序号"
        rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
      />
    </div>
  );
};

export default MarketTable;