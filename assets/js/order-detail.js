/**
 * 项目需求清单弹窗（共享）
 * 用于「设计单池」与「我的任务·待接收」的"查看详情"。
 * 从设计师接单视角，把一条设计单的全部关键信息汇总为一张需求清单。
 * 依赖全局：MOCK、toast、openModal、closeModal（utils.js / mock-data.js）
 */
(function (global) {
  const MODAL_ID = 'order-detail-modal';
  const ATT_ICON = { dwg: '📐', pdf: '📄', img: '🖼️', xls: '📊', zip: '🗜️', doc: '📄' };

  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;
    const style = document.createElement('style');
    style.textContent = `
      #${MODAL_ID} .modal-body { max-height: 74vh; overflow: auto; }
      .od-hero { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:16px; }
      .od-hero .h-code { font-family: var(--font-mono); color: var(--text-secondary); font-size:13px; }
      .od-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
      @media (max-width:720px){ .od-grid { grid-template-columns:1fr; } }
      .od-sec { margin-bottom:18px; }
      .od-sec > h5 { font-size:13px; color:var(--text-secondary); margin:0 0 8px; font-weight:600; letter-spacing:.03em; }
      .od-mytask { border:1px solid var(--brand-primary); background:var(--brand-primary-bg); border-radius:10px; padding:14px 16px; margin-bottom:18px; }
      .od-mytask > h5 { color:var(--brand-primary); margin:0 0 10px; font-size:13px; font-weight:600; }
      .od-kv { display:grid; grid-template-columns:auto 1fr; gap:7px 14px; font-size:13px; align-items:start; }
      .od-kv .k { color:var(--text-secondary); white-space:nowrap; }
      .od-kv .v { color:var(--text-primary); font-weight:500; }
      .od-req { background:var(--bg-hover); border-radius:8px; padding:12px 14px; font-size:14px; line-height:1.75; white-space:pre-wrap; color:var(--text-primary); }
      .od-att { display:flex; flex-wrap:wrap; gap:8px; }
      .od-chip { display:inline-flex; align-items:center; gap:6px; font-size:13px; background:#fff; border:1px solid var(--border); border-radius:var(--radius-round); padding:5px 12px; cursor:pointer; }
      .od-chip:hover { border-color:var(--brand-primary); color:var(--brand-primary); }
      .od-flow { display:flex; flex-wrap:wrap; gap:6px; }
      .od-step { flex:1 1 120px; background:var(--bg-hover); border-radius:8px; padding:8px 10px; }
      .od-step .n { font-size:11px; color:var(--text-secondary); }
      .od-step .t { font-size:12px; font-weight:500; margin-top:2px; }
      .od-step .d { font-size:11px; color:var(--text-secondary); margin-top:2px; }
      .od-step.mine { background:var(--brand-primary-bg); border:1px solid var(--brand-primary); }
    `;
    document.head.appendChild(style);
    const wrap = document.createElement('div');
    wrap.className = 'modal-mask';
    wrap.id = MODAL_ID;
    wrap.innerHTML = `
      <div class="modal modal-lg">
        <div class="modal-header">
          <div class="modal-title" id="od-title">项目需求清单</div>
          <div class="modal-close" onclick="closeModal('${MODAL_ID}')">✕</div>
        </div>
        <div class="modal-body" id="od-body"></div>
        <div class="modal-footer" id="od-footer"></div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) closeModal(MODAL_ID); });

    // 附件预览弹层（叠在需求清单之上）
    const fm = document.createElement('div');
    fm.className = 'modal-mask';
    fm.id = 'od-file-modal';
    fm.style.zIndex = '1200';
    fm.innerHTML = `
      <div class="modal modal-md">
        <div class="modal-header">
          <div class="modal-title" id="odf-title">附件预览</div>
          <div class="modal-close" onclick="closeModal('od-file-modal')">✕</div>
        </div>
        <div class="modal-body">
          <div id="odf-preview" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:28px 0;background:var(--bg-hover);border-radius:8px;"></div>
          <div class="text-sm text-secondary" id="odf-meta" style="margin-top:10px;"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" onclick="closeModal('od-file-modal')">关闭</button>
          <button class="btn btn-primary" id="odf-download">⬇ 下载</button>
        </div>
      </div>`;
    document.body.appendChild(fm);
    fm.addEventListener('click', (e) => { if (e.target === fm) closeModal('od-file-modal'); });
    fm.querySelector('#odf-download').addEventListener('click', () => {
      closeModal('od-file-modal');
      if (typeof global.toast === 'function') global.toast('下载中（演示环境为占位文件）', 'info');
    });
  }

  function previewFile(name, type) {
    ensureModal();
    const map = { pdf: 'PDF 需求文档', dwg: 'CAD 图纸（DWG）', img: '图片 / 720° 全景', xls: 'Excel 表格', zip: '压缩包', doc: 'Word 文档' };
    document.getElementById('odf-title').textContent = name;
    document.getElementById('odf-preview').innerHTML = `<div style="font-size:52px;">${ATT_ICON[type] || '📎'}</div><div>${map[type] || '附件'} · 预览（演示占位）</div>`;
    document.getElementById('odf-meta').textContent = '文件：' + name + ' · 类型：' + (map[type] || type);
    openModal('od-file-modal');
  }

  function urgencyBadge(u) {
    const c = u === '紧急' ? 'danger' : u === '加急' ? 'warning' : 'info';
    const i = u === '紧急' ? '🚨' : u === '加急' ? '🚩' : '⏱';
    return `<span class="tag tag-${c}">${i} ${u || '正常'}</span>`;
  }
  function srcBadge(s) {
    if (!s) return '';
    const c = s === 'CRM' ? 'tag-info' : s === 'OMS' ? 'tag-purple' : '';
    return `<span class="tag ${c}">来源：${s}</span>`;
  }
  function statusBadge(s) {
    if (!s) return '';
    const map = { '待分派': 'tag-warning', 'pending': 'tag-warning', '已分派': 'tag-success', 'accepted': 'tag-brand', 'rejected': 'tag-danger', 'done': 'tag-success' };
    const label = { pending: '待接单', accepted: '进行中', rejected: '已拒接', done: '已完成' }[s] || s;
    return `<span class="tag ${map[s] || ''}">${label}</span>`;
  }
  function attHtml(list) {
    if (!list || !list.length) return '<span class="text-secondary text-sm">暂无附件</span>';
    return list.map(f => `<span class="od-chip" data-fname="${f.name}" data-ftype="${f.type}">${ATT_ICON[f.type] || '📎'} ${f.name}</span>`).join('');
  }
  function flowHtml(model) {
    const T = (global.MOCK && global.MOCK.MILESTONE_TEMPLATE) || [];
    return T.map((m, i) => {
      let mine = false;
      if (model.hasTask) {
        const r = model.role || '';
        if ((/2D|平面/.test(r)) && m.code === 'ms3') mine = true;
        if (/3D/.test(r) && (m.code === 'ms5' || m.code === 'ms7')) mine = true;
        if (/协调/.test(r) && ['ms2', 'ms4', 'ms6', 'ms8'].indexOf(m.code) >= 0) mine = true;
      }
      return `<div class="od-step ${mine ? 'mine' : ''}"><div class="n">MS${i + 1}${mine ? ' · 我负责' : ''}</div><div class="t">${m.name}</div><div class="d">${m.deliverable}</div></div>`;
    }).join('');
  }

  function bodyHtml(m) {
    const vip = m.custLevel === 'VIP' ? '<span class="tag tag-warning">★ VIP 客户</span>' : '';
    const scope = (m.scope || []).join(' · ') || '—';
    const budget = m.budget ? m.budget + ' 万' : '—';
    const dur = m.duration ? m.duration + ' 天' : '—';

    let myTask = '';
    if (m.hasTask) {
      const taskDesc = m.task === '全案' ? '全案（全部空间）' : ('指定面积 ' + (m.taskArea || '-') + ' ㎡');
      const team = [];
      if (m.teammates2D && m.teammates2D.length) team.push('平面 ' + m.teammates2D.join('/'));
      if (m.teammates3D && m.teammates3D.length) team.push('3D ' + m.teammates3D.join('/'));
      myTask = `
        <div class="od-mytask">
          <h5>🙋 我的任务（接单重点）</h5>
          <div class="od-kv">
            <div class="k">我的角色</div><div class="v">${m.role || '-'}${m.dept ? ' · ' + m.dept : ''}</div>
            <div class="k">任务范围</div><div class="v">${taskDesc}</div>
            <div class="k">负责空间</div><div class="v">${(m.responsibleSpaces || []).join('、') || '—'}</div>
            <div class="k">预估工时</div><div class="v">${m.estimatedHours || '-'} h</div>
            <div class="k">期望交付</div><div class="v">${m.deadline || '待定'}</div>
            <div class="k">派单信息</div><div class="v">${m.assigner || '-'}${m.assignedAt ? ' · ' + m.assignedAt : ''}</div>
            ${team.length ? `<div class="k">同项目队友</div><div class="v">${team.join(' · ')}</div>` : ''}
          </div>
        </div>`;
    }

    return `
      <div class="od-hero">
        <span class="h-code">${m.code || '-'}</span>
        ${srcBadge(m.source)}
        ${urgencyBadge(m.urgency)}
        ${vip}
        ${statusBadge(m.status)}
      </div>
      ${myTask}
      <div class="od-grid">
        <div class="od-sec">
          <h5>📋 项目概览</h5>
          <div class="od-kv">
            <div class="k">项目类型</div><div class="v">${m.type || '-'}</div>
            <div class="k">设计范围</div><div class="v">${scope}</div>
            <div class="k">面积</div><div class="v">${m.area || '-'} ㎡</div>
            <div class="k">区域</div><div class="v">${m.region || '-'}</div>
            <div class="k">预算区间</div><div class="v">${budget}</div>
            <div class="k">期望完成</div><div class="v">${m.deadline || '待定'}</div>
            <div class="k">期望工期</div><div class="v">${dur}</div>
          </div>
        </div>
        <div class="od-sec">
          <h5>👤 客户信息</h5>
          <div class="od-kv">
            <div class="k">客户名称</div><div class="v">${m.customer || '-'}</div>
            <div class="k">客户等级</div><div class="v">${m.custLevel || '普通'}</div>
            <div class="k">联系方式</div><div class="v">${m.contact || '—（按权限可见）'}</div>
          </div>
          <h5 style="margin-top:14px;">🧭 协作团队</h5>
          <div class="od-kv">
            <div class="k">PM 销售</div><div class="v">${m.pm || '-'}</div>
            <div class="k">协调员</div><div class="v">${m.coordName || (m.needCoord === false ? 'PM 自行对接' : '待分派')}</div>
          </div>
        </div>
      </div>
      <div class="od-sec">
        <h5>🎯 客户需求 / 设计方向</h5>
        <div class="od-req">${m.remark || '暂无文字说明，请查看需求附件或与协调员/PM 沟通。'}</div>
      </div>
      <div class="od-sec">
        <h5>📎 需求附件（点击预览 / 下载）</h5>
        <div class="od-att">${attHtml(m.attachments)}</div>
      </div>
      <div class="od-sec" style="margin-bottom:0;">
        <h5>🚩 交付流程与节点（该项目将经历）</h5>
        <div class="od-flow">${flowHtml(m)}</div>
      </div>`;
  }

  function open(model, actions) {
    ensureModal();
    document.getElementById('od-title').textContent = (model.name || '项目') + ' · 项目需求清单';
    const body = document.getElementById('od-body');
    body.innerHTML = bodyHtml(model);
    // 附件预览（真实预览弹层）
    body.querySelectorAll('.od-chip').forEach(c => c.addEventListener('click', () => previewFile(c.dataset.fname, c.dataset.ftype)));
    // Footer 按钮
    const footer = document.getElementById('od-footer');
    footer.innerHTML = '';
    const close = document.createElement('button');
    close.className = 'btn btn-default';
    close.textContent = '关闭';
    close.addEventListener('click', () => closeModal(MODAL_ID));
    footer.appendChild(close);
    (actions || []).forEach(a => {
      const b = document.createElement('button');
      b.className = 'btn ' + (a.primary ? 'btn-primary' : a.danger ? 'btn-danger' : 'btn-default');
      b.textContent = a.label;
      b.addEventListener('click', () => { if (a.onClick) a.onClick(); });
      footer.appendChild(b);
    });
    openModal(MODAL_ID);
  }

  function fromOrder(o) {
    return {
      code: o.code, name: o.projectName, source: o.source, type: o.type, scope: o.scope || [], urgency: o.urgency,
      area: o.area, region: o.region, budget: o.budget, deadline: o.deadline, duration: o.duration,
      customer: o.customer, custLevel: o.custLevel, contact: o.contact, remark: o.remark, attachments: o.attachments || [],
      pm: '许光', coordName: o.needCoord === false ? 'PM 自行对接' : '待分派', needCoord: o.needCoord,
      status: o.status, hasTask: false
    };
  }
  function fromTask(tk) {
    return {
      code: tk.order, name: tk.project, source: tk.source, type: tk.type, scope: tk.scope || [], urgency: tk.urgency,
      area: tk.area, region: tk.region, budget: tk.budget, deadline: tk.deadline, duration: tk.duration,
      customer: tk.customer, custLevel: tk.custLevel, contact: tk.contact, remark: tk.remark, attachments: tk.attachments || [],
      pm: tk.pm, coordName: tk.coordName,
      hasTask: true, role: tk.role, task: tk.task, taskArea: tk.taskArea, responsibleSpaces: tk.responsibleSpaces || [],
      estimatedHours: tk.estimatedHours, assigner: tk.assigner, assignedAt: tk.assignedAt, dept: tk.dept,
      teammates2D: tk.teammates2D || [], teammates3D: tk.teammates3D || [], status: tk.status
    };
  }

  global.OrderDetail = {
    open,
    openOrder: (o, actions) => open(fromOrder(o), actions),
    openTask: (tk, actions) => open(fromTask(tk), actions)
  };
})(window);
