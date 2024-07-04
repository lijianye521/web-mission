import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';
import { Button, Space, Drawer, Checkbox } from 'antd'; // 引入 Drawer 和 Checkbox 组件
import { SketchPicker } from 'react-color'; // 引入调色盘组件
import { saveAs } from 'file-saver'; // 引入 file-saver 库
import { message ,Select} from 'antd'; // 引入 message 组件

const MyChart = ({ expandedSize }) => {
  console.log('子组件expandedSize', expandedSize);
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [metricData, setMetricData] = useState([]);
  const [chartType, setChartType] = useState('line'); // 新增状态来存储图表类型
  const [lineColor, setLineColor] = useState('#000'); // 新增状态来存储线条颜色
  const [indicators, setIndicators] = useState([]); // 新增状态来存储指标
  const [selectedIndicator, setSelectedIndicator] = useState('上市公司总数'); // 新增状态来存储选中的指标
  const [drawerVisible, setDrawerVisible] = useState(false); // 新增状态来控制抽屉显示
  const chartRef = useRef(null);
  let myChart = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false); // 新增状态来控制调色盘显示

  useEffect(() => {
    axios.get('/data.json')
      .then(response => {
        setData(response.data);
        const months = response.data.map(item => item.日期);
        months.reverse();
        setMonths(months);
        updateMetricData(response.data, selectedIndicator);
        const keys = Object.keys(response.data[0]).filter(key => key !== '日期' && key !== '序号');
        setIndicators(keys);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    return () => {
      if (myChart.current) {
        myChart.current.dispose();
      }
    };
  }, []);

  const saveAsImage = () => {
    if (myChart.current) {
      const dataURL = myChart.current.getDataURL({
        type: 'png',
        backgroundColor: '#fff'
      });
      saveAs(dataURL, 'chart.png');
    }
  };

  const copyImage = () => {
    if (myChart.current) {
      const dataURL = myChart.current.getDataURL({
        type: 'png',
        backgroundColor: '#fff'
      });
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item])
            .then(() => {
              message.success('图片复制成功'); // 显示成功消息
            })
            .catch(err => {
              console.error('Error copying image:', err);
              message.error('图片复制失败'); // 显示失败消息
            });
        })
        .catch(err => {
          console.error('Error copying image:', err);
          message.error('图片复制失败'); // 显示失败消息
        });
    }
  };

  const updateMetricData = (data, indicator) => {
    const metricData = data.map(item => parseFloat(item[indicator]));
    metricData.reverse();
    setMetricData(metricData);
    renderChart(months, metricData);
  };

  function renderChart(months, metricData) {
    if (!chartRef.current) return;
    if (myChart.current) {
      myChart.current.dispose();
    }
    myChart.current = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const data = params[0].data;
          return `日期: ${params[0].name}<br/>${selectedIndicator}: ${data}`;
        }
      },
      legend: { // 添加图例配置
        data: [selectedIndicator],
        top: 'top', // 图例组件离容器上侧的距离
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          formatter: function (value) {
            const date = new Date(value);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: selectedIndicator,
          type: chartType, // 使用状态中的图表类型
          data: metricData,
          itemStyle: {
            color: lineColor // 使用状态中的线条颜色
          }
        }
      ]
    };
    myChart.current.setOption(option);
  }

  useEffect(() => {
    if (months.length > 0 && metricData.length > 0) {
      renderChart(months, metricData);
    }
  }, [months, metricData, chartType, lineColor, selectedIndicator]); // 添加 selectedIndicator 作为依赖

  useEffect(() => {
    const handleResize = () => {
      if (myChart.current) {
        console.log('Resizing chart due to window size change');
        requestAnimationFrame(() => {
          myChart.current.resize();
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Space style={{ marginTop: '8px', height: '10%', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size='small' onClick={() => setChartType('line')}><img src="/icon/折线图.svg" alt="折线图" style={{ width: 16, height: 16 ,border:'none'}} /></Button>
          <Button size='small' onClick={() => setChartType('bar')}><img src="/icon/柱状图.svg" alt="柱状图" style={{ width: 16, height: 16 ,border:'none'}} /></Button>
          <Button size='small' onClick={() => setChartType('scatter')}><img src="/icon/散点图.svg" alt="散点图" style={{ width: 18, height: 18 ,border:'none'}} /></Button>
          <Button size='small' onClick={() => setShowColorPicker(!showColorPicker)}><img src="/icon/调色盘.svg" alt="调色盘" style={{ width: 16, height: 16 ,border:'none'}} /></Button>
          <Button size='small' onClick={() => setDrawerVisible(true)}><img src="/icon/指标.svg" alt="指标" style={{ width: 16, height: 16 ,border:'none'}} /></Button>
        </div>
        <div style={{marginRight:'30px',display: 'flex', gap: '8px'  }}>
          <Button size='small' onClick={saveAsImage}><img src="/icon/下载.svg" alt="保存为图片" style={{ width: 16, height: 16 ,border:'none',}} /></Button>
          <Button size='small' onClick={copyImage}><img src="/icon/复制.svg" alt="复制" style={{ width: 16, height: 16 ,border:'none',}} /></Button>
        </div>
      </Space>
      {showColorPicker && (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <div style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }} onClick={() => setShowColorPicker(false)} />
          <SketchPicker color={lineColor} onChangeComplete={(color) => setLineColor(color.hex)} />
        </div>
      )}
            <Drawer
        title="选择指标"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Select
          value={selectedIndicator}
          onChange={(value) => {
            setSelectedIndicator(value);
            setDrawerVisible(false);
          }}
          style={{ width: '100%' }}
        >
          {indicators.map(indicator => (
            <Select.Option key={indicator} value={indicator}>
              {indicator}
            </Select.Option>
          ))}
        </Select>
      </Drawer>
      <div ref={chartRef} id="main" style={{ width: '100%', height: '90%' }}></div>
    </div>
  );
};

export default MyChart;