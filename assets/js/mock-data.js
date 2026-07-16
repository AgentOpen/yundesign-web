// ============ mock-data.js - 全站共享模拟数据 ============
(function (global) {
  'use strict';

  // ===== 部门（5 个设计部门 + 管理中心）=====
  const DEPARTMENTS = ['平面设计一部', '平面设计二部', '海外设计部', '3D效果图部', '协调部'];
  const DEPT_SHORT = { '平面设计一部': '平面一', '平面设计二部': '平面二', '海外设计部': '海外', '3D效果图部': '效果图', '协调部': '协调', '设计管理中心': '管理' };

  // ===== 设计师（含归属部门 dept）=====
  const DESIGNERS = [
    { id: 'u001', name: '张三', role: '2D', dept: '海外设计部', level: 'L4', skills: ['别墅', '东南亚', '现代'], city: '曼谷', capacity: 85, activeProjects: 4, avgScore: 4.6, monthCommission: 42800, lastAssignAt: '2026-07-08' },
    { id: 'u002', name: '李四', role: '2D', dept: '平面设计一部', level: 'L3', skills: ['家装', '轻奢'], city: '上海', capacity: 55, activeProjects: 2, avgScore: 4.2, monthCommission: 28500, lastAssignAt: '2026-07-07' },
    { id: 'u003', name: '王五', role: '3D', dept: '3D效果图部', level: 'L5', skills: ['别墅', '新中式'], city: '北京', capacity: 20, activeProjects: 1, avgScore: 4.9, monthCommission: 62000, lastAssignAt: '2026-06-28' },
    { id: 'u004', name: '赵六', role: '协调员', dept: '协调部', level: 'L3', skills: ['东南亚', '英语'], city: '曼谷', capacity: 60, activeProjects: 3, avgScore: 4.5, monthCommission: 18600, lastAssignAt: '2026-07-09' },
    { id: 'u005', name: '钱七', role: '3D', dept: '3D效果图部', level: 'L4', skills: ['家装', '北欧'], city: '深圳', capacity: 78, activeProjects: 3, avgScore: 4.4, monthCommission: 38000, lastAssignAt: '2026-07-08' },
    { id: 'u006', name: '孙八', role: '2D', dept: '平面设计二部', level: 'L2', skills: ['工装'], city: '广州', capacity: 0, activeProjects: 0, avgScore: 3.9, monthCommission: 0, lastAssignAt: '2026-07-05', left: true, leftAt: '2026-07-14' },
    { id: 'u007', name: '周九', role: '3D', dept: '3D效果图部', level: 'L5', skills: ['别墅', '奢华'], city: '上海', capacity: 92, activeProjects: 5, avgScore: 4.8, monthCommission: 71000, lastAssignAt: '2026-07-09' },
    { id: 'u008', name: '吴十', role: '2D', dept: '平面设计一部', level: 'L4', skills: ['家装', '日式'], city: '杭州', capacity: 15, activeProjects: 1, avgScore: 4.7, monthCommission: 35500, lastAssignAt: '2026-06-30' },
    { id: 'u009', name: '郑一', role: '协调员', dept: '协调部', level: 'L4', skills: ['家装', '别墅'], city: '北京', capacity: 70, activeProjects: 4, avgScore: 4.6, monthCommission: 24000, lastAssignAt: '2026-07-09' },
    { id: 'u010', name: '陈二', role: '2D', dept: '平面设计二部', level: 'L3', skills: ['工装', '轻奢'], city: '成都', capacity: 100, activeProjects: 6, avgScore: 4.3, monthCommission: 32000, lastAssignAt: '2026-07-09' },
    { id: 'u011', name: '林霞', role: '3D', dept: '3D效果图部', level: 'L3', skills: ['家装'], city: '广州', capacity: 30, activeProjects: 1, avgScore: 4.1, monthCommission: 22000, lastAssignAt: '2026-07-01' },
    { id: 'u012', name: '徐东', role: '2D', dept: '平面设计二部', level: 'L5', skills: ['别墅', '新中式'], city: '苏州', capacity: 88, activeProjects: 4, avgScore: 4.8, monthCommission: 58000, lastAssignAt: '2026-07-09' },
    { id: 'u013', name: '黄山', role: '3D', dept: '3D效果图部', level: 'L4', skills: ['家装', '轻奢'], city: '上海', capacity: 65, activeProjects: 3, avgScore: 4.5, monthCommission: 41000, lastAssignAt: '2026-07-08' },
    { id: 'u014', name: '何美', role: '协调员', dept: '协调部', level: 'L2', skills: ['家装'], city: '南京', capacity: 45, activeProjects: 2, avgScore: 4.0, monthCommission: 12000, lastAssignAt: '2026-07-06' },
    { id: 'u018', name: 'Somchai', role: '2D', dept: '海外设计部', level: 'L3', skills: ['东南亚', '别墅', '英语'], city: '曼谷', capacity: 48, activeProjects: 2, avgScore: 4.3, monthCommission: 26000, lastAssignAt: '2026-07-06' },
    { id: 'u019', name: '林凡', role: '2D', dept: '海外设计部', level: 'L4', skills: ['海外', '现代', '英语'], city: '深圳', capacity: 35, activeProjects: 2, avgScore: 4.5, monthCommission: 33000, lastAssignAt: '2026-07-05' },
    { id: 'u020', name: '赵明', role: '3D', dept: '3D效果图部', level: 'L3', skills: ['海外', '奢华'], city: '上海', capacity: 52, activeProjects: 2, avgScore: 4.2, monthCommission: 29000, lastAssignAt: '2026-07-07' },
    { id: 'u021', name: 'Lily', role: '协调员', dept: '协调部', level: 'L3', skills: ['海外', '英语', '别墅'], city: '曼谷', capacity: 55, activeProjects: 3, avgScore: 4.4, monthCommission: 17000, lastAssignAt: '2026-07-08' },
    // 管理岗（不参与设计师筛选）
    { id: 'u015', name: '许光', role: 'PM', dept: '海外设计部', level: '-', skills: ['海外', '别墅'], city: '曼谷', capacity: 0, activeProjects: 8, avgScore: 0, monthCommission: 0, lastAssignAt: '' },
    { id: 'u016', name: '刘总监', role: '总监', dept: '设计管理中心', level: 'L6', skills: ['审核'], city: '上海', capacity: 0, activeProjects: 0, avgScore: 5.0, monthCommission: 0, lastAssignAt: '' },
    { id: 'u017', name: '王负责人', role: '设计负责人', dept: '设计管理中心', level: 'L6', skills: ['管理'], city: '上海', capacity: 0, activeProjects: 0, avgScore: 5.0, monthCommission: 0, lastAssignAt: '' }
  ];

  // ===== 客户（含海外英文客户）=====
  const CUSTOMERS = [
    { id: 'c001', name: '张先生', phone: '138****2378', level: 'VIP', address: '泰国·曼谷·素坤逸' },
    { id: 'c002', name: '李女士', phone: '139****4523', level: '普通', address: '上海·浦东·世纪大道' },
    { id: 'c003', name: 'Mr. Kumar', phone: '+66-****-5511', level: 'VIP', address: '泰国·曼谷·帕蓬' },
    { id: 'c004', name: '陈总', phone: '186****7723', level: 'VIP', address: '北京·朝阳·三里屯' },
    { id: 'c005', name: '刘小姐', phone: '135****9908', level: '普通', address: '深圳·南山·后海' },
    { id: 'c006', name: 'Ms. Anna', phone: '+1-****-2298', level: 'VIP', address: '美国·洛杉矶' },
    { id: 'c007', name: '赵先生', phone: '158****4471', level: '普通', address: '苏州·工业园区' },
    { id: 'c008', name: 'Mr. Tanaka', phone: '+81-****-6620', level: 'VIP', address: '日本·东京·港区' },
    { id: 'c009', name: 'Ms. Sophia', phone: '+44-****-1180', level: 'VIP', address: '英国·伦敦·肯辛顿' },
    { id: 'c010', name: 'Mr. Reddy', phone: '+91-****-7745', level: 'VIP', address: '印度·孟买' },
    { id: 'c011', name: '华润业主 B12', phone: '150****3320', level: '普通', address: '中国·苏州·工业园区' },
    { id: 'c012', name: '雍华府业主', phone: '138****9975', level: 'VIP', address: '中国·苏州·金鸡湖' },
    { id: 'c013', name: 'Mr. Wong', phone: '+66-****-6621', level: 'VIP', address: '泰国·曼谷·沙吞' },
    { id: 'c014', name: '严女士', phone: '139****2244', level: '普通', address: '中国·苏州·吴中' }
  ];

  // 项目状态：由阶段推导 —— 进行中 / 已交付 / 已完成
  function statusFromStage(stage, progress) {
    if (stage === '项目完结') return '已完成';
    if (stage === '全屋3D' && progress >= 80) return '已交付';
    return '进行中';
  }

  // ===== 项目 =====
  // d2d: 平面设计师 id 数组; d3d: 3D 设计师 id 数组; coord: 协调员 id; source: 来源
  const PROJECTS = [
    { id: 'p001', code: 'P-20260620-001', name: '张宅全案 · 别墅', type: '别墅', customer: 'c001', region: '泰国·曼谷', area: 320, budget: 180, scope: ['全案', '定制柜'], urgency: '加急', source: 'CRM', stage: '3D意向', progress: 55, risk: 'warning', d2d: ['u001'], d3d: ['u003'], coord: 'u004', leadPm: 'u015', deadline: '2026-08-15', createdAt: '2026-06-20', changesCount: 12, deliverables: 6 },
    { id: 'p002', code: 'P-20260625-002', name: '李宅家装', type: '家装', customer: 'c002', region: '中国·上海', area: 128, budget: 60, scope: ['全案'], urgency: '正常', source: 'CRM', stage: '平面确认', progress: 35, risk: 'ok', d2d: ['u002'], d3d: [], coord: 'u009', leadPm: 'u015', deadline: '2026-08-30', createdAt: '2026-06-25', changesCount: 5, deliverables: 3 },
    { id: 'p003', code: 'P-20260628-003', name: 'Kumar 别墅', type: '别墅', customer: 'c003', region: '泰国·曼谷', area: 480, budget: 350, scope: ['全案', '定制柜', '门窗'], urgency: '紧急', source: '手动创建', stage: '3D意向', progress: 68, risk: 'danger', d2d: ['u001', 'u012'], d3d: ['u003'], coord: 'u004', leadPm: 'u015', deadline: '2026-07-25', createdAt: '2026-06-28', changesCount: 18, deliverables: 8 },
    { id: 'p004', code: 'P-20260701-004', name: '陈总办公楼', type: '工装', customer: 'c004', region: '中国·北京', area: 1200, budget: 220, scope: ['全案', '软装'], urgency: '正常', source: 'OMS', stage: '需求收集', progress: 15, risk: 'ok', d2d: ['u010'], d3d: [], coord: 'u009', leadPm: 'u015', deadline: '2026-09-30', createdAt: '2026-07-01', changesCount: 2, deliverables: 1 },
    { id: 'p005', code: 'P-20260703-005', name: '刘宅家装', type: '家装', customer: 'c005', region: '中国·深圳', area: 96, budget: 45, scope: ['全案', '软装'], urgency: '正常', source: 'CRM', stage: '全屋3D', progress: 82, risk: 'ok', d2d: ['u002'], d3d: ['u005'], coord: 'u009', leadPm: 'u015', deadline: '2026-08-10', createdAt: '2026-07-03', changesCount: 6, deliverables: 5 },
    { id: 'p006', code: 'P-20260705-006', name: 'Anna Villa', type: '别墅', customer: 'c006', region: '美国·洛杉矶', area: 550, budget: 480, scope: ['全案', '定制柜', '卫浴'], urgency: '加急', source: '手动创建', stage: '平面确认', progress: 40, risk: 'warning', d2d: ['u019'], d3d: ['u007'], coord: 'u021', leadPm: 'u015', deadline: '2026-09-15', createdAt: '2026-07-05', changesCount: 8, deliverables: 4 },
    { id: 'p007', code: 'P-20260707-007', name: '赵宅家装', type: '家装', customer: 'c007', region: '中国·苏州', area: 108, budget: 55, scope: ['全案'], urgency: '正常', source: 'CRM', stage: '3D意向', progress: 60, risk: 'ok', d2d: ['u008'], d3d: ['u013'], coord: 'u009', leadPm: 'u015', deadline: '2026-08-20', createdAt: '2026-07-07', changesCount: 4, deliverables: 3 },
    { id: 'p008', code: 'P-20260620-008', name: '万科示范样板房', type: '工装', customer: 'c004', region: '中国·北京', area: 220, budget: 90, scope: ['全案', '软装'], urgency: '正常', source: 'OMS', stage: '项目完结', progress: 100, risk: 'ok', d2d: ['u002'], d3d: ['u005'], coord: null, leadPm: 'u015', deadline: '2026-07-10', createdAt: '2026-06-20', changesCount: 3, deliverables: 10 },
    { id: 'p009', code: 'P-20260702-009', name: 'Tanaka Residence', type: '别墅', customer: 'c008', region: '日本·东京', area: 260, budget: 210, scope: ['全案', '定制柜'], urgency: '加急', source: '手动创建', stage: '全屋3D', progress: 88, risk: 'ok', d2d: ['u018'], d3d: ['u020'], coord: 'u021', leadPm: 'u015', deadline: '2026-08-05', createdAt: '2026-07-02', changesCount: 9, deliverables: 7 },
    { id: 'p010', code: 'P-20260708-010', name: 'Sophia Flat', type: '家装', customer: 'c009', region: '英国·伦敦', area: 145, budget: 120, scope: ['全案', '软装'], urgency: '正常', source: 'CRM', stage: '需求收集', progress: 10, risk: 'ok', d2d: ['u019'], d3d: [], coord: 'u021', leadPm: 'u015', deadline: '2026-09-25', createdAt: '2026-07-08', changesCount: 1, deliverables: 0 },
    // 平面设计二部项目（部门负责人 徐东 全流程演示）
    { id: 'p011', code: 'P-20260712-011', name: '华润·悦府大平层', type: '家装', customer: 'c011', region: '中国·苏州', area: 210, budget: 90, scope: ['全案', '定制柜'], urgency: '正常', source: 'CRM', stage: '平面确认', progress: 45, risk: 'ok', d2d: ['u010'], d3d: ['u013'], coord: 'u009', leadPm: 'u015', deadline: '2026-08-28', createdAt: '2026-07-12', changesCount: 3, deliverables: 2 },
    { id: 'p012', code: 'P-20260620-012', name: '招商·雍华府', type: '别墅', customer: 'c012', region: '中国·苏州', area: 320, budget: 160, scope: ['全案', '定制柜', '门窗'], urgency: '加急', source: '手动创建', stage: '3D意向', progress: 55, risk: 'warning', d2d: ['u010'], d3d: ['u020'], coord: 'u021', leadPm: 'u015', deadline: '2026-08-10', createdAt: '2026-06-20', changesCount: 9, deliverables: 5 },
    // 已完结项目（用于"已结算分成"演示）
    { id: 'p013', code: 'P-20260525-013', name: 'The Reserve 61 公寓', type: '家装', customer: 'c013', region: '泰国·曼谷', area: 180, budget: 120, scope: ['全案', '软装'], urgency: '正常', source: 'CRM', stage: '项目完结', progress: 100, risk: 'ok', d2d: ['u001'], d3d: ['u020'], coord: 'u021', leadPm: 'u015', deadline: '2026-06-30', createdAt: '2026-05-25', changesCount: 4, deliverables: 9 },
    { id: 'p014', code: 'P-20260528-014', name: '苏州·桃花源合院', type: '别墅', customer: 'c014', region: '中国·苏州', area: 260, budget: 130, scope: ['全案', '定制柜'], urgency: '加急', source: 'CRM', stage: '项目完结', progress: 100, risk: 'ok', d2d: ['u012'], d3d: ['u013'], coord: 'u009', leadPm: 'u015', deadline: '2026-06-25', createdAt: '2026-05-28', changesCount: 6, deliverables: 8 }
  ];
  // 项目 → 源设计单 关联（用于溯源）
  const ORDER_LINK = { p001: 'D-20260707-001', p003: 'D-20260705-001' };
  // 设计费总额（元）——退款上限、分成基数
  const DESIGN_FEE = { p001: 96000, p002: 42000, p003: 150000, p004: 180000, p005: 28000, p006: 165000, p007: 36000, p008: 45000, p009: 78000, p010: 60000, p011: 84000, p012: 128000, p013: 60000, p014: 104000 };
  PROJECTS.forEach(p => {
    p.status = statusFromStage(p.stage, p.progress);
    // 兼容旧字段：team = 平面 + 3D + 协调员
    p.team = [...(p.d2d || []), ...(p.d3d || []), p.coord].filter(Boolean);
    // 关联设计单号 + 期望工期（天），贯穿全链路
    p.orderCode = ORDER_LINK[p.id] || p.code.replace(/^P-/, 'D-');
    p.duration = Math.max(1, Math.round((new Date(p.deadline) - new Date(p.createdAt)) / 86400000));
    // 设计费总额 + 退款/状态覆盖（客户退款场景）
    p.designFee = DESIGN_FEE[p.id] || Math.round((p.area || 100) * 300);
    if (p.refund === undefined) p.refund = null;            // { amount, reason, at, by }
    if (p.statusOverride === undefined) p.statusOverride = null; // 手动状态覆盖，如"客户退款"
  });

  // ===== 设计单（订单池）=====
  // 设计单主数据：创建时录入的全量业务字段，贯穿"单池→分单→立项"全链路只增不减
  const DESIGN_ORDERS = [
    { id: 'o001', code: 'D-20260709-001', projectName: '梅斯 · 双层复式', type: '家装', scope: ['全案', '定制柜'], urgency: '加急', customer: '梅先生', custLevel: '普通', contact: '138****2210', area: 165, budget: '80-100', region: '泰国·清迈', source: '手动创建', status: '待分派', createdAt: '2026-07-09 14:20', deadline: '2026-08-20', duration: 42, needCoord: true, pm: 'u015', remark: '现代简约，喜欢原木色调；主卧要大衣帽间。参考小红书收藏夹。', attachments: [{ name: '梅斯户型图.dwg', type: 'dwg' }, { name: '客户参考图集.zip', type: 'zip' }] },
    { id: 'o002', code: 'D-20260709-002', projectName: 'Sunny Villa', type: '别墅', scope: ['全案'], urgency: '正常', customer: 'Sunny Family', custLevel: 'VIP', contact: '+84-****-3391', area: 380, budget: '260-320', region: '越南·胡志明市', source: 'CRM', status: '待分派', createdAt: '2026-07-09 11:30', deadline: '2026-09-30', duration: 75, needCoord: true, pm: 'u015', remark: '热带度假风，注重室内外通透与采光。', attachments: [{ name: 'SunnyVilla原始建筑图.pdf', type: 'pdf' }] },
    { id: 'o003', code: 'D-20260710-001', projectName: '龙湖春江天玺', type: '家装', scope: ['全案', '软装'], urgency: '正常', customer: '龙湖客户 A17', custLevel: '普通', contact: '150****7788', area: 138, budget: '50-70', region: '中国·上海', source: 'OMS', status: '待分派', createdAt: '2026-07-10 09:15', deadline: '2026-09-10', duration: 55, needCoord: true, pm: 'u015', remark: '三口之家，需儿童房 + 老人房，轻奢风格。', attachments: [{ name: '标准户型.dwg', type: 'dwg' }] },
    { id: 'o004', code: 'D-20260710-002', projectName: '中东豪宅设计', type: '别墅', scope: ['全案', '定制柜', '门窗'], urgency: '紧急', customer: 'Sheikh Ahmed', custLevel: 'VIP', contact: '+966-****-1120', area: 890, budget: '600-800', region: '沙特·利雅得', source: '手动创建', status: '待分派', createdAt: '2026-07-10 10:45', deadline: '2026-08-05', duration: 26, needCoord: true, pm: 'u015', remark: '奢华宫廷风，大量大理石与金属；女宾/男宾区分隔要求。', attachments: [{ name: '别墅建筑图.pdf', type: 'pdf' }, { name: '业主参考案例.zip', type: 'zip' }, { name: '面积清单.xls', type: 'xls' }] },
    { id: 'o005', code: 'D-20260710-003', projectName: '朗诗尚东三期 B座', type: '工装', scope: ['软装'], urgency: '正常', customer: '朗诗物业', custLevel: '普通', contact: '025-****-6600', area: 320, budget: '15-25', region: '中国·南京', source: 'CRM', status: '待分派', createdAt: '2026-07-10 13:00', deadline: '2026-08-25', duration: 40, needCoord: false, pm: 'u015', remark: '售楼处样板间软装陈设，交付快、成本可控。', attachments: [{ name: '样板间平面.pdf', type: 'pdf' }] },
    { id: 'o006', code: 'D-20260711-001', projectName: 'Mumbai Kingfisher 别墅', type: '别墅', scope: ['全案'], urgency: '加急', customer: 'Mr. Reddy', custLevel: 'VIP', contact: '+91-****-7745', area: 420, budget: '300-380', region: '印度·孟买', source: '手动创建', status: '待分派', createdAt: '2026-07-11 09:00', deadline: '2026-08-30', duration: 50, needCoord: true, pm: 'u015', remark: '印式融合现代，重视家庭祈祷室与客厅仪式感。', attachments: [{ name: 'Kingfisher户型.dwg', type: 'dwg' }] },
    // 已分派
    { id: 'o007', code: 'D-20260707-001', projectName: '张宅全案', type: '别墅', scope: ['全案', '定制柜', '门窗'], urgency: '加急', customer: '张先生', custLevel: 'VIP', contact: '139****4471', area: 320, budget: '160-200', region: '泰国·曼谷', source: 'CRM', status: '已分派', createdAt: '2026-07-07 15:20', deadline: '2026-08-15', duration: 39, needCoord: true, assignedTeam: ['u001', 'u003', 'u004'], projectId: 'p001', pm: 'u015', remark: '新中式，主卧衣帽间要大；书房需独立。', attachments: [{ name: '张宅户型图.dwg', type: 'dwg' }, { name: '需求文档.pdf', type: 'pdf' }] },
    { id: 'o008', code: 'D-20260705-001', projectName: 'Kumar 别墅', type: '别墅', scope: ['全案'], urgency: '紧急', customer: 'Mr. Kumar', custLevel: 'VIP', contact: '+66-****-8890', area: 480, budget: '350-400', region: '泰国·曼谷', source: '手动创建', status: '已分派', createdAt: '2026-07-05 10:40', deadline: '2026-07-25', duration: 20, needCoord: true, assignedTeam: ['u001', 'u012', 'u003', 'u004'], projectId: 'p003', pm: 'u015', remark: '现代轻奢，1-3 个空间先出意向确认风格。', attachments: [{ name: 'Kumar别墅图纸.pdf', type: 'pdf' }] }
  ];

  // ===== 待办 =====
  const TODOS = [
    { id: 't001', title: 'Kumar 别墅 3D 意向图待客户确认', project: 'p003', type: '客户确认', priority: 'high', assignee: 'u004', due: '今天 18:00' },
    { id: 't002', title: '梅斯双层复式 待分派设计师', project: null, type: '分单', priority: 'high', assignee: 'u017', due: '今天' },
    { id: 't003', title: '刘宅家装 全屋3D 待评审', project: 'p005', type: '评审', priority: 'medium', assignee: 'u016', due: '明天' },
    { id: 't004', title: '陈总办公楼 需求文档待完善', project: 'p004', type: '需求收集', priority: 'medium', assignee: 'u009', due: '2 天后' },
    { id: 't005', title: '张宅平面 V3.2 待评分', project: 'p001', type: '质量评价', priority: 'low', assignee: 'u016', due: '本周' }
  ];

  // ===== 我的任务（接单/拒接/进行中/完成）=====
  // designer: 任务归属设计师 id —— 用于「我的任务」按当前登录人过滤
  const MY_TASKS = [
    // 待接单
    { id: 'tk001', designer: 'u012', order: 'D-20260710-002', project: '中东豪宅设计', customer: 'Sheikh Ahmed', area: 890, region: '沙特·利雅得', dept: '平面设计二部', role: '平面 2D', task: '指定面积', taskArea: 360, responsibleSpaces: ['客厅', '主卧', '书房'], deadline: '2026-08-01', estimatedHours: 48, assigner: '王负责人', assignedAt: '2 小时前', urgency: '紧急', status: 'pending' },
    { id: 'tk002', designer: 'u001', order: 'D-20260709-002', project: 'Sunny Villa', customer: 'Sunny Family', area: 380, region: '越南·胡志明市', dept: '海外设计部', role: '平面 2D', task: '指定面积', taskArea: 200, responsibleSpaces: ['客厅', '餐厅'], deadline: '2026-08-15', estimatedHours: 24, assigner: '王负责人', assignedAt: '5 小时前', urgency: '正常', status: 'pending' },
    { id: 'tk003', designer: 'u018', order: 'D-20260711-001', project: 'Mumbai Kingfisher 别墅', customer: 'Mr. Reddy', area: 420, region: '印度·孟买', dept: '海外设计部', role: '平面 2D', task: '全案', taskArea: 420, responsibleSpaces: ['全部空间'], deadline: '2026-08-20', estimatedHours: 40, assigner: '王负责人', assignedAt: '1 天前', urgency: '加急', status: 'pending' },
    // 进行中
    { id: 'tk004', designer: 'u001', order: 'D-20260707-001', project: '张宅全案 · 别墅', customer: '张先生', area: 320, region: '泰国·曼谷', dept: '海外设计部', role: '平面 2D', task: '全案', taskArea: 320, responsibleSpaces: ['全部空间'], deadline: '2026-08-15', estimatedHours: 40, assigner: '王负责人', assignedAt: '3 天前', urgency: '加急', status: 'accepted', progress: 60, version: 'V3.2', nextMilestone: '3D 意向客户确认' },
    { id: 'tk005', designer: 'u001', order: 'D-20260628-003', project: 'Kumar 别墅', customer: 'Mr. Kumar', area: 480, region: '泰国·曼谷', dept: '海外设计部', role: '平面 2D', task: '指定面积', taskArea: 260, responsibleSpaces: ['一层公共区', '主卧套房'], deadline: '2026-07-25', estimatedHours: 56, assigner: '王负责人', assignedAt: '6 天前', urgency: '紧急', status: 'accepted', progress: 75, version: 'V2.1', nextMilestone: '全屋 3D' },
    { id: 'tk006', designer: 'u018', order: 'D-20260702-009', project: 'Tanaka Residence', customer: 'Mr. Tanaka', area: 260, region: '日本·东京', dept: '海外设计部', role: '平面 2D', task: '全案', taskArea: 260, responsibleSpaces: ['全部空间'], deadline: '2026-08-05', estimatedHours: 36, assigner: '王负责人', assignedAt: '8 天前', urgency: '加急', status: 'accepted', progress: 90, version: 'V4.0', nextMilestone: '最终客户确认' },
    { id: 'tk007', designer: 'u002', order: 'D-20260703-005', project: '刘宅家装', customer: '刘小姐', area: 96, region: '中国·深圳', dept: '平面设计一部', role: '平面 2D', task: '全案', taskArea: 96, responsibleSpaces: ['全部空间'], deadline: '2026-08-10', estimatedHours: 20, assigner: '王负责人', assignedAt: '9 天前', urgency: '正常', status: 'accepted', progress: 82, version: 'V3.0', nextMilestone: '全屋 3D 交付' },
    // 已拒接
    { id: 'tk008', designer: 'u010', order: 'D-20260710-003', project: '朗诗尚东三期 B座', customer: '朗诗物业', area: 320, region: '中国·南京', dept: '平面设计二部', role: '软装 2D', task: '指定面积', taskArea: 320, responsibleSpaces: ['样板间'], deadline: '2026-08-12', estimatedHours: 30, assigner: '王负责人', assignedAt: '2 天前', urgency: '正常', status: 'rejected', rejectReason: '档期冲突（已有多个高优项目）', rejectedAt: '1 天前' },
    // 已完成
    { id: 'tk009', designer: 'u002', order: 'D-20260620-008', project: '万科示范样板房', customer: '陈总', area: 220, region: '中国·北京', dept: '平面设计一部', role: '平面 2D', task: '全案', taskArea: 220, responsibleSpaces: ['全部空间'], deadline: '2026-07-10', estimatedHours: 32, assigner: '王负责人', assignedAt: '20 天前', urgency: '正常', status: 'done', doneAt: '2026-07-10', score: 4.6 },
    { id: 'tk010', designer: 'u002', order: 'D-20260601-011', project: '绿城·桂语兰庭', customer: '孙女士', area: 140, region: '中国·杭州', dept: '平面设计一部', role: '平面 2D', task: '全案', taskArea: 140, responsibleSpaces: ['全部空间'], deadline: '2026-06-28', estimatedHours: 26, assigner: '王负责人', assignedAt: '35 天前', urgency: '正常', status: 'done', doneAt: '2026-06-27', score: 4.8 },
    // 张三（设计师角色）补全：已拒接 + 已完成
    { id: 'tk011', designer: 'u001', order: 'D-20260706-004', project: '首创天阅西山', customer: '周先生', area: 145, region: '中国·北京', dept: '海外设计部', role: '平面 2D', task: '全案', taskArea: 145, responsibleSpaces: ['全部空间'], deadline: '2026-08-18', estimatedHours: 28, assigner: '王负责人', assignedAt: '3 天前', urgency: '正常', status: 'rejected', rejectReason: '与在途别墅项目档期冲突，建议改派', rejectedAt: '2 天前' },
    { id: 'tk012', designer: 'u001', order: 'D-20260525-002', project: 'The Reserve 61 公寓', customer: 'Mr. Wong', area: 180, region: '泰国·曼谷', dept: '海外设计部', role: '平面 2D', task: '全案', taskArea: 180, responsibleSpaces: ['全部空间'], deadline: '2026-06-30', estimatedHours: 34, assigner: '王负责人', assignedAt: '50 天前', urgency: '正常', status: 'done', doneAt: '2026-06-28', score: 4.7 },
    // 徐东（部门负责人·平面二部）本人任务全状态
    { id: 'tk013', designer: 'u012', order: 'D-20260705-001', project: 'Kumar 别墅', customer: 'Mr. Kumar', area: 480, region: '泰国·曼谷', dept: '平面设计二部', role: '平面 2D', task: '指定面积', taskArea: 220, responsibleSpaces: ['二层卧室区', '影音室'], deadline: '2026-07-25', estimatedHours: 44, assigner: '王负责人', assignedAt: '6 天前', urgency: '紧急', status: 'accepted', progress: 70, version: 'V2.0', nextMilestone: '全屋 3D' },
    { id: 'tk014', designer: 'u010', order: 'D-20260712-001', project: '华润·悦府大平层', customer: '华润业主 B12', area: 210, region: '中国·苏州', dept: '平面设计二部', role: '平面 2D', task: '全案', taskArea: 210, responsibleSpaces: ['全部空间'], deadline: '2026-08-28', estimatedHours: 30, assigner: '徐东', assignedAt: '2 天前', urgency: '正常', status: 'accepted', progress: 40, version: 'V1.2', nextMilestone: '平面客户确认' },
    { id: 'tk015', designer: 'u012', order: 'D-20260528-006', project: '苏州·桃花源合院', customer: '严女士', area: 260, region: '中国·苏州', dept: '平面设计二部', role: '平面 2D', task: '全案', taskArea: 260, responsibleSpaces: ['全部空间'], deadline: '2026-06-25', estimatedHours: 42, assigner: '王负责人', assignedAt: '48 天前', urgency: '加急', status: 'done', doneAt: '2026-06-24', score: 4.9 }
  ];
  // 为待接单任务补齐"需求包"字段（类型/范围/设计方向/附件/客户等级/团队），优先取自源设计单
  MY_TASKS.forEach(tk => {
    const src = DESIGN_ORDERS.find(o => o.code === tk.order);
    if (tk.type === undefined) tk.type = src ? src.type : '家装';
    if (tk.scope === undefined) tk.scope = src ? src.scope.slice() : ['全案'];
    if (tk.custLevel === undefined) tk.custLevel = src ? src.custLevel : '普通';
    if (tk.remark === undefined) tk.remark = src ? src.remark : '客户需求以需求文档为准，注重实用性与整体风格统一。';
    if (tk.attachments === undefined) tk.attachments = src ? src.attachments.slice() : [{ name: '户型图.dwg', type: 'dwg' }, { name: '需求说明.pdf', type: 'pdf' }];
    if (tk.pm === undefined) tk.pm = '许光';
    if (tk.coordName === undefined) tk.coordName = (src && src.needCoord === false) ? 'PM 自行对接' : '赵六';
    if (tk.teammates2D === undefined) tk.teammates2D = tk.role.indexOf('3D') >= 0 ? ['张三'] : [];
    if (tk.teammates3D === undefined) tk.teammates3D = tk.role.indexOf('平面') >= 0 ? ['王五'] : [];
  });

  // ===== 协调员待办（需求收集/整理 + 各阶段客户确认 + 交付跟进）=====
  // coord: 归属协调员 id；status: pending / done
  const COORD_TASKS = [
    { id: 'ct001', coord: 'u004', project: 'p001', title: '张宅全案 · 平面方案客户确认', type: '客户确认', stage: '平面确认', priority: 'high', due: '今天', status: 'pending' },
    { id: 'ct002', coord: 'u004', project: 'p003', title: 'Kumar 别墅 · 3D 意向客户确认', type: '客户确认', stage: '3D意向', priority: 'high', due: '明天', status: 'pending' },
    { id: 'ct003', coord: 'u004', project: 'p001', title: '张宅全案 · 整理客户新增修改需求（3 项）', type: '需求整理', stage: '', priority: 'medium', due: '本周', status: 'pending' },
    { id: 'ct004', coord: 'u004', project: 'p003', title: 'Kumar 别墅 · 收集客户软装偏好与参考图', type: '需求收集', stage: '', priority: 'low', due: '本周', status: 'pending' },
    { id: 'ct005', coord: 'u004', project: 'p001', title: '张宅全案 · V2 平面客户反馈已回收', type: '客户确认', stage: '', priority: 'medium', due: '2 天前', status: 'done', doneAt: '2026-07-11' },
    // 其他协调员（供切换/部门视图演示）
    { id: 'ct006', coord: 'u009', project: 'p004', title: '陈总办公楼 · 需求文档待完善', type: '需求整理', stage: '需求收集', priority: 'medium', due: '明天', status: 'pending' },
    { id: 'ct007', coord: 'u021', project: 'p012', title: '招商·雍华府 · 全屋 3D 客户确认', type: '客户确认', stage: '全屋3D', priority: 'high', due: '今天', status: 'pending' }
  ];
  // 当前协调员的待办
  function myCoordTasks(status) {
    const r = currentRole();
    return COORD_TASKS.filter(t => (r.scope === 'all' || t.coord === r.selfId) && (!status || t.status === status));
  }

  // ===== 版本流 =====
  const VERSIONS = [
    { id: 'v001', project: 'p001', deliverable: '平面布局', major: 3, minor: 2, designer: 'u001', ts: '2026-07-11 14:20', duration: '3h', changes: [{ space: '主卧', points: ['衣柜向左移 30cm', '增加飘窗吊柜'] }, { space: '书房', points: ['新增书桌 2 处'] }], feedback: '客户希望主卧衣柜位置向左移 30cm；书房增加书桌' },
    { id: 'v002', project: 'p001', deliverable: '平面布局', major: 3, minor: 1, designer: 'u001', ts: '2026-07-10 18:45', duration: '2h', changes: [{ space: '客厅', points: ['沙发朝向调整'] }], feedback: '' },
    { id: 'v003', project: 'p001', deliverable: '平面布局', major: 3, minor: 0, designer: 'u009', ts: '2026-07-10 10:00', duration: '-', changes: [], feedback: '协调员整理 V2 客户反馈' },
    { id: 'v004', project: 'p001', deliverable: '平面布局', major: 2, minor: 0, designer: 'u001', ts: '2026-07-08 16:30', duration: '4h', changes: [{ space: '整体', points: ['户型分区重新调整'] }], feedback: '客户对 V1 布局不满意' },
    { id: 'v005', project: 'p001', deliverable: '平面布局', major: 1, minor: 0, designer: 'u001', ts: '2026-07-06 09:00', duration: '6h', changes: [], feedback: '首版方案' },
    { id: 'v006', project: 'p001', deliverable: '3D意向', major: 1, minor: 0, designer: 'u003', ts: '2026-07-09 15:00', duration: '5h', changes: [{ space: '客厅+主卧', points: ['出 3 个空间意向 720°'] }], feedback: '' }
  ];

  // ===== 分成核算 =====
  const COMMISSIONS = [
    { id: 'cm001', project: 'p008', projectName: '万科示范样板房', designer: 'u002', designerName: '李四', role: '平面 2D', designFee: 45000, dueRate: 0.4, dueAmount: 18000, qualityFactor: 1.1, timelinessFactor: 1.0, satisfactionFactor: 1.05, paymentFactor: 1.0, actualAmount: 20790, status: '待审批', calcAt: '2026-07-11 10:20' },
    { id: 'cm002', project: 'p008', projectName: '万科示范样板房', designer: 'u005', designerName: '钱七', role: '3D', designFee: 45000, dueRate: 0.3, dueAmount: 13500, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.05, paymentFactor: 1.0, actualAmount: 14175, status: '待审批', calcAt: '2026-07-11 10:20' },
    { id: 'cm003', project: 'p005', projectName: '刘宅家装', designer: 'u002', designerName: '李四', role: '平面 2D', designFee: 28000, dueRate: 0.4, dueAmount: 11200, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 11200, status: '已审批', calcAt: '2026-07-10 15:00' },
    { id: 'cm004', project: 'p001', projectName: '张宅全案 · 别墅', designer: 'u001', designerName: '张三', role: '平面 2D', designFee: 96000, dueRate: 0.4, dueAmount: 38400, qualityFactor: 1.1, timelinessFactor: 0.95, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 40128, status: '待审批', calcAt: '2026-07-12 09:30' },
    // 张三 已结算（p013 完结项目）+ 协调员分成
    { id: 'cm005', project: 'p013', projectName: 'The Reserve 61 公寓', designer: 'u001', designerName: '张三', role: '平面 2D', designFee: 60000, dueRate: 0.4, dueAmount: 24000, qualityFactor: 1.05, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 25200, status: '已审批', calcAt: '2026-07-02 11:00' },
    { id: 'cm006', project: 'p013', projectName: 'The Reserve 61 公寓', designer: 'u021', designerName: 'Lily', role: '协调员', designFee: 60000, dueRate: 0.15, dueAmount: 9000, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 9000, status: '已审批', calcAt: '2026-07-02 11:00' },
    // 协调员 赵六 个人分成（p001 张宅，在途）
    { id: 'cm007', project: 'p001', projectName: '张宅全案 · 别墅', designer: 'u004', designerName: '赵六', role: '协调员', designFee: 96000, dueRate: 0.15, dueAmount: 14400, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 14400, status: '待审批', calcAt: '2026-07-12 09:30' },
    // 部门负责人 徐东 个人分成：p003 在途（待结算）+ p014 完结（已结算）
    { id: 'cm008', project: 'p003', projectName: 'Kumar 别墅', designer: 'u012', designerName: '徐东', role: '平面 2D', designFee: 150000, dueRate: 0.4, dueAmount: 60000, qualityFactor: 1.05, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 63000, status: '待审批', calcAt: '2026-07-13 09:00' },
    { id: 'cm009', project: 'p014', projectName: '苏州·桃花源合院', designer: 'u012', designerName: '徐东', role: '平面 2D', designFee: 104000, dueRate: 0.4, dueAmount: 41600, qualityFactor: 1.1, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 45760, status: '已审批', calcAt: '2026-06-26 15:00' },
    { id: 'cm010', project: 'p014', projectName: '苏州·桃花源合院', designer: 'u013', designerName: '黄山', role: '3D', designFee: 104000, dueRate: 0.3, dueAmount: 31200, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 31200, status: '已审批', calcAt: '2026-06-26 15:00' },
    // 平面二部 · 华润悦府（p011，在途·待审批）
    { id: 'cm011', project: 'p011', projectName: '华润·悦府大平层', designer: 'u010', designerName: '陈二', role: '平面 2D', designFee: 84000, dueRate: 0.4, dueAmount: 33600, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 33600, status: '待审批', calcAt: '2026-07-13 16:00' },
    { id: 'cm012', project: 'p011', projectName: '华润·悦府大平层', designer: 'u013', designerName: '黄山', role: '3D', designFee: 84000, dueRate: 0.3, dueAmount: 25200, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 25200, status: '待审批', calcAt: '2026-07-13 16:00' },
    // 平面二部 · 招商雍华府（p012）· 设计师离职 + 转派（待审核）
    { id: 'cm013', project: 'p012', projectName: '招商·雍华府', designer: 'u006', designerName: '孙八', role: '平面 2D', designFee: 128000, dueRate: 0.4, dueAmount: 51200, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 51200, status: '待审批', calcAt: '2026-07-14 10:00', adjustType: '手动调整', adjustReason: '员工离职', adjustNote: '离职按已完成平面部分结算', manualAmount: 22000, reviewStatus: '待审核', reviewer: '', resigned: true, reassignFrom: null },
    { id: 'cm014', project: 'p012', projectName: '招商·雍华府', designer: 'u010', designerName: '陈二', role: '平面 2D', designFee: 128000, dueRate: 0.4, dueAmount: 51200, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 30000, status: '待审批', calcAt: '2026-07-14 10:05', adjustType: '手动调整', adjustReason: '离职转派', adjustNote: '接手孙八未完成部分', manualAmount: 30000, reviewStatus: '待审核', reviewer: '', resigned: false, reassignFrom: 'u006' },
    { id: 'cm015', project: 'p012', projectName: '招商·雍华府', designer: 'u020', designerName: '赵明', role: '3D', designFee: 128000, dueRate: 0.3, dueAmount: 38400, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 38400, status: '待审批', calcAt: '2026-07-14 10:00' },
    { id: 'cm016', project: 'p012', projectName: '招商·雍华府', designer: 'u021', designerName: 'Lily', role: '协调员', designFee: 128000, dueRate: 0.15, dueAmount: 19200, qualityFactor: 1.0, timelinessFactor: 1.0, satisfactionFactor: 1.0, paymentFactor: 1.0, actualAmount: 19200, status: '待审批', calcAt: '2026-07-14 10:00' }
  ];
  // 分成序号 + 为存量记录补齐"人工调整/审核"相关字段
  let _cmSeq = 100;
  COMMISSIONS.forEach(c => {
    c.adjustType = c.adjustType || '系统自动';           // 系统自动 / 手动调整
    c.adjustReason = c.adjustReason || '';               // 客户退款 / 员工离职 / 离职转派 / 其他
    c.adjustNote = c.adjustNote || '';
    if (c.manualAmount === undefined) c.manualAmount = null; // 负责人手动录入的最终实分
    c.reviewStatus = c.reviewStatus || '—';              // — / 待审核 / 已通过 / 已驳回
    c.reviewer = c.reviewer || '';
    c.resigned = c.resigned || false;                    // 该成员是否离职
    if (c.reassignFrom === undefined) c.reassignFrom = null; // 接手行：来自哪位离职设计师
  });

  // ===== 工时填报（设计师按里程碑阶段填报，负责人审核，汇总为项目总工时）=====
  // status: 待审核 / 已通过 / 已驳回
  const TIMESHEETS = [
    { id: 'wh001', project: 'p001', designerId: 'u004', designerName: '赵六', dept: '海外设计部', stage: '需求收集', hours: 16, note: '整理客户需求文档、画像、参考图', date: '2026-07-07', mode: '日报', status: '已通过' },
    { id: 'wh002', project: 'p001', designerId: 'u001', designerName: '张三', dept: '海外设计部', stage: '平面布局图', hours: 16, note: '完成 V1 首版平面布局', date: '2026-07-06', mode: '日报', status: '已通过' },
    { id: 'wh003', project: 'p001', designerId: 'u001', designerName: '张三', dept: '海外设计部', stage: '平面布局图', hours: 24, note: 'V2/V3 户型分区调整', date: '2026-07-08', mode: '日报', status: '已通过' },
    { id: 'wh004', project: 'p001', designerId: 'u001', designerName: '张三', dept: '海外设计部', stage: '平面布局图', hours: 12, note: 'V3.1/V3.2 客户反馈修改', date: '2026-07-11', mode: '日报', status: '已通过' },
    { id: 'wh005', project: 'p001', designerId: 'u003', designerName: '王五', dept: '海外设计部', stage: '3D意向', hours: 40, note: '出 3 个空间 720° 意向', date: '2026-07-09', mode: '日报', status: '已通过' },
    { id: 'wh006', project: 'p001', designerId: 'u003', designerName: '王五', dept: '海外设计部', stage: '3D意向', hours: 20, note: '意向风格调整', date: '2026-07-13', mode: '日报', status: '待审核' },
    { id: 'wh007', project: 'p003', designerId: 'u001', designerName: '张三', dept: '海外设计部', stage: '平面布局图', hours: 8, note: 'Kumar 别墅平面深化', date: '2026-07-14', mode: '日报', status: '待审核' },
    { id: 'wh008', project: 'p005', designerId: 'u002', designerName: '李四', dept: '平面设计一部', stage: '平面布局图', hours: 6, note: '刘宅平面收尾', date: '2026-07-13', mode: '日报', status: '已通过' }
  ];

  // ===== 里程碑质量评价（设计总监/负责人对各节点设计产出评分）=====
  // score 1-5；关联设计师 designerId，作为分单权重 & 分成质量系数输入
  const MILESTONE_EVALS = [
    { id: 'ev001', project: 'p001', msCode: 'ms3', designerId: 'u001', score: 4, comment: '主卧衣柜动线建议再优化，整体布局合理', reviewer: '刘总监', ts: '2026-07-08 16:30' },
    { id: 'ev002', project: 'p001', msCode: 'ms5', designerId: 'u003', score: 5, comment: '3D 意向风格精准，材质表现到位', reviewer: '刘总监', ts: '2026-07-09 17:10' },
    { id: 'ev003', project: 'p003', msCode: 'ms3', designerId: 'u012', score: 5, comment: '别墅大宅分区专业，深化图细节完整', reviewer: '刘总监', ts: '2026-07-06 11:20' },
    { id: 'ev004', project: 'p005', msCode: 'ms5', designerId: 'u005', score: 4, comment: '效果图光影不错，家具选型可更贴合预算', reviewer: '王负责人', ts: '2026-07-09 10:00' },
    { id: 'ev005', project: 'p008', msCode: 'ms7', designerId: 'u005', score: 5, comment: '全屋 3D 交付质量高，客户满意', reviewer: '刘总监', ts: '2026-07-09 15:30' }
  ];

  // ===== 设计师个人中心资料（可自定义，持久化）=====
  const PROFILES = {}; // designerId -> { avatar, displayName, styles:[], bio }

  // ===== 里程碑模板 =====
  const MILESTONE_TEMPLATE = [
    { code: 'ms1', name: 'CRM 立项 / 收款', role: 'PM + 财务', deliverable: '收款单' },
    { code: 'ms2', name: '需求收集 & 文档', role: '协调员', deliverable: '需求文档 PDF' },
    { code: 'ms3', name: '平面布局图 V1', role: '平面设计师', deliverable: '平面图 PDF' },
    { code: 'ms4', name: '平面客户确认', role: '协调员+客户', deliverable: '客户签认' },
    { code: 'ms5', name: '3D 意向 1-3 空间', role: '3D 设计师', deliverable: '720°/PDF' },
    { code: 'ms6', name: '意向客户确认', role: '协调员+客户', deliverable: '客户签认' },
    { code: 'ms7', name: '全屋 3D', role: '3D 设计师', deliverable: '720°/PDF' },
    { code: 'ms8', name: '最终客户确认', role: '协调员+客户', deliverable: '签认单' }
  ];

  // ===== 审计日志（动态新增的分单/改派等会写入这里）=====
  const AUDIT_LOGS = [];

  // ===== 角色（右上角可切换，用于演示不同权限/数据范围）=====
  // scope: all=全平台 / dept=本部门 / self=本人任务与项目 / coord=本人协调项目
  const ROLES = [
    { key: 'admin', name: '王负责人', title: '设计负责人（平台）', scope: 'all', dept: null, selfId: 'u017' },
    { key: 'deptlead', name: '徐东', title: '平面设计二部 · 部门负责人', scope: 'dept', dept: '平面设计二部', selfId: 'u012' },
    { key: 'designer', name: '张三', title: '海外设计部 · 设计师', scope: 'self', dept: '海外设计部', selfId: 'u001' },
    { key: 'coord', name: '赵六', title: '协调部 · 协调员', scope: 'coord', dept: '协调部', selfId: 'u004' }
  ];
  let _roleKey = 'admin';
  try { _roleKey = localStorage.getItem('yd_role') || 'admin'; } catch (e) {}
  function currentRole() { return ROLES.find(r => r.key === _roleKey) || ROLES[0]; }
  function setRole(k) { _roleKey = k; try { localStorage.setItem('yd_role', k); } catch (e) {} }

  // 兼容旧引用：CURRENT_USER 反映当前角色
  const CURRENT_USER = { id: 'u017', name: '王负责人', role: '设计负责人', roleCode: 'R14', avatar: null };
  (function syncUser() { const r = currentRole(); CURRENT_USER.id = r.selfId; CURRENT_USER.name = r.name; CURRENT_USER.role = r.title; })();

  // ===== 数据范围过滤 =====
  function projectDepts(p) {
    return [...(p.d2d || []), ...(p.d3d || []), p.coord].filter(Boolean).map(id => (DESIGNERS.find(d => d.id === id) || {}).dept);
  }
  function scopeProjects(list) {
    const r = currentRole(); list = list || PROJECTS;
    if (r.scope === 'all') return list;
    if (r.scope === 'dept') return list.filter(p => projectDepts(p).includes(r.dept));
    if (r.scope === 'self') return list.filter(p => (p.d2d || []).includes(r.selfId) || (p.d3d || []).includes(r.selfId));
    if (r.scope === 'coord') return list.filter(p => p.coord === r.selfId);
    return list;
  }
  function scopeDesigners(list) {
    const r = currentRole(); list = list || DESIGNERS.filter(d => ['2D', '3D', '协调员'].includes(d.role) && !d.left);
    if (r.scope === 'all') return list;
    if (r.scope === 'dept') return list.filter(d => d.dept === r.dept);
    return list.filter(d => d.id === r.selfId);
  }
  // 我的任务范围：始终为本人任务（"我的任务/我的分成"均为个人视图；平台负责人用项目总览监管）
  function scopeTasks(list) {
    const r = currentRole(); list = list || MY_TASKS;
    return list.filter(t => t.designer === r.selfId);
  }

  // ===================== 持久化（localStorage）=====================
  const STATE_VERSION = 12;   // 基础数据结构变更时递增，自动失效旧缓存
  const LS_KEY = 'yd_demo_state';

  function replaceArr(target, src) { if (Array.isArray(src)) { target.length = 0; src.forEach(x => target.push(x)); } }

  function persist() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        version: STATE_VERSION,
        DESIGNERS, PROJECTS, DESIGN_ORDERS, MY_TASKS, AUDIT_LOGS, MILESTONE_EVALS, PROFILES, TASK_TIMELINES, TIMESHEETS, ASSIGN_RULES, COMMISSIONS
      }));
    } catch (e) { /* 隐私模式等忽略 */ }
  }

  // 注意：restore 需在 TASK_TIMELINES 等声明后再执行（见文件末尾 restore() 调用）
  function restore() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const snap = JSON.parse(raw);
      if (snap.version !== STATE_VERSION) { localStorage.removeItem(LS_KEY); return; }
      replaceArr(DESIGNERS, snap.DESIGNERS);
      replaceArr(PROJECTS, snap.PROJECTS);
      replaceArr(DESIGN_ORDERS, snap.DESIGN_ORDERS);
      replaceArr(MY_TASKS, snap.MY_TASKS);
      replaceArr(AUDIT_LOGS, snap.AUDIT_LOGS);
      replaceArr(MILESTONE_EVALS, snap.MILESTONE_EVALS);
      replaceArr(TIMESHEETS, snap.TIMESHEETS);
      if (snap.COMMISSIONS) { replaceArr(COMMISSIONS, snap.COMMISSIONS); COMMISSIONS.forEach(c => { const n = parseInt(String(c.id).replace(/\D/g, ''), 10); if (n >= _cmSeq) _cmSeq = n + 1; }); }
      if (snap.ASSIGN_RULES) replaceArr(ASSIGN_RULES, snap.ASSIGN_RULES);
      if (snap.PROFILES) { Object.keys(snap.PROFILES).forEach(k => { PROFILES[k] = snap.PROFILES[k]; }); }
      if (snap.TASK_TIMELINES) { Object.keys(TASK_TIMELINES).forEach(k => delete TASK_TIMELINES[k]); Object.keys(snap.TASK_TIMELINES).forEach(k => { TASK_TIMELINES[k] = snap.TASK_TIMELINES[k]; }); }
    } catch (e) { /* ignore */ }
  }

  // ===================== 业务动作 =====================
  const nameOf = id => (DESIGNERS.find(d => d.id === id) || { name: id }).name;
  function nowStr() {
    const d = new Date(); const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function today() {
    const d = new Date(); const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  function addLog(cat, target, detail, actor) {
    AUDIT_LOGS.unshift({ ts: nowStr(), actor: actor || CURRENT_USER.name, cat, target, detail });
  }

  // 分单：把设计单落地为项目 + 生成设计师待接任务 + 写审计
  // opt = { coordMode:'internal'|'external', coord:id, coordExternal:str,
  //         d2d:[{id,mode,area}], d3d:[{id,mode,area}], spaces:[], note:'' }
  function assignOrder(orderId, opt) {
    const o = DESIGN_ORDERS.find(x => x.id === orderId);
    if (!o) return null;
    opt = opt || {};
    const d2d = opt.d2d || [], d3d = opt.d3d || [];
    const coordId = opt.coordMode === 'external' ? null : (opt.coord || null);
    const coordExt = opt.coordMode === 'external' ? (opt.coordExternal || '') : '';

    // 找到 / 新建项目
    let proj = o.projectId ? PROJECTS.find(p => p.id === o.projectId) : null;
    if (!proj) {
      const pid = 'p' + String(Date.now()).slice(-7);
      proj = {
        id: pid, code: o.code.replace(/^D-/, 'P-'), orderCode: o.code, name: o.projectName, type: o.type,
        customer: o.customer, custLevel: o.custLevel, contact: o.contact, region: o.region, area: o.area,
        budget: o.budget || 0, scope: o.scope, urgency: o.urgency, source: o.source,
        remark: o.remark || '', attachments: (o.attachments || []).slice(),
        stage: '需求收集', progress: 5, risk: 'ok',
        d2d: d2d.map(m => m.id), d3d: d3d.map(m => m.id), coord: coordId, coordExternal: coordExt,
        leadPm: o.pm, deadline: o.deadline || '待定', duration: o.duration || 30,
        createdAt: today(), changesCount: 0, deliverables: 0, status: '进行中'
      };
      proj.team = [...proj.d2d, ...proj.d3d, proj.coord].filter(Boolean);
      PROJECTS.unshift(proj);
      o.projectId = pid;
    } else {
      proj.d2d = d2d.map(m => m.id); proj.d3d = d3d.map(m => m.id);
      proj.coord = coordId; proj.coordExternal = coordExt;
      proj.team = [...proj.d2d, ...proj.d3d, proj.coord].filter(Boolean);
    }

    o.status = '已分派';
    o.assignedTeam = [...d2d.map(m => m.id), ...d3d.map(m => m.id), coordId].filter(Boolean);

    // 生成待接单任务 + 提升设计师负载
    const pmName = nameOf(o.pm) === o.pm ? '许光' : nameOf(o.pm);
    const coordName = coordId ? nameOf(coordId) : (coordExt ? coordExt + '（外部）' : '无需协调员');
    const t2d = d2d.map(m => nameOf(m.id)), t3d = d3d.map(m => nameOf(m.id));
    const mk = (m, label) => {
      const d = DESIGNERS.find(x => x.id === m.id) || {};
      MY_TASKS.unshift({
        id: 'tk' + Math.random().toString(36).slice(2, 8),
        order: o.code, project: o.projectName, customer: o.customer, custLevel: o.custLevel, area: o.area, region: o.region,
        type: o.type, scope: (o.scope || []).slice(), remark: o.remark || '', attachments: (o.attachments || []).slice(),
        dept: d.dept || '-', role: label, task: m.mode || '全案', taskArea: m.area || o.area,
        responsibleSpaces: (opt.spaces && opt.spaces.length) ? opt.spaces.slice() : ['全部空间'],
        pm: pmName, coordName: coordName, teammates2D: t2d, teammates3D: t3d,
        deadline: o.deadline || '待定', estimatedHours: Math.round((m.area || o.area) / 8),
        assigner: CURRENT_USER.name, assignedAt: '刚刚', urgency: o.urgency, status: 'pending'
      });
      if (typeof d.activeProjects === 'number') { d.activeProjects += 1; d.capacity = Math.min(100, d.capacity + 8); }
    };
    d2d.forEach(m => mk(m, '平面 2D'));
    d3d.forEach(m => mk(m, '3D效果图'));

    const coordTxt = coordId ? nameOf(coordId) : (coordExt ? coordExt + '（外部）' : '未指定');
    addLog('分单', `${o.code} ${o.projectName}`,
      `协调员 ${coordTxt} · 平面 ${d2d.map(m => nameOf(m.id)).join('/') || '-'} · 3D ${d3d.map(m => nameOf(m.id)).join('/') || '-'}；项目 ${proj.code}`);
    persist();
    return proj;
  }

  // 创建设计单：把创建表单落成一条订单池主数据（创建 → 单池 闭环）
  function createOrder(f) {
    f = f || {};
    const code = 'D-' + today().replace(/-/g, '') + '-' + String(Math.floor(100 + Math.random() * 900));
    const o = {
      id: 'o' + String(Date.now()).slice(-6), code, projectName: f.name || '未命名项目', type: f.type || '家装',
      scope: (f.scope || []).slice(), urgency: f.urgency || '正常', customer: f.cust || f.customer || '-',
      custLevel: f.custLevel || '普通', contact: f.phone || f.contact || '', area: Number(f.area) || 0,
      budget: (f.budgetMin && f.budgetMax) ? (f.budgetMin + '-' + f.budgetMax) : (f.budgetMin || f.budget || ''),
      region: f.country || f.region || '中国', source: f.source || '手动创建', status: '待分派',
      createdAt: nowStr(), deadline: f.deadline || '', duration: Number(f.duration) || 30,
      needCoord: f.needCoord !== 'no' && f.needCoord !== false, pm: 'u015',
      remark: f.remark || '', attachments: (f.attachments || []).slice()
    };
    DESIGN_ORDERS.unshift(o);
    addLog('创建设计单', code + ' ' + o.projectName, `来源 ${o.source} · 客户 ${o.customer} · ${o.area}㎡ · 附件 ${o.attachments.length}`);
    persist();
    return o;
  }

  function resetDemo() { try { localStorage.removeItem(LS_KEY); } catch (e) {} }

  // ===================== 里程碑质量评价 =====================
  const EVAL_ROLES = ['admin', 'deptlead']; // 设计负责人 / 部门负责人（含总监）可评价
  function canEvaluate() { return EVAL_ROLES.indexOf(currentRole().key) >= 0; }
  function milestoneEvals(projectId) { return MILESTONE_EVALS.filter(e => e.project === projectId); }
  function milestoneEval(projectId, msCode) { return MILESTONE_EVALS.find(e => e.project === projectId && e.msCode === msCode) || null; }
  function designerEvals(designerId) { return MILESTONE_EVALS.filter(e => e.designerId === designerId); }
  // 里程碑责任设计师（用于评价对象）
  function msResponsible(project, msCode) {
    if (msCode === 'ms3') return (project.d2d || [])[0] || null;
    if (msCode === 'ms5' || msCode === 'ms7') return (project.d3d || [])[0] || null;
    if (['ms2', 'ms4', 'ms6', 'ms8'].indexOf(msCode) >= 0) return project.coord || null;
    return null;
  }
  function addMilestoneEval(o) {
    if (!canEvaluate()) return null;
    const existing = milestoneEval(o.project, o.msCode);
    const r = currentRole();
    if (existing) {
      existing.score = o.score; existing.comment = o.comment; existing.reviewer = r.name; existing.ts = nowStr();
      existing.designerId = o.designerId || existing.designerId;
    } else {
      MILESTONE_EVALS.unshift({ id: 'ev' + Math.random().toString(36).slice(2, 7), project: o.project, msCode: o.msCode, designerId: o.designerId || null, score: o.score, comment: o.comment, reviewer: r.name, ts: nowStr() });
    }
    // 回写设计师平均质量分（作为分成质量系数输入）
    const dObj = DESIGNERS.find(d => d.id === o.designerId);
    if (dObj) { const es = designerEvals(o.designerId); dObj.qualityScore = +(es.reduce((s, e) => s + e.score, 0) / es.length).toFixed(2); }
    const proj = PROJECTS.find(p => p.id === o.project);
    addLog('质量评价', (proj ? proj.name : o.project) + ' · ' + o.msCode, `${nameOf(o.designerId)} 评分 ${o.score}★：${o.comment || '—'}`);
    persist();
    return true;
  }

  // ===================== 个人中心资料 =====================
  function getProfile(designerId) {
    const d = DESIGNERS.find(x => x.id === designerId) || {};
    const p = PROFILES[designerId] || {};
    return {
      avatar: p.avatar || nameOf(designerId).slice(0, 1),
      displayName: p.displayName || d.name || designerId,
      styles: p.styles || ['现代', '轻奢'],
      skills: p.skills || (d.skills || []).slice(),
      serviceRegions: p.serviceRegions || (d.city ? [d.city] : []),
      bio: p.bio || `${d.dept || ''} · ${d.role || ''} · ${d.level || ''}`
    };
  }
  function saveProfile(designerId, data) {
    PROFILES[designerId] = Object.assign({}, PROFILES[designerId], data);
    // 技能标签 / 擅长地域 回写设计师主档，直接影响智能分单匹配
    const d = DESIGNERS.find(x => x.id === designerId);
    if (d) {
      if (data.skills) d.skills = data.skills.slice();
      if (data.serviceRegions && data.serviceRegions.length) d.city = d.city || data.serviceRegions[0];
    }
    persist();
  }

  // ===== 自动分单规则（分单管理员可配置优先级与权重）=====
  const ASSIGN_RULES = [
    { key: 'skill', label: '技能标签匹配', weight: 30, priority: 1, desc: '柜体 / 门窗 / 卫浴 / 软装 等标签与设计单范围匹配' },
    { key: 'load', label: '工作量负载', weight: 25, priority: 2, desc: '在途设计单数量，负载越低越优先' },
    { key: 'quality', label: '历史设计质量', weight: 20, priority: 3, desc: '里程碑质量评分均值' },
    { key: 'region', label: '地域匹配', weight: 15, priority: 4, desc: '擅长地域 / 城市与项目所在地匹配' },
    { key: 'rotation', label: '均衡轮转', weight: 10, priority: 5, desc: '距上次分单时间越久越优先' }
  ];
  // 设计师"分单竞争力画像"：结合自填技能/风格/地域 + 历史评分/负载/轮转，输出各维度 0-100 及加权总分
  function designerReadiness(designerId) {
    const d = DESIGNERS.find(x => x.id === designerId) || {};
    const pf = getProfile(designerId);
    const evs = designerEvals(designerId);
    const avg = evs.length ? (evs.reduce((s, e) => s + e.score, 0) / evs.length) : (d.avgScore || 0);
    const days = d.lastAssignAt ? Math.max(0, Math.round((Date.now() - new Date(d.lastAssignAt)) / 86400000)) : 30;
    const dims = {
      skill: Math.min(100, (pf.skills.length) * 22),        // 约 5 个标签满分
      load: Math.max(0, 100 - (d.capacity || 0)),           // 负载越低越高
      quality: Math.round((avg / 5) * 100),
      region: Math.min(100, (pf.serviceRegions.length) * 34), // 约 3 个地域满分
      rotation: Math.min(100, days * 12)                    // 约 8+ 天满分
    };
    let total = 0;
    ASSIGN_RULES.forEach(r => { total += (dims[r.key] || 0) * (r.weight / 100); });
    return { dims, total: Math.round(total), avg: Number(avg).toFixed(1), days, activeProjects: d.activeProjects || 0, capacity: d.capacity || 0, lastAssignAt: d.lastAssignAt || '—' };
  }
  // 规则配置读写（分单管理员可视化配置）
  function getAssignRules() { return ASSIGN_RULES.slice().sort((a, b) => a.priority - b.priority); }
  function saveAssignRules(list) { replaceArr(ASSIGN_RULES, list.map(r => ({ key: r.key, label: r.label, weight: Number(r.weight) || 0, priority: r.priority, desc: r.desc }))); persist(); }
  // 地域匹配
  function _regionMatch(designer, order) {
    const region = (order && order.region) || '', city = designer.city || '';
    if (!region || !city) return false;
    if (region.includes(city)) return true;
    if (city === '曼谷' && region.includes('泰国')) return true;
    return false;
  }
  // 共享打分：按 ASSIGN_RULES 权重对「设计师×设计单」做 0-100 加权匹配打分
  function scoreDesigner(designer, order) {
    order = order || {};
    const reasons = [];
    const scopeStr = (order.scope || []).join('') + (order.type || '');
    const matched = (designer.skills || []).filter(s => scopeStr.includes(s) || s === order.type);
    const skill = matched.length >= 2 ? 100 : matched.length === 1 ? 75 : 35;
    if (matched.length) reasons.push({ text: '技能匹配 ' + matched.join('/'), warn: false });
    else reasons.push({ text: '技能未直接匹配', warn: true });
    const cap = designer.capacity || 0;
    const load = Math.max(0, 100 - cap);
    if (cap < 40) reasons.push({ text: '空闲 ' + cap + '%', warn: false });
    else if (cap <= 70) reasons.push({ text: '正常负载 ' + cap + '%', warn: false });
    else if (cap <= 85) reasons.push({ text: '较忙 ' + cap + '%', warn: false });
    else reasons.push({ text: '过载 ' + cap + '%', warn: true });
    const quality = Math.round(((designer.avgScore || 0) / 5) * 100);
    if ((designer.avgScore || 0) >= 4.5) reasons.push({ text: '⭐ ' + designer.avgScore, warn: false });
    const region = _regionMatch(designer, order) ? 100 : 40;
    if (region === 100) reasons.push({ text: '同区域 ' + designer.city, warn: false });
    const days = designer.lastAssignAt ? Math.max(0, Math.round((Date.now() - new Date(designer.lastAssignAt)) / 86400000)) : 30;
    const rotation = Math.min(100, days * 12);
    if (days >= 7) reasons.push({ text: '轮转优先（' + days + '天未分单）', warn: false });
    const dims = { skill, load, quality, region, rotation };
    let total = 0;
    ASSIGN_RULES.forEach(r => { total += (dims[r.key] || 0) * (r.weight / 100); });
    return { score: Math.round(total), dims, reasons };
  }

  // ===================== 我的任务 · 里程碑/版本时间轴 =====================
  // 版本字段：reason(为什么新增)/changes(改了什么)/customerReq(客户需求)/deliverables(产出物)
  //   + requestedBy/requestedAt(客户何时提出) → completedBy/completedAt(设计师何时完成)
  // 版本状态：pending(客户下发待处理) / accepted(设计师已接受处理中) / done(已产出)
  let _verSeq = 100;
  function mkVer(v, status, o) {
    return Object.assign({ id: 'ver' + (++_verSeq), v: v, status: status, reason: '', changes: '', customerReq: '', requestedBy: '', requestedAt: '', completedBy: '', completedAt: '', deliverables: [] }, o || {});
  }
  function defaultMaterials(code) {
    if (code === 'ms1') return [{ name: '收款单.pdf', type: 'pdf' }];
    if (code === 'ms2') return [{ name: '需求文档.pdf', type: 'pdf' }, { name: '客户CAD图纸.dwg', type: 'dwg' }, { name: '参考图集.zip', type: 'zip' }];
    if (code === 'ms4' || code === 'ms6' || code === 'ms8') return [{ name: '客户签认单.pdf', type: 'pdf' }];
    return [];
  }
  // 精编时间轴（张宅 p001，对应演示截图）；其余项目自动生成
  const TASK_TIMELINES = {
    p001: [
      { code: 'ms1', name: 'CRM 立项 / 收款', role: 'PM + 财务', design: false, status: 'done', completedAt: '2026-06-20 10:03', materials: [{ name: '收款单.pdf', type: 'pdf' }], versions: [] },
      { code: 'ms2', name: '需求收集 & 文档', role: '协调员', design: false, status: 'done', completedAt: '2026-06-22 12:03', materials: [{ name: '需求文档.pdf', type: 'pdf' }, { name: '客户CAD图纸.dwg', type: 'dwg' }, { name: '参考图集.zip', type: 'zip' }], versions: [] },
      {
        code: 'ms3', name: '平面布局图', role: '平面设计师', design: true, status: 'done', completedAt: '2026-06-30 14:20', materials: [], versions: [
          mkVer('V1.0', 'done', { reason: '首版方案', customerReq: '依据需求文档出全屋平面布局', requestedBy: '协调员 赵六', requestedAt: '2026-06-23 09:00', changes: '完成户型分区与家具初排', deliverables: [{ name: '平面布局V1.0.dwg', type: 'dwg' }, { name: '平面说明V1.0.pdf', type: 'pdf' }], completedBy: '张三', completedAt: '2026-06-24 15:00' }),
          mkVer('V2.0', 'done', { reason: '客户对 V1 分区不满意', customerReq: '客厅与餐厅打通，主卧扩大', requestedBy: '客户 张先生', requestedAt: '2026-06-25 10:20', changes: '户型分区重新调整，打通客餐厅，主卧并入部分次卧', deliverables: [{ name: '平面布局V2.0.dwg', type: 'dwg' }], completedBy: '张三', completedAt: '2026-06-26 18:00' }),
          mkVer('V3.0', 'done', { reason: '协调员整理 V2 客户反馈', customerReq: '确认打通方案，微调动线', requestedBy: '协调员 赵六', requestedAt: '2026-06-27 10:00', changes: '客厅动线优化', deliverables: [{ name: '平面布局V3.0.dwg', type: 'dwg' }], completedBy: '张三', completedAt: '2026-06-27 19:00' }),
          mkVer('V3.1', 'done', { reason: '客户微调', customerReq: '客厅沙发朝向调整', requestedBy: '客户 张先生', requestedAt: '2026-06-28 11:00', changes: '客厅沙发朝向调整为面向景观窗', deliverables: [{ name: '平面布局V3.1.dwg', type: 'dwg' }], completedBy: '张三', completedAt: '2026-06-28 18:45' }),
          mkVer('V3.2', 'done', { reason: '客户批注', customerReq: '主卧衣柜向左移 30cm，书房加一张书桌', requestedBy: '客户 张先生', requestedAt: '2026-06-29 14:00', changes: '主卧衣柜左移 30cm；书房新增书桌 2 处', deliverables: [{ name: '平面布局V3.2.dwg', type: 'dwg' }, { name: '平面效果说明.pdf', type: 'pdf' }], completedBy: '张三', completedAt: '2026-06-30 14:20' })
        ]
      },
      { code: 'ms4', name: '平面客户确认', role: '协调员+客户', design: false, status: 'done', completedAt: '2026-07-02 16:00', materials: [{ name: '平面签认单.pdf', type: 'pdf' }], versions: [] },
      {
        code: 'ms5', name: '3D 意向 1-3 空间', role: '3D 设计师', design: true, status: 'active', completedAt: '', materials: [], versions: [
          mkVer('V1.0', 'done', { reason: '首版 3D 意向', customerReq: '出客厅/主卧/书房 3 个空间 720° 意向', requestedBy: '协调员 赵六', requestedAt: '2026-07-08 10:00', changes: '完成 3 个空间 720° 意向渲染', deliverables: [{ name: '客厅意向720.jpg', type: 'img' }, { name: '主卧意向720.jpg', type: 'img' }, { name: '书房意向.jpg', type: 'img' }], completedBy: '王五', completedAt: '2026-07-09 15:00' }),
          mkVer('V1.1', 'pending', { customerReq: '客厅电视墙改为大理石，整体灯光调暖', requestedBy: '客户 张先生', requestedAt: '2026-07-11 14:00' })
        ]
      },
      { code: 'ms6', name: '意向客户确认', role: '协调员+客户', design: false, status: 'pending', completedAt: '', materials: [], versions: [] },
      { code: 'ms7', name: '全屋 3D', role: '3D 设计师', design: true, status: 'pending', completedAt: '', materials: [], versions: [] },
      { code: 'ms8', name: '最终客户确认', role: '协调员+客户', design: false, status: 'pending', completedAt: '', materials: [], versions: [] }
    ]
  };

  function genTimeline(p) {
    const doneCount = Math.max(1, Math.round((p.progress || 60) / 100 * MILESTONE_TEMPLATE.length));
    return MILESTONE_TEMPLATE.map((m, i) => {
      const status = i < doneCount ? 'done' : (i === doneCount ? 'active' : 'pending');
      const design = ['ms3', 'ms5', 'ms7'].indexOf(m.code) >= 0;
      const respId = msResponsible(p, m.code);
      const rname = respId ? nameOf(respId) : '设计师';
      const dt = `2026-07-${String(6 + i).padStart(2, '0')} 1${i % 6}:00`;
      const versions = [];
      if (design && status !== 'pending') {
        versions.push(mkVer('V1.0', 'done', { reason: '首版方案', customerReq: `依据需求完成「${m.name}」`, requestedBy: '协调员', requestedAt: dt, changes: '完成首版设计产出', deliverables: [{ name: `${m.name}_V1.0.pdf`, type: 'pdf' }], completedBy: rname, completedAt: dt }));
        if (status === 'done') versions.push(mkVer('V2.0', 'done', { reason: '客户反馈调整', customerReq: '局部细节优化', requestedBy: '客户', requestedAt: dt, changes: '按客户意见调整细节并定稿', deliverables: [{ name: `${m.name}_V2.0.pdf`, type: 'pdf' }], completedBy: rname, completedAt: dt }));
        if (status === 'active') versions.push(mkVer('V1.1', 'pending', { customerReq: '客户提出新的修改需求（待处理）', requestedBy: '客户', requestedAt: dt }));
      }
      return { code: m.code, name: m.name, role: m.role, design: design, status: status, completedAt: status === 'done' ? dt : '', materials: defaultMaterials(m.code), versions: versions };
    });
  }
  function getTaskTimelineFor(pid, proj) { if (!TASK_TIMELINES[pid]) TASK_TIMELINES[pid] = genTimeline(proj); return TASK_TIMELINES[pid]; }
  function getTaskTimeline(pid) {
    if (!TASK_TIMELINES[pid]) { const p = PROJECTS.find(x => x.id === pid); if (p) TASK_TIMELINES[pid] = genTimeline(p); }
    return TASK_TIMELINES[pid] || [];
  }
  function projectByName(name) { return PROJECTS.find(p => p.name === name) || null; }
  function timelineLatest(tl) {
    let t = '';
    tl.forEach(n => { if (n.completedAt > t) t = n.completedAt; n.versions.forEach(v => { if (v.requestedAt > t) t = v.requestedAt; if (v.completedAt > t) t = v.completedAt; }); });
    return t;
  }
  // 我的任务关联项目（按 tab 状态），按最新动态倒序
  function myTaskProjects(status) {
    const seen = {}, out = [];
    scopeTasks(MY_TASKS).filter(tk => tk.status === status).forEach(tk => {
      const p = projectByName(tk.project);
      const pid = p ? p.id : ('x_' + tk.id);
      if (seen[pid]) return; seen[pid] = 1;
      const proj = p || { id: pid, name: tk.project, progress: status === 'done' ? 100 : 70, type: tk.task, area: tk.area, d2d: [], d3d: [], coord: null };
      const tl = getTaskTimelineFor(pid, proj);
      out.push({ id: pid, project: p, task: tk, name: (p ? p.name : tk.project), latest: timelineLatest(tl) });
    });
    out.sort((a, b) => (b.latest || '').localeCompare(a.latest || ''));
    return out;
  }
  function nextVer(node) {
    if (!node.versions.length) return 'V1.0';
    let maj = 0, min = 0;
    node.versions.forEach(v => { const a = (v.v || 'V0.0').replace('V', '').split('.').map(Number); if (a[0] > maj || (a[0] === maj && a[1] > min)) { maj = a[0]; min = a[1]; } });
    return 'V' + maj + '.' + (min + 1);
  }
  function _actor(pid, msCode) {
    const p = PROJECTS.find(x => x.id === pid);
    const rid = p ? msResponsible(p, msCode) : null;
    return rid ? nameOf(rid) : currentRole().name;
  }
  function addTaskVersion(pid, msCode, o) {
    const node = getTaskTimeline(pid).find(n => n.code === msCode); if (!node) return null;
    const ver = mkVer(o.v || nextVer(node), 'done', { reason: o.reason || '', customerReq: o.customerReq || '', requestedBy: o.requestedBy || '设计师自建', requestedAt: o.requestedAt || nowStr(), changes: o.changes || '', deliverables: o.deliverables || [], completedBy: o.completedBy || _actor(pid, msCode), completedAt: nowStr() });
    node.versions.push(ver); node.completedAt = ver.completedAt;
    const p = PROJECTS.find(x => x.id === pid);
    addLog('版本更新', (p ? p.name : pid) + ' · ' + node.name, `${ver.completedBy} 新增 ${ver.v}：${ver.changes || ver.customerReq}`);
    persist(); return ver;
  }
  function completeVersion(pid, msCode, versionId, o) {
    const node = getTaskTimeline(pid).find(n => n.code === msCode); if (!node) return null;
    const ver = node.versions.find(v => v.id === versionId); if (!ver) return null;
    ver.status = 'done'; ver.reason = o.reason || ver.reason; ver.changes = o.changes || ''; if (o.deliverables) ver.deliverables = o.deliverables;
    ver.completedBy = _actor(pid, msCode); ver.completedAt = nowStr(); node.completedAt = ver.completedAt;
    const p = PROJECTS.find(x => x.id === pid);
    addLog('版本更新', (p ? p.name : pid) + ' · ' + node.name, `${ver.completedBy} 完成 ${ver.v}：${ver.changes}`);
    persist(); return ver;
  }
  function acceptRequirement(pid, msCode, versionId) {
    const node = getTaskTimeline(pid).find(n => n.code === msCode); if (!node) return;
    const ver = node.versions.find(v => v.id === versionId); if (ver) { ver.status = 'accepted'; persist(); }
  }

  // ===== 工时逻辑 =====
  // 项目总工时（含待审核，用于详情页 KPI 实时反映填报）
  function projectHours(pid) { return TIMESHEETS.filter(t => t.project === pid && t.status !== '已驳回').reduce((s, t) => s + (Number(t.hours) || 0), 0); }
  function projectTimesheets(pid) { return TIMESHEETS.filter(t => t.project === pid).slice().sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)); }
  // 本周一（周一为起始）YYYY-MM-DD
  function weekStart() {
    const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  // 当前角色本周已填报工时：设计师=本人；负责人/总监=其数据范围内全部设计师汇总
  function weekTimesheetHours() {
    const r = currentRole(); const start = weekStart();
    const ids = (r.scope === 'self' || r.scope === 'coord') ? [r.selfId] : scopeDesigners().map(d => d.id);
    return TIMESHEETS.filter(t => ids.indexOf(t.designerId) >= 0 && t.date >= start).reduce((s, t) => s + (Number(t.hours) || 0), 0);
  }
  function designerWeekHours(id) {
    const start = weekStart();
    return TIMESHEETS.filter(t => t.designerId === id && t.date >= start).reduce((s, t) => s + (Number(t.hours) || 0), 0);
  }
  function addTimesheet(o) {
    const r = currentRole();
    const ts = {
      id: 'wh' + Date.now().toString().slice(-6),
      project: o.project, designerId: o.designerId || r.selfId, designerName: o.designerName || r.name,
      dept: o.dept || (getDesigner(o.designerId || r.selfId).dept || '-'),
      stage: o.stage || '-', hours: Number(o.hours) || 0, note: o.note || '',
      date: o.date || today(), mode: o.mode || '日报', status: '待审核'
    };
    TIMESHEETS.unshift(ts);
    const p = PROJECTS.find(x => x.id === o.project);
    addLog('工时填报', (p ? p.name : o.project) + ' · ' + ts.stage, `${ts.designerName} 填报 ${ts.hours}h（${ts.mode}）`);
    persist(); return ts;
  }
  function approveTimesheet(id) {
    const t = TIMESHEETS.find(x => x.id === id); if (!t) return;
    t.status = '已通过'; t.rejectReason = '';
    const p = PROJECTS.find(x => x.id === t.project);
    addLog('工时审核', (p ? p.name : t.project) + ' · ' + t.stage, `${currentRole().name} 通过 ${t.designerName} ${t.hours}h`);
    persist();
  }
  function rejectTimesheet(id, reason) {
    const t = TIMESHEETS.find(x => x.id === id); if (!t) return;
    t.status = '已驳回'; t.rejectReason = reason || '工时与产出不符，请核对后重填';
    const p = PROJECTS.find(x => x.id === t.project);
    addLog('工时审核', (p ? p.name : t.project) + ' · ' + t.stage, `${currentRole().name} 驳回 ${t.designerName} ${t.hours}h：${t.rejectReason}`);
    persist();
  }
  function getDesigner(id) { return DESIGNERS.find(d => d.id === id) || { name: id, level: '-', role: '-', dept: '-' }; }
  // 阶段归一化（填报短名 与 里程碑全名 对齐）
  function stageKey(name) {
    name = String(name || '');
    if (/需求/.test(name)) return '需求收集';
    if (/平面/.test(name)) return '平面布局';
    if (/意向/.test(name)) return '3D意向';
    if (/全屋|3D/.test(name)) return '全屋3D';
    if (/确认|签认/.test(name)) return '客户确认';
    return '其他';
  }
  // 阶段基准工时（按面积估算，用于超工时预警）
  function stageBaseline(project, name) {
    const area = (project && project.area) || 120;
    switch (stageKey(name)) {
      case '需求收集': return 16;
      case '平面布局': return Math.round(area * 0.12);
      case '3D意向': return Math.round(area * 0.10);
      case '全屋3D': return Math.round(area * 0.25);
      default: return 4;
    }
  }
  function stageActualHours(pid, name) {
    const k = stageKey(name);
    return TIMESHEETS.filter(t => t.project === pid && t.status !== '已驳回' && stageKey(t.stage) === k).reduce((s, t) => s + (Number(t.hours) || 0), 0);
  }

  // ===== 分成结算判断 & 待评价项目（负责人待办）=====
  function isProjectSettled(pid) {
    return COMMISSIONS.some(c => c.project === pid && ['已审批', '已结算', '已发放'].indexOf(c.status) >= 0);
  }
  // 数据范围内、未结算、且存在“已完成但未评分”的设计里程碑 → 需负责人评价
  function pendingEvalProjects() {
    return scopeProjects(PROJECTS).filter(p => {
      if (isProjectSettled(p.id)) return false;
      const tl = getTaskTimeline(p.id);
      return tl.some(n => n.design && n.status === 'done' && !milestoneEval(p.id, n.code));
    });
  }

  // ===================== 客户退款 & 分成人工调整 =====================
  const ROLE_RATE = { '平面 2D': 0.4, '软装 2D': 0.35, '3D': 0.3, '协调员': 0.15, '部门负责人': 0.08, '总负责人': 0.07 };
  // 各部门负责人（用于生成"部门负责人分成"行）
  const DEPT_HEAD = { '平面设计一部': 'u008', '平面设计二部': 'u012', '海外设计部': 'u019', '3D效果图部': 'u007', '协调部': 'u009' };
  const PLATFORM_HEAD = 'u017'; // 总负责人
  // 分成弹窗按角色展示的固定顺序
  const COMMISSION_ROLE_ORDER = ['总负责人', '部门负责人', '协调员', '平面 2D', '软装 2D', '3D'];
  const ROLE_LABEL = { '总负责人': '总负责人分成', '部门负责人': '部门负责人分成', '协调员': '协调员分成', '平面 2D': '平面设计师分成', '软装 2D': '软装设计师分成', '3D': '3D设计师分成' };
  function getProjectRaw(id) { return PROJECTS.find(p => p.id === id) || null; }
  function _p(p) { return (typeof p === 'string') ? getProjectRaw(p) : p; }
  function projectDesignFee(p) { p = _p(p); return p ? (p.designFee || Math.round((p.area || 100) * 300)) : 0; }
  // 有效状态：退款覆盖优先，其次阶段推导
  function projectStatus(p) { p = _p(p); if (!p) return ''; return p.refund ? '客户退款' : (p.status || statusFromStage(p.stage, p.progress)); }
  // 退款类型：全额 / 部分
  function refundKind(p) { p = _p(p); if (!p || !p.refund) return ''; return p.refund.amount >= projectDesignFee(p) ? '全额退款' : '部分退款'; }
  // 仅平台负责人/部门负责人可调整
  function canAdjustCommission() { return ['all', 'dept'].indexOf(currentRole().scope) >= 0; }

  // ===== 施工图阶段（MS8 客户确认后由负责人决定是否需要施工图）=====
  // p.needShop: undefined=未决定 / true=需要 / false=不需要(结束)
  function shopState(pid) {
    const p = getProjectRaw(pid); if (!p) return null;
    return { need: (p.needShop === undefined ? null : p.needShop), designer: p.shopDesigner || null, drawings: p.shopDrawings || [], confirmed: !!p.shopConfirmed };
  }
  function setNeedShop(pid, need) {
    const p = getProjectRaw(pid); if (!p) return;
    p.needShop = !!need;
    if (!need) { p.shopDrawings = []; p.shopDesigner = null; p.shopConfirmed = false; p.stage = '项目完结'; p.status = '已完成'; p.progress = 100; }
    else { p.stage = '施工图'; if ((p.progress || 0) < 90) p.progress = 90; if (p.status === '已完成') p.status = '进行中'; }
    addLog('施工图决策', p.name, need ? '需要施工图，进入施工图阶段' : '无需施工图，项目结束');
    persist();
  }
  function resetShop(pid) { const p = getProjectRaw(pid); if (!p) return; delete p.needShop; p.shopDrawings = []; p.shopDesigner = null; p.shopConfirmed = false; persist(); }
  function setShopDesigner(pid, did) { const p = getProjectRaw(pid); if (!p) return; p.shopDesigner = did; persist(); }
  function addShopDrawing(pid, o) {
    const p = getProjectRaw(pid); if (!p) return null;
    p.shopDrawings = p.shopDrawings || [];
    const rec = Object.assign({ v: 'V' + (p.shopDrawings.length + 1) + '.0', at: nowStr(), by: o.by || nameOf(p.shopDesigner) || '设计师' }, o);
    p.shopDrawings.push(rec);
    p.deliverables = (p.deliverables || 0) + 1;
    addLog('施工图上传', p.name, rec.v + ' ' + (o.name || ''));
    persist();
    return rec;
  }
  function confirmShop(pid) {
    const p = getProjectRaw(pid); if (!p) return;
    p.shopConfirmed = true; p.stage = '项目完结'; p.status = '已完成'; p.progress = 100;
    addLog('施工图确认', p.name, '客户确认施工图，项目完成');
    persist();
  }

  function newCommission(pid, pname, designerId, role, fee, rate, due, actual) {
    return {
      id: 'cm' + (++_cmSeq), project: pid, projectName: pname, designer: designerId, designerName: nameOf(designerId), role: role,
      designFee: fee, dueRate: rate, dueAmount: due, qualityFactor: 1, timelinessFactor: 1, satisfactionFactor: 1, paymentFactor: 1,
      actualAmount: actual, status: '待审批', calcAt: nowStr(),
      adjustType: '系统自动', adjustReason: '', adjustNote: '', manualAmount: null, reviewStatus: '—', reviewer: '', resigned: false, reassignFrom: null
    };
  }
  // 若项目还没有分成行，则按团队(平面/3D/协调员)自动生成
  function ensureCommissions(pid) {
    let rows = COMMISSIONS.filter(c => c.project === pid);
    if (rows.length) return rows;
    const p = getProjectRaw(pid); if (!p) return [];
    const fee = projectDesignFee(p);
    const members = [];
    (p.d2d || []).forEach(id => members.push({ id: id, role: '平面 2D' }));
    (p.d3d || []).forEach(id => members.push({ id: id, role: '3D' }));
    if (p.coord) members.push({ id: p.coord, role: '协调员' });
    members.forEach(m => {
      const rate = ROLE_RATE[m.role] || 0.3;
      const due = Math.round(fee * rate);
      COMMISSIONS.push(newCommission(pid, p.name, m.id, m.role, fee, rate, due, due));
    });
    return COMMISSIONS.filter(c => c.project === pid);
  }
  function commissionsByProject(pid) { return COMMISSIONS.filter(c => c.project === pid); }
  // 项目主责部门（取首位平面设计师所属部门）
  function primaryDept(p) {
    const id = (p.d2d && p.d2d[0]) || (p.d3d && p.d3d[0]) || p.coord;
    const d = DESIGNERS.find(x => x.id === id);
    return d ? d.dept : null;
  }
  function deptHead(dept) { return DEPT_HEAD[dept] || null; }
  // 在执行角色分成基础上，补齐"部门负责人 / 总负责人"管理分成行（幂等）
  function ensureFullCommissions(pid) {
    ensureCommissions(pid);
    const p = getProjectRaw(pid); if (!p) return commissionsByProject(pid);
    const fee = projectDesignFee(p);
    const rows = commissionsByProject(pid);
    function addRole(role, designerId) {
      if (!designerId) return;
      if (rows.some(c => c.role === role)) return;
      const rate = ROLE_RATE[role] || 0;
      const due = Math.round(fee * rate);
      const c = newCommission(pid, p.name, designerId, role, fee, rate, due, due);
      COMMISSIONS.push(c); rows.push(c);
    }
    addRole('部门负责人', deptHead(primaryDept(p)));
    addRole('总负责人', PLATFORM_HEAD);
    return commissionsByProject(pid);
  }
  // 分成行按角色顺序排序（用于调整弹窗展示）
  function commissionsByRole(pid) {
    const rows = ensureFullCommissions(pid);
    return rows.slice().sort((a, b) => {
      const ia = COMMISSION_ROLE_ORDER.indexOf(a.role), ib = COMMISSION_ROLE_ORDER.indexOf(b.role);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
  }
  function commissionRoleLabel(role) { return ROLE_LABEL[role] || role; }
  // 部分退款后的建议分成 = 自动分成 × 剩余设计费比例
  function refundSuggest(c) {
    const p = getProjectRaw(c.project); const fee = projectDesignFee(p);
    const remain = (p && p.refund) ? Math.max(0, fee - p.refund.amount) : fee;
    const ratio = fee ? remain / fee : 1;
    return Math.round(c.actualAmount * ratio);
  }
  // 生效分成：审核通过的手动值优先，否则自动值
  function commissionFinal(c) { return (c.manualAmount != null && c.reviewStatus === '已通过') ? c.manualAmount : c.actualAmount; }

  // 登记/撤销客户退款
  function setRefund(pid, amount, reason) {
    const p = getProjectRaw(pid); if (!p) return;
    amount = Math.max(0, Math.min(Number(amount) || 0, projectDesignFee(p)));
    p.refund = { amount: amount, reason: reason || '', at: nowStr(), by: CURRENT_USER.name };
    p.statusOverride = '客户退款';
    ensureCommissions(pid);
    addLog('客户退款', p.name, `登记退款 ¥${amount}（${reason || '—'}）· ${refundKind(p)}`);
    persist();
  }
  function clearRefund(pid) {
    const p = getProjectRaw(pid); if (!p) return;
    p.refund = null; p.statusOverride = null;
    addLog('客户退款', p.name, '撤销退款状态'); persist();
  }
  // 手动覆盖某条分成的最终实分（进入待审核）
  function overrideCommission(cid, amount, reason, note) {
    const c = COMMISSIONS.find(x => x.id === cid); if (!c) return;
    c.manualAmount = Math.max(0, Math.round(Number(amount) || 0));
    c.adjustType = '手动调整'; c.adjustReason = reason || '其他'; c.adjustNote = note || '';
    c.reviewStatus = '待审核'; c.reviewer = '';
    addLog('分成调整', c.projectName, `${c.designerName} 手动分成 ¥${c.manualAmount}（${c.adjustReason}）· 待审核`);
    persist();
  }
  // 标记成员离职并手动设定其分成
  function resignCommission(cid, amount, note) {
    const c = COMMISSIONS.find(x => x.id === cid); if (!c) return;
    c.resigned = true;
    overrideCommission(cid, amount, '员工离职', note);
  }
  // 离职岗位转派给接手设计师，默认 = 该岗位自动分成 − 离职者手动分成
  function addReassignCommission(pid, fromCid, newDesignerId, amount) {
    const from = COMMISSIONS.find(x => x.id === fromCid); const p = getProjectRaw(pid);
    if (!from || !p) return null;
    const amt = Math.max(0, Math.round(Number(amount) || 0));
    const c = newCommission(pid, p.name, newDesignerId, from.role, from.designFee, from.dueRate, from.dueAmount, amt);
    c.manualAmount = amt; c.adjustType = '手动调整'; c.adjustReason = '离职转派'; c.reviewStatus = '待审核'; c.reassignFrom = from.designer;
    COMMISSIONS.push(c);
    addLog('分成调整', p.name, `${nameOf(newDesignerId)} 接手 ${from.designerName} 岗位 · 分成 ¥${amt} 待审核`);
    persist();
    return c;
  }
  // 转派默认建议金额
  function reassignDefault(fromCid) {
    const from = COMMISSIONS.find(x => x.id === fromCid); if (!from) return 0;
    const resignedAmt = from.manualAmount != null ? from.manualAmount : 0;
    return Math.max(0, Math.round((from.actualAmount || 0) - resignedAmt));
  }
  // 按当前角色数据范围过滤分成行
  function scopeCommissions(list) {
    const r = currentRole(); list = list || COMMISSIONS;
    if (r.scope === 'all') return list;
    if (r.scope === 'self') return list.filter(c => c.designer === r.selfId);
    if (r.scope === 'coord') { const pids = PROJECTS.filter(p => p.coord === r.selfId).map(p => p.id); return list.filter(c => pids.indexOf(c.project) >= 0); }
    if (r.scope === 'dept') { const pids = PROJECTS.filter(p => projectDepts(p).indexOf(r.dept) >= 0).map(p => p.id); return list.filter(c => pids.indexOf(c.project) >= 0); }
    return list;
  }
  // 待审核的手动分成（数据范围内）
  function pendingReviewCommissions() { return scopeCommissions(COMMISSIONS).filter(c => c.reviewStatus === '待审核'); }
  // 我的分成（当前登录设计师本人）
  function myCommissions() { return COMMISSIONS.filter(c => c.designer === currentRole().selfId); }
  // 负责人审核手动分成
  function reviewCommission(cid, pass, reviewer) {
    const c = COMMISSIONS.find(x => x.id === cid); if (!c) return;
    c.reviewStatus = pass ? '已通过' : '已驳回';
    c.reviewer = reviewer || CURRENT_USER.name;
    if (pass && c.manualAmount != null) { c.actualAmount = c.manualAmount; c.status = '已审批'; }
    addLog('分成审核', c.projectName, `${c.designerName} 分成调整${pass ? '已通过' : '已驳回'} · ${c.reviewer}`);
    persist();
  }

  // Export
  global.MOCK = {
    DEPARTMENTS, DESIGNERS, CUSTOMERS, PROJECTS, DESIGN_ORDERS, TODOS,
    MY_TASKS, COORD_TASKS, myCoordTasks, VERSIONS, COMMISSIONS, MILESTONE_TEMPLATE, AUDIT_LOGS, MILESTONE_EVALS,
    CURRENT_USER,
    // 质量评价 & 个人中心
    canEvaluate, milestoneEvals, milestoneEval, designerEvals, msResponsible, addMilestoneEval,
    getProfile, saveProfile, ASSIGN_RULES, designerReadiness, getAssignRules, saveAssignRules, scoreDesigner,
    // 我的任务 · 里程碑/版本时间轴
    myTaskProjects, getTaskTimeline, addTaskVersion, completeVersion, acceptRequirement,
    // 工时填报 & 项目评价待办
    TIMESHEETS, projectHours, projectTimesheets, weekTimesheetHours, designerWeekHours, addTimesheet, approveTimesheet, rejectTimesheet,
    stageBaseline, stageActualHours, isProjectSettled, pendingEvalProjects,
    // 客户退款 & 分成人工调整
    shopState, setNeedShop, resetShop, setShopDesigner, addShopDrawing, confirmShop,
    projectStatus, projectDesignFee, refundKind, canAdjustCommission, ensureCommissions, ensureFullCommissions,
    commissionsByProject, commissionsByRole, commissionRoleLabel,
    refundSuggest, commissionFinal, setRefund, clearRefund, overrideCommission, resignCommission,
    addReassignCommission, reassignDefault, reviewCommission, scopeCommissions, pendingReviewCommissions, myCommissions,
    getDesigner: id => DESIGNERS.find(d => d.id === id) || { name: id, level: '-', role: '-', dept: '-' },
    getCustomer: id => CUSTOMERS.find(c => c.id === id) || { name: id, level: '', address: '' },
    getProject: id => PROJECTS.find(p => p.id === id) || null,
    // 常用集合
    designersOnly: () => DESIGNERS.filter(d => ['2D', '3D', '协调员'].includes(d.role) && !d.left),
    designersByRole: role => DESIGNERS.filter(d => d.role === role && !d.left),
    names: ids => (ids || []).map(id => nameOf(id)).join('、'),
    deptShort: dept => DEPT_SHORT[dept] || dept,
    // 业务动作
    assignOrder, createOrder, persist, resetDemo, addLog, nowStr, today,
    // 角色 & 数据范围
    ROLES, currentRole, setRole, scopeProjects, scopeDesigners, scopeTasks, projectDepts
  };

  // 所有数据/结构声明完成后再执行本地缓存恢复（避免 TDZ）
  restore();
  // 为所有项目补齐"部门负责人 / 总负责人"管理分成行（幂等；不落盘，随加载重算）
  PROJECTS.forEach(p => ensureFullCommissions(p.id));
})(window);
