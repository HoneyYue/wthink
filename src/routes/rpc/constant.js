
const RPC_TYPE = {
  UPCONFIG: 'UPCONFIG',
  UPGRADE: 'UPGRADE',
  GETPARAM: 'GETPARAM',
  GETINFO: 'GETINFO',
};
const RPC_TYPE_NAME = {
  UPCONFIG: '配置',
  UPGRADE: '升级',
  GETPARAM: '获取参数',
  GETINFO: '获取详情',
};

const RPC_PROGRESS = {
  WAIT: 'WAIT',
  OVER: 'OVER',
  CANCEL: 'CANCEL',
  REQ: 'REQ',
  ACK: 'ACK',
  COMPLETE: 'COMPLETE',
};

const RPC_PROGRESS_NAME = {
  WAIT: '等待',
  OVER: '覆盖',
  CANCEL: '取消',
  REQ: '发送请求',
  ACK: '等待响应',
  COMPLETE: '完成',
};


module.exports = {
  RPC_TYPE,
  RPC_TYPE_NAME,
  RPC_PROGRESS,
  RPC_PROGRESS_NAME,
};
