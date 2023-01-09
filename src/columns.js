const columns = [
  {
    title: '地区',
    dataIndex: 'district',
    width: '10%',
    // align: 'center',
  },
  {
    title: '最高温度（℃）',
    dataIndex: 'tMax',
    width: '10%',
    align: 'center',
  },
  {
    title: '最低温度（℃）',
    dataIndex: 'tMin',
    width: '10%',
    align: 'center',
  },
  {
    title: '天气情况',
    dataIndex: 'situation',
    width: '15%',
    align: 'center',
  },
  {
    title: '语音文本',
    dataIndex: 'voiceText',
    editable: true,
  },
]

export {
  columns
}