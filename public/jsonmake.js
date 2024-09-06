const fs = require('fs');

const generateData = (numRecords) => {
  const data = [];
  for (let i = 1; i <= numRecords; i++) {
    const record = {
      "序号": i,
      "日期": `2024-${String(i % 12 + 1).padStart(2, '0')}`,
      "上市公司总数": (Math.floor(Math.random() * 1000) + 4000).toString(),
      "上市证劵总数": (Math.floor(Math.random() * 30000) + 20000).toString(),
      "上市股票总数": (Math.floor(Math.random() * 1000) + 4000).toString(),
      "上市A股总数": (Math.floor(Math.random() * 1000) + 4000).toString(),
      "上市B股总数": (Math.floor(Math.random() * 1000) + 200).toString(),
      "总股本（亿股）": (Math.random() * 100000).toFixed(3).toString(),
      "总市值（亿元）": (Math.random() * 5000000).toFixed(3).toString(),
      "流通股本（亿股）": (Math.random() * 100000).toFixed(3).toString(),
      "流通市值（亿元）": (Math.random() * 1000000).toFixed(3).toString(),
      "投资者开户总数（万户）": (Math.floor(Math.random() * 10000)).toString()
    };
    data.push(record);
  }
  return data;
};

const data = generateData(200000);
fs.writeFileSync('bigdata.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('Data generated and saved to public/data.json');