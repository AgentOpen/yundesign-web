// ============ shell.js - 渲染顶部栏 + 左侧导航 + 页面壳 ============
(function (global) {
  'use strict';

  // ---------- 图标（Lucide 简版，1.7 描边，20x20） ----------
  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88L17.4 14.6 15.7 16.3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>',
    tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>',
    bar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4-4 14 14-4 4z"/><path d="M7 8l2 2"/><path d="M10 5l2 2"/><path d="M13 8l2 2"/><path d="M16 11l2 2"/></svg>',
    palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".7"/><circle cx="17.5" cy="10.5" r=".7"/><circle cx="8.5" cy="7.5" r=".7"/><circle cx="6.5" cy="12.5" r=".7"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1a1.6 1.6 0 0 1 1.6-1.6H16c3 0 5.5-2.5 5.5-5.5C22 6 17.5 2 12 2z"/></svg>',
    cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>',
    archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="18" x2="12" y2="18"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v3a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  // ---------- 全站菜单（M9/M10 重点实现，M1-M8 建设中） ----------
  // roles 缺省 = 全部角色可见；section/item 均可声明 roles 限制
  const NAV = [
    {
      title: '设计业务 · M1-M8（建设中）', roles: ['admin'], items: [
        { icon: 'ruler', label: 'M1 量尺与空间识别', href: '/biz/module.html?m=1', tag: '建设中', dimmed: true },
        { icon: 'palette', label: 'M2 全案方案设计', href: '/biz/module.html?m=2', tag: '建设中', dimmed: true },
        { icon: 'cube', label: 'M3 3D渲染与效果图', href: '/biz/module.html?m=3', tag: '建设中', dimmed: true },
        { icon: 'wrench', label: 'M4 品类深化设计', href: '/biz/module.html?m=4', tag: '建设中', dimmed: true },
        { icon: 'list', label: 'M5 三级 BOM 管理', href: '/biz/module.html?m=5', tag: '建设中', dimmed: true },
        { icon: 'receipt', label: 'M6 报价与合同', href: '/biz/module.html?m=6', tag: '建设中', dimmed: true },
        { icon: 'archive', label: 'M7 设计资产管理', href: '/biz/module.html?m=7', tag: '建设中', dimmed: true },
        { icon: 'package', label: 'M8 产品库集成', href: '/biz/module.html?m=8', tag: '建设中', dimmed: true }
      ]
    },
    {
      title: '工作台', items: [
        { icon: 'home', label: '我的待办', href: '/workbench/dashboard.html' },
        { icon: 'check', label: '我的任务', href: '/workbench/my-tasks.html', badge: 3 },
        { icon: 'coins', label: '我的分成', href: '/workbench/my-commission.html' },
        { icon: 'user', label: '个人中心', href: '/workbench/profile.html' }
      ]
    },
    {
      title: 'M9 · 项目管理台', items: [
        { icon: 'tv', label: '运营总览', href: '/projects/overview.html', roles: ['admin', 'deptlead'] },
        { icon: 'folder', label: '项目列表', href: '/projects/list.html' },
        { icon: 'git', label: '版本与溯源', href: '/projects/version.html' },
        { icon: 'file', label: '文件归档', href: '/projects/files.html' }
      ]
    },
    {
      title: 'M10 · 订单与分成', items: [
        { icon: 'inbox', label: '设计单池', href: '/ops/order-pool.html', roles: ['admin', 'deptlead'] },
        { icon: 'plus', label: '创建设计单', href: '/projects/create.html', roles: ['admin', 'deptlead'] },
        { icon: 'layout', label: '分单看板', href: '/ops/assign-board.html', roles: ['admin', 'deptlead'] },
        { icon: 'flag', label: '里程碑与进度', href: '/projects/milestone.html' },
        { icon: 'dollar', label: '定价管理', href: '/ops/pricing.html', roles: ['admin'] },
        { icon: 'layers', label: '分成规则', href: '/ops/commission-rules.html', roles: ['admin'] },
        { icon: 'calc', label: '核算与结算', href: '/ops/calc-queue.html', roles: ['admin'] },
        { icon: 'bar', label: '分成报表', href: '/ops/reports.html', roles: ['admin', 'deptlead'] }
      ]
    },
    {
      title: '系统管理', roles: ['admin'], items: [
        { icon: 'users', label: '用户与权限', href: '/system/users.html' },
        { icon: 'plug', label: '集成配置', href: '/system/integration.html', tag: '建设中', dimmed: true },
        { icon: 'shield', label: '审计日志', href: '/system/audit.html' }
      ]
    }
  ];

  function roleKey() { return (global.MOCK && MOCK.currentRole) ? MOCK.currentRole().key : 'admin'; }
  function roleAllows(roles) { return !roles || roles.indexOf(roleKey()) >= 0; }
  function visibleNav() {
    return NAV.map(sec => {
      if (!roleAllows(sec.roles)) return null;
      const items = sec.items.filter(it => roleAllows(it.roles));
      return items.length ? { title: sec.title, items } : null;
    }).filter(Boolean);
  }

  // ---------- M1-M8 模块信息（建设中页使用） ----------
  const MODULE_INFO = {
    '1': { code: 'M1', name: '量尺与空间识别', icon: 'ruler', domain: '02.01 客户需求与量尺', phase: 'MVP · 阶段一', features: ['客户预约与排程', '结构化需求访谈表单', '现场量尺数据录入（移动端）', '户型图自动绘制 / AI 识别', '空间约束记录与校验', '量尺数据云端同步 & 历史归档'] },
    '2': { code: 'M2', name: '全案方案设计', icon: 'palette', domain: '02.02 全案方案设计', phase: 'MVP · 阶段一', features: ['空间功能分区拖拽布局', '功能分区方案在线评审', '风格库选定与对比', 'AI 方案推荐（3 套备选）', '品类配置清单编制', '方案多版本管理 & 客户在线评审'] },
    '3': { code: 'M3', name: '3D 渲染与效果图', icon: 'cube', domain: '02.02.02 风格定位与效果图', phase: 'MVP · 阶段一', features: ['2D → 3D 一键转换', '3D 场景编辑（拖拽家具/品类）', '材质替换与实时预览', '灯光调节与高清渲染', '360° 全景图 / VR 漫游', '3D 模型库管理'] },
    '4': { code: 'M4', name: '品类深化设计', icon: 'wrench', domain: '03.01 品类深化设计', phase: 'MVP · 阶段一（定制柜优先）', features: ['定制柜 / 门窗 / 卫浴 / 软装深化', '五金配件选型与兼容校验', '柜体加工图自动输出', 'AI 品类规则引擎校验', '跨品类冲突检测', '总监审核 & 客户确认'] },
    '5': { code: 'M5', name: '三级 BOM 生成与管理', icon: 'list', domain: '03.02 BOM 生成与管理', phase: 'MVP · 阶段一', features: ['L1 / L2 / L3 BOM 自动生成', 'AI BOM 生成引擎（自动化率 ≥80%）', 'AI BOM 校验引擎', '物料编码统一映射（MDM）', '原材料用量自动计算', 'BOM 版本与变更管理'] },
    '6': { code: 'M6', name: '报价与合同', icon: 'receipt', domain: '03.03 报价与合同', phase: 'MVP · 阶段一（报价）', features: ['成本自动核算（材料+加工+物流）', '报价单自动生成', '智能报价引擎', '折扣审批 & 利润红线预警', '替代 SKU 推荐', '合同模板 / 审批 / 电子签章'] },
    '7': { code: 'M7', name: '设计资产管理', icon: 'archive', domain: '02.04 设计资产与标准管理', phase: 'MVP · 阶段一（模板/素材/五金）', features: ['设计标准库管理', '方案模板库（一键引用）', '优秀案例库', '设计素材库（贴图/模型）', '品类 BOM 模板库', '五金配件库'] },
    '8': { code: 'M8', name: '产品库集成', icon: 'package', domain: '04.03 商品库分层管理', phase: 'MVP · 阶段一', features: ['选品库实时同步（MDM）', '项目专属商品库', '报价库同步（基准/红线）', 'SKU 空间标签筛选', 'SKU 状态校验', '商品替代矩阵 / 新品通知'] }
  };

  // ---------- 计算相对根路径 ----------
  function getRootPath() {
    const path = decodeURIComponent(location.pathname).replace(/\\/g, '/');
    const m = path.match(/^(.*?)\/(workbench|projects|ops|biz|assets-lib|system)\//);
    if (m) return m[1] + '/';
    return path.substring(0, path.lastIndexOf('/') + 1);
  }

  function isCurrent(href) {
    const clean = href.replace(/^\//, '').split('?')[0];
    const cur = decodeURIComponent(location.pathname).replace(/\\/g, '/');
    if (!cur.endsWith(clean)) return false;
    // 带 query 的（M1-M8）需要匹配 ?m=
    if (href.includes('?m=')) {
      const want = href.split('?m=')[1];
      return getQuery('m') === want;
    }
    return true;
  }

  // ---------- 自动面包屑（依据菜单结构，修复各页错误面包屑）----------
  function buildBreadcrumb(root) {
    let match = null, sectionTitle = null;
    NAV.forEach(sec => sec.items.forEach(it => { if (isCurrent(it.href)) { match = it; sectionTitle = sec.title; } }));
    if (!match) return null;
    const home = `<a href="${root}workbench/dashboard.html">工作台</a>`;
    const sep = `<span class="sep">/</span>`;
    const secClean = (sectionTitle || '').replace(/（.*?）/g, '').trim();
    if (secClean === '工作台') return `${home}${sep}<span class="current">${match.label}</span>`;
    return `${home}${sep}<span>${secClean}</span>${sep}<span class="current">${match.label}</span>`;
  }

  // ---------- 渲染顶栏 ----------
  function renderHeader() {
    const r = MOCK.currentRole();
    const roleOpts = MOCK.ROLES.map(x => `
      <div class="role-opt${x.key === r.key ? ' active' : ''}" data-role="${x.key}">
        <div class="avatar sm" data-color="${colorFrom(x.name)}">${initials(x.name)}</div>
        <div style="flex:1;min-width:0;"><div class="ro-name">${x.name}</div><div class="ro-title">${x.title}</div></div>
        ${x.key === r.key ? '<span class="ro-check">✓</span>' : ''}
      </div>`).join('');
    return `
      <div class="brand">
        <button class="header-mobile-menu header-icon-btn" id="mobile-menu-btn">${ICONS.menu}</button>
        <div class="brand-logo">敬</div>
        <span class="brand-name">敬城设计云</span>
      </div>
      <div class="header-search" id="global-search">
        <span class="hs-icon">${ICONS.search}</span>
        <span class="hs-text">搜索项目 / 设计单 / 设计师 / 文件</span>
        <span class="kbd">Ctrl K</span>
      </div>
      <div class="header-actions">
        <button class="header-icon-btn" title="消息" id="hdr-msg">${ICONS.bell}<span class="dot"></span></button>
        <button class="header-icon-btn" title="帮助" id="hdr-help">${ICONS.help}</button>
        <div class="header-divider"></div>
        <div class="header-avatar" id="hdr-avatar">
          <div class="avatar" data-color="3">${initials(r.name)}</div>
          <div class="ha-info">
            <div class="ha-name">${r.name}</div>
            <div class="ha-role">${r.title}</div>
          </div>
          <span class="ha-caret">▾</span>
          <div class="role-dropdown" id="role-dropdown">
            <div class="rd-head">切换角色（演示权限范围）</div>
            ${roleOpts}
          </div>
        </div>
      </div>
    `;
  }

  // ---------- 渲染侧栏 ----------
  function renderSidebar(root) {
    let html = `
      <div class="sidebar-top">
        <div class="mini-logo">
          <div class="brand-logo">敬</div>
          <span class="brand-name">敬城设计云</span>
        </div>
        <button class="sidebar-collapse-btn" id="sidebar-collapse" title="折叠 / 展开">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
      <nav class="sidebar-nav">
    `;
    visibleNav().forEach(section => {
      html += `<div class="nav-section"><div class="nav-section-title">${section.title}</div>`;
      section.items.forEach(item => {
        const active = isCurrent(item.href);
        html += `<a href="${root}${item.href.replace(/^\//, '')}" class="nav-item${active ? ' active' : ''}${item.dimmed ? ' dimmed' : ''}" title="${item.dimmed ? item.label + '（建设中）' : item.label}">
          <span class="nav-icon">${ICONS[item.icon] || ICONS.folder}</span>
          <span class="nav-label">${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : (item.tag ? `<span class="nav-tag">${item.tag}</span>` : '')}
        </a>`;
      });
      html += `</div>`;
    });
    html += `</nav>
      <div class="sidebar-footer">
        <span class="sf-ver">敬城设计云 v1.3</span>
        <span class="sf-env" title="点击重置演示数据" style="cursor:pointer;" onclick="if(window.MOCK){MOCK.resetDemo();}location.reload();">DEMO ⟳</span>
      </div>`;
    return html;
  }

  // ---------- 渲染整体壳（关键：MOVE 节点而非 outerHTML，保留事件监听） ----------
  function renderShell() {
    if (document.getElementById('app')) return; // 防止重复
    const root = getRootPath();

    // 找到真实的 page 节点（不是字符串）
    let pageNode = document.querySelector('.page');
    if (!pageNode) {
      pageNode = document.createElement('div');
      pageNode.className = 'page';
      const nodes = Array.from(document.body.children).filter(n => !['SCRIPT', 'LINK', 'STYLE'].includes(n.tagName));
      nodes.forEach(n => pageNode.appendChild(n)); // appendChild 会移动节点
    }

    const wrap = document.createElement('div');
    wrap.className = 'app';
    wrap.id = 'app';

    const sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';
    sidebar.id = 'app-sidebar';
    sidebar.innerHTML = renderSidebar(root);

    const header = document.createElement('header');
    header.className = 'app-header';
    header.innerHTML = renderHeader();

    const main = document.createElement('main');
    main.className = 'app-main';
    main.id = 'app-main';

    wrap.appendChild(sidebar);
    wrap.appendChild(header);
    wrap.appendChild(main);

    // 关键：把真实的 page 节点移进 main（appendChild 移动 DOM 节点，事件监听全部保留）
    main.appendChild(pageNode);

    document.body.appendChild(wrap);

    // 自动修正面包屑（覆盖各页硬编码的错误面包屑）
    const bc = pageNode.querySelector('.page-breadcrumb');
    const bcHtml = buildBreadcrumb(root);
    if (bc && bcHtml) bc.innerHTML = bcHtml;

    bindShellEvents(wrap);
  }

  function bindShellEvents(wrap) {
    // 折叠
    const collapseBtn = document.getElementById('sidebar-collapse');
    if (collapseBtn) {
      if (localStorage.getItem('sidebar-collapsed') === '1') wrap.classList.add('sidebar-collapsed');
      collapseBtn.addEventListener('click', () => {
        wrap.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebar-collapsed', wrap.classList.contains('sidebar-collapsed') ? '1' : '0');
      });
    }
    // 移动端
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('app-sidebar').classList.toggle('mobile-open');
      });
      document.body.addEventListener('click', (e) => {
        const sb = document.getElementById('app-sidebar');
        if (window.innerWidth < 768 && sb.classList.contains('mobile-open') && !sb.contains(e.target) && e.target !== mobileBtn) {
          sb.classList.remove('mobile-open');
        }
      });
    }
    // 顶栏交互
    const search = document.getElementById('global-search');
    if (search) search.addEventListener('click', () => toast('全站搜索：演示环境暂未接入', 'info'));
    const msg = document.getElementById('hdr-msg');
    if (msg) msg.addEventListener('click', () => toast('您有 3 条新消息', 'info'));
    const help = document.getElementById('hdr-help');
    if (help) help.addEventListener('click', () => toast('帮助中心开发中', 'info'));
    // 角色切换下拉
    const avatar = document.getElementById('hdr-avatar');
    const dropdown = document.getElementById('role-dropdown');
    if (avatar && dropdown) {
      avatar.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('open'); });
      dropdown.querySelectorAll('.role-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = opt.getAttribute('data-role');
          if (key && MOCK.currentRole().key !== key) {
            MOCK.setRole(key);
            sessionStorage.removeItem('yd_nav_scroll');
            location.reload();
          }
        });
      });
      document.body.addEventListener('click', () => dropdown.classList.remove('open'));
    }
    // 快捷键
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toast('全站搜索：演示环境暂未接入', 'info');
      }
    });

    // 保持侧栏滚动位置：跳转后停留在当前菜单位置，而不是回到顶部
    const nav = wrap.querySelector('.sidebar-nav');
    if (nav) {
      const NAV_SCROLL_KEY = 'yd_nav_scroll';
      const saved = sessionStorage.getItem(NAV_SCROLL_KEY);
      if (saved !== null && !isNaN(parseInt(saved, 10))) {
        nav.scrollTop = parseInt(saved, 10);
      } else {
        const active = nav.querySelector('.nav-item.active');
        if (active && active.scrollIntoView) active.scrollIntoView({ block: 'center' });
      }
      // 点击菜单项时立即记录当前滚动位置（跳转前）
      nav.addEventListener('click', () => sessionStorage.setItem(NAV_SCROLL_KEY, String(nav.scrollTop)));
      let navTick = null;
      nav.addEventListener('scroll', () => {
        if (navTick) return;
        navTick = setTimeout(() => { sessionStorage.setItem(NAV_SCROLL_KEY, String(nav.scrollTop)); navTick = null; }, 120);
      });
    }
  }

  // ---------- 建设中页面（M1-M8 及部分系统页） ----------
  function renderUnderDev() {
    const container = document.querySelector('.page[data-under-dev]');
    if (!container) return;
    const root = getRootPath();
    const mParam = getQuery('m');
    const info = MODULE_INFO[mParam] || null;

    let title, code, domain, phase, features, iconKey;
    if (info) {
      title = info.name; code = info.code; domain = info.domain; phase = info.phase; features = info.features; iconKey = info.icon;
    } else {
      // 由 data-under-dev 属性提供
      const attr = container.getAttribute('data-under-dev');
      title = attr || '功能'; code = ''; domain = ''; phase = '规划中'; features = []; iconKey = 'settings';
    }
    document.title = title + ' · 敬城设计云';

    container.innerHTML = `
      <div class="page-header">
        <div class="page-breadcrumb">
          <a href="${root}workbench/dashboard.html">工作台</a>
          <span class="sep">/</span>
          <span class="current">${code ? code + ' · ' : ''}${title}</span>
        </div>
        <div class="page-title-bar">
          <div>
            <div class="page-title">${code ? code + ' · ' : ''}${title}</div>
            <div class="page-title-desc">${domain ? '对应流程域：' + domain : '平台规划功能'}</div>
          </div>
        </div>
      </div>
      <div class="page-body">
        <div class="dev-hero">
          <div class="dev-icon">${ICONS[iconKey] || ICONS.settings}</div>
          <div class="dev-badge">🚧 正在开发中</div>
          <h1 class="dev-title">${code ? code + ' · ' : ''}${title}</h1>
          <p class="dev-desc">该模块属于设计云平台整体规划的一部分，当前 Demo 阶段重点交付 <b>M9 项目管理台</b> 与 <b>M10 项目订单与分成管理</b>。本模块将于 <b>${phase}</b> 建设。</p>
          ${features.length ? `
          <div class="dev-features">
            <div class="dev-features-title">规划功能清单</div>
            <div class="dev-features-grid">
              ${features.map(f => `<div class="dev-feature"><span class="df-dot"></span>${f}</div>`).join('')}
            </div>
          </div>` : ''}
          <div class="dev-actions">
            <a href="${root}projects/overview.html" class="btn btn-primary">前往 M9 运营总览</a>
            <a href="${root}ops/order-pool.html" class="btn btn-default">前往 M10 设计单池</a>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- Bootstrap ----------
  function bootstrap() {
    renderShell();
    renderUnderDev();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  global.Shell = { render: renderShell, NAV, ICONS, MODULE_INFO };
})(window);
