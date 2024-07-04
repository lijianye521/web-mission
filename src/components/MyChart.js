import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';
const MyChart = () => {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [metricData, setMetricData] = useState([]);

  useEffect(() => {
    axios.get('/data.json')
      .then(response => {
        setData(response.data);
        const months = response.data.map(item => item.日期);
        setMonths(months);
        updateMetricData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const updateMetricData = (data) => {
    const metricData = data.map(item => parseFloat(item['上市公司总数']));
    setMetricData(metricData);
    renderChart(months, metricData);
  };

  function renderChart(months, metricData) {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: 'ECharts 示例'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const data = params[0].data;
          return `日期: ${params[0].name}<br/>上市公司总数: ${data}`;
        }
      },
      xAxis: {
        type: 'category',
        data: months.reverse(),
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
          name: '上市公司总数',
          type: 'line',
          data: metricData.reverse()
        }
      ]
    };
    myChart.setOption(option);
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div id="main" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default MyChart;