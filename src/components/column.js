import dayjs from 'dayjs';

const columns = [
  { title: '序号', dataIndex: '序号', key: '序号' },
  { title: '日期', dataIndex: '日期', key: '日期', sorter: (a, b) => dayjs(a.日期, 'YYYY-MM').unix() - dayjs(b.日期, 'YYYY-MM').unix(), defaultSortOrder: 'ascend' },
  { title: '上市公司总数', dataIndex: '上市公司总数', key: '上市公司总数' },
  { title: '上市证劵总数', dataIndex: '上市证劵总数', key: '上市证劵总数' },
  { title: '上市股票总数', dataIndex: '上市股票总数', key: '上市股票总数' },
  { title: '上市A股总数', dataIndex: '上市A股总数', key: '上市A股总数' },
  { title: '上市B股总数', dataIndex: '上市B股总数', key: '上市B股总数' },
  { title: '总股本（亿股）', dataIndex: '总股本（亿股）', key: '总股本（亿股）' },
  { title: '总市值（亿元）', dataIndex: '总市值（亿元）', key: '总市值（亿元）' },
  { title: '流通股本（亿股）', dataIndex: '流通股本（亿股）', key: '流通股本（亿股）' },
  { title: '流通市值（亿元）', dataIndex: '流通市值（亿元）', key: '流通市值（亿元）' },
  { title: '投资者开户总数（万户）', dataIndex: '投资者开户总数（万户）', key: '投资者开户总数（万户）' },
];

export default columns;