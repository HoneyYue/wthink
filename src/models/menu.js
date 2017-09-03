const menu = [
  { id: '1', icon: 'home', name: '首页', route: '/dashboard' },
  { id: '2', icon: 'eye-o', name: '监控' },
  { id: '21', icon: 'environment', name: '位置监控', route: '/map', pid: 2 },
  { id: '22', icon: 'info-circle-o', name: '设备告警', route: '/alarm', pid: 2 },
  { id: '23', icon: 'info-circle-o', name: '在线统计', route: '/curdetail', pid: 2 },
  { id: '3', icon: 'database', name: '资产', route: '/dev' },
  { id: '31', icon: 'video-camera', name: '摄像头', route: '/camera', pid: 3 },
  { id: '32', icon: 'database', name: '监控机', route: '/dev', pid: 3 },
  { id: '4', icon: 'user', name: '安全', route: '/org' },
  { id: '41', icon: 'area-chart', name: '安全统计', route: '/stat', pid: 4 },
  { id: '5', icon: 'user', name: '运维', route: '/org' },
  { id: '51', icon: 'man', name: '分组', route: '/org', pid: 5 },
  { id: '52', icon: 'laptop', name: '版本', route: '/iso', pid: 5 },
  { id: '6', icon: 'pie-chart', name: '统计' },
  { id: '61', icon: 'area-chart', name: '告警统计', route: '/stat', pid: 6 },
  { id: '7', icon: 'setting', name: '系统' },
  { id: '71', icon: 'user', name: '用户', route: '/users', pid: 7 },
  { id: '72', icon: 'laptop', name: '字典', route: '/user', pid: 7 },
  { id: '73', icon: 'laptop', name: '设置', route: '/user', pid: 7 },
];

export default menu;
