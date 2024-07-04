import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, Space, Button , Row} from 'antd'; // 引入 Button
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import './css/Table.css'; // 引入 CSS 文件
import columns from './column'; // 引用 columns
import * as XLSX from 'xlsx'; // 引入 xlsx 库
import { FileExcelOutlined,CaretRightOutlined } from '@ant-design/icons'; // 正确导入图标

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;

const MarketTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [marketType, setMarketType] = useState('全部');
  const [selectedRange, setSelectedRange] = useState([null, null]);//日期范围

  useEffect(() => {
    axios.get('/data.json')
      .then(response => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMarketTypeChange = (value) => {
    setMarketType(value);
    filterData(selectedRange); // 确保传递的是 selectedRange
  };
  
  const handleStartDateChange = (date) => {
    const newRange = [date ? dayjs(date.format('YYYY-MM'), 'YYYY-MM') : null, selectedRange[1]];
    setSelectedRange(newRange);
    console.log("newStartRange", newRange[0]);
    filterData(newRange); // 传递 newRange
  };
  
  const handleEndDateChange = (date) => {
    console.log("dateis dayjs", dayjs.isDayjs(date));//date是dayjs对象
    const newRange = [selectedRange[0], date ? dayjs(date.format('YYYY-MM'), 'YYYY-MM') : null];
    console.log("newEndRange", newRange[1]);
    setSelectedRange(newRange);
    filterData(newRange); // 传递 newRange
  };
  
  //筛选数据
  const filterData = (range) => {
    //检查range[0]是否为dayjs对象
    
    const startDate = range[0] ? dayjs(range[0]).startOf('month') : null;
    const endDate = range[1] ? dayjs(range[1]).startOf('month') : null;
    console.log("startDate", startDate);
    console.log("endDate", endDate);
  
    // 检查 startDate 是否在 endDate 之前
    const isBefore = startDate && endDate ? startDate.isBefore(endDate, 'month') : true;
     console.log("isBefore", isBefore); // 输出: true
    const filtered = data.filter(item => {
    const itemDate = dayjs(item.日期, 'YYYY-MM');
    //   console.log("itemDate", itemDate.format('YYYY-MM'));
      const matchesRange = (!startDate || itemDate.isSameOrAfter(startDate, 'month')) && (!endDate || itemDate.isSameOrBefore(endDate, 'month'));
    //   console.log("matchesRange", matchesRange);
      return matchesRange;
    });
  
    setFilteredData(filtered);
    console.log("filtered", filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "MarketData.xlsx");
  };

  return (
    
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
        <Row>
        <Space>
            <Button type="primary" onClick={exportToExcel}> <CaretRightOutlined />提取数据</Button> {/* 不太了解这到底是要添加一个怎样的功能 暂且和导出为excel一样的功能吧 */}   
            <Button  onClick={exportToExcel}> <FileExcelOutlined />导出为Excel</Button> 
            <Button onClick={exportToExcel}>
            <img src="/icon/_筛选.svg" alt="筛选" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             数据筛选
            </Button>
            <Button onClick={exportToExcel}>
            <img src="/icon/转置.svg" alt="转置" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             单行转置
            </Button>
            <Button onClick={exportToExcel}>
            <img src="/icon/统计.svg" alt="统计" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             整体统计
            </Button>
            <Button onClick={exportToExcel}>
            <img src="/icon/我的报表.svg" alt="我的报表" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             我的报表
            </Button>
            <Button onClick={exportToExcel}>
            <img src="/icon/报表说明.svg" alt="报表说明" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             报表说明
            </Button>
            <Button onClick={exportToExcel}>
            <img src="/icon/视频介绍.svg" alt="视频介绍" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             视频介绍
            </Button>
            <Button onClick={exportToExcel}>
            <img src="/icon/提建议.svg" alt="视频介绍" style={{ width: 16, height: 16 ,border:'none'}} /> {/* 添加自定义图标 */}
             提建议
            </Button>




          </Space>
        </Row>

        <Row  style={{ marginTop: 16 }}>
        <Space style={{ marginBottom: 16 }}>
        市场类型
        <Select defaultValue="全部" style={{ width: 120 }} onChange={handleMarketTypeChange}>
          <Option value="全部">全部</Option>
          <Option value="市场类型1">市场类型1</Option>
          <Option value="市场类型2">市场类型2</Option>
        </Select>
        开始日期
        <DatePicker
          value={selectedRange[0]} // 确保绑定到 selectedRange[0]
          format="YYYY-MM"
          onChange={(date) => handleStartDateChange(date)}
          allowClear={true}
          picker="month"
        />
        截止日期
        <DatePicker
          value={selectedRange[1]} // 确保绑定到 selectedRange[1]
          format="YYYY-MM"
          onChange={(date) => handleEndDateChange(date)}
          allowClear={true}
          picker="month"
          disabledDate={(current) => {
            return selectedRange[0] ? current.isBefore(selectedRange[0], 'month') : false;
          }}
        />
      </Space>
        </Row>
      
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="序号" 
        rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'} // 设置行样式
      />
    </div>
  );
};

export default MarketTable;