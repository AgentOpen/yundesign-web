/* 创建设计单 —— 共享弹窗组件（我的待办 / 设计单池 复用，替代独立 create.html 页面） */
(function (global) {
  const MODAL_ID = 'order-create-modal';
  const ATT_ICON = { dwg: '📐', pdf: '📄', img: '🖼️', xls: '📊', zip: '🗜️' };

  function ensureStyle() {
    if (document.getElementById('oc-style')) return;
    const s = document.createElement('style');
    s.id = 'oc-style';
    s.textContent = `
      .oc-form { font-size: 13px; }
      .oc-sec { border-top: 1px solid var(--divider); padding-top: 16px; margin-top: 16px; }
      .oc-sec:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
      .oc-sec-title { font-weight: 600; margin-bottom: 12px; font-size: 14px; }
      .oc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .oc-grid .full { grid-column: 1 / -1; }
      @media (max-width: 640px){ .oc-grid { grid-template-columns: 1fr; } }
      .oc-item label { display:block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
      .oc-item .req { color: var(--danger); }
      .oc-input, .oc-textarea { width: 100%; height: 34px; border: 1px solid var(--border); border-radius: 6px; padding: 0 10px; font-size: 13px; }
      .oc-textarea { height: auto; padding: 8px 10px; resize: vertical; font-family: inherit; }
      .oc-chip { display:inline-flex; align-items:center; padding: 4px 12px; border:1px solid var(--border); border-radius: 999px; cursor:pointer; font-size:12px; user-select:none; }
      .oc-chip.active { background: var(--brand-primary-bg); border-color: var(--brand-primary); color: var(--brand-primary); font-weight:600; }
      .oc-radio { display:inline-flex; align-items:center; gap:4px; margin-right:12px; font-size:13px; cursor:pointer; }
      .oc-drop { border: 2px dashed var(--divider); border-radius: 8px; padding: 18px; text-align:center; color: var(--text-secondary); cursor:pointer; }
      .oc-drop:hover { border-color: var(--brand-primary); background: var(--brand-primary-bg); }
      .oc-att { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    `;
    document.head.appendChild(s);
  }

  const COUNTRIES = ['中国', '泰国', '越南', '印度', '日本', '新加坡', '马来西亚', '印度尼西亚', '菲律宾', '阿联酋', '沙特阿拉伯', '卡塔尔', '美国', '加拿大', '英国', '法国', '德国', '澳大利亚'];
  const SCOPES = ['全案', '定制柜', '门窗', '卫浴', '软装'];

  function typeFromName(name) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (ext === 'dwg' || ext === 'dxf') return 'dwg';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].indexOf(ext) >= 0) return 'img';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'xls';
    if (['zip', 'rar', '7z'].indexOf(ext) >= 0) return 'zip';
    return 'pdf';
  }

  function build(form) {
    return `<div class="oc-form" id="oc-form">
      <!-- 项目信息 -->
      <div class="oc-sec">
        <div class="oc-sec-title">① 项目信息</div>
        <div class="oc-grid">
          <div class="oc-item full"><label>项目名称 <span class="req">*</span></label><input class="oc-input" id="oc-name" placeholder="例：张宅全案 · 别墅" value="${form.name}"></div>
          <div class="oc-item"><label>单据来源 <span class="req">*</span></label>
            <select class="oc-input" id="oc-source">
              <option ${form.source === '手动创建' ? 'selected' : ''}>手动创建</option>
              <option value="CRM" ${form.source === 'CRM' ? 'selected' : ''}>CRM 导入</option>
              <option value="OMS" ${form.source === 'OMS' ? 'selected' : ''}>OMS 导入</option>
            </select></div>
          <div class="oc-item"><label>项目类型 <span class="req">*</span></label>
            <select class="oc-input" id="oc-type">${['家装', '工装', '别墅'].map(t => `<option ${form.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="oc-item full"><label>设计范围 <span class="req">*</span>（可多选）</label>
            <div id="oc-scope" style="display:flex;flex-wrap:wrap;gap:6px;">
              ${SCOPES.map(s => `<span class="oc-chip${form.scope.indexOf(s) >= 0 ? ' active' : ''}" data-scope="${s}">${s}</span>`).join('')}
            </div></div>
          <div class="oc-item"><label>紧急程度 <span class="req">*</span></label>
            <div>${['正常', '加急', '特急'].map(u => `<label class="oc-radio"><input type="radio" name="oc-urgency" value="${u}" ${form.urgency === u ? 'checked' : ''}>${u}</label>`).join('')}</div></div>
          <div class="oc-item"><label>面积 (㎡) <span class="req">*</span></label><input class="oc-input" type="number" id="oc-area" placeholder="120" value="${form.area}"></div>
          <div class="oc-item"><label>国家 / 地区 <span class="req">*</span></label>
            <select class="oc-input" id="oc-country">${COUNTRIES.map(c => `<option ${form.country === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="oc-item"><label>设计期望工期（天） <span class="req">*</span></label><input class="oc-input" type="number" id="oc-duration" placeholder="30" value="${form.duration}"></div>
          <div class="oc-item full"><label>项目备注 / 设计方向</label><textarea class="oc-textarea" id="oc-remark" rows="3" placeholder="风格偏好、参考案例、特殊要求…">${form.remark}</textarea></div>
          <div class="oc-item full"><label>项目附件 <span class="req">*</span>（CAD / 需求文档 / 图片 / Excel / ZIP）</label>
            <div class="oc-drop" id="oc-drop"><div style="font-size:26px;">📎</div><div>点击上传附件（支持多类型多文件）</div></div>
            <input type="file" id="oc-file" multiple style="display:none;">
            <div style="display:flex;gap:8px;margin-top:8px;">
              <input class="oc-input" id="oc-att-name" placeholder="或手动录入文件名，例：户型平面图.pdf" style="flex:1;">
              <select class="oc-input" id="oc-att-type" style="width:130px;">
                <option value="dwg">CAD 图纸</option><option value="pdf">PDF/文档</option><option value="img">图片</option><option value="xls">Excel</option><option value="zip">压缩包</option>
              </select>
              <button class="btn btn-default" id="oc-att-add" type="button">添加</button>
            </div>
            <div class="oc-att" id="oc-att-list"></div>
          </div>
        </div>
      </div>

      <!-- 客户与预算 -->
      <div class="oc-sec">
        <div class="oc-sec-title">② 客户与预算</div>
        <div class="oc-grid">
          <div class="oc-item"><label>客户名称 <span class="req">*</span></label><input class="oc-input" id="oc-cust" placeholder="张先生 / Mr. Kumar" value="${form.cust}"></div>
          <div class="oc-item"><label>客户联系方式</label><input class="oc-input" id="oc-phone" placeholder="手机号 或 邮箱" value="${form.phone}"></div>
          <div class="oc-item"><label>客户等级 <span class="req">*</span></label>
            <div>${['普通', 'VIP'].map(l => `<label class="oc-radio"><input type="radio" name="oc-clevel" value="${l}" ${form.custLevel === l ? 'checked' : ''}>${l}</label>`).join('')}</div></div>
          <div class="oc-item"><label>期望完成时间 <span class="req">*</span></label><input class="oc-input" type="date" id="oc-deadline" value="${form.deadline}"></div>
          <div class="oc-item full"><label>预算区间（万元） <span class="req">*</span></label>
            <div style="display:flex;gap:8px;align-items:center;"><input class="oc-input" type="number" id="oc-bmin" placeholder="80" value="${form.budgetMin}"><span>~</span><input class="oc-input" type="number" id="oc-bmax" placeholder="120" value="${form.budgetMax}"></div></div>
        </div>
      </div>

      <!-- 协作 -->
      <div class="oc-sec">
        <div class="oc-sec-title">③ 对接与协作</div>
        <div class="oc-grid">
          <div class="oc-item"><label>PM（销售负责人）</label>
            <select class="oc-input" id="oc-pm"><option>许光（东南亚 · L5）</option><option>刘 PM（华东）</option></select></div>
          <div class="oc-item"><label>是否需要协调员 <span class="req">*</span></label>
            <div>${[['yes', '是'], ['no', '否 (PM 自己对接)']].map(x => `<label class="oc-radio"><input type="radio" name="oc-coord" value="${x[0]}" ${form.needCoord === x[0] ? 'checked' : ''}>${x[1]}</label>`).join('')}</div></div>
          <div class="oc-item full" id="oc-coord-wrap">
            <label>协调员</label>
            <select class="oc-input" id="oc-coord-sel">
              <option value="">-- 系统推荐（按档期 / 客户区域）--</option>
              ${MOCK.designersByRole('协调员').map(d => `<option value="${d.id}">${d.name}（${MOCK.deptShort(d.dept)} · ${d.level}）</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="text-sm text-secondary" style="margin-top:10px;">提交后单据进入 <b>设计单池</b>，2D/3D 设计师团队将在 <b>智能分单</b> 环节按技能 / 负载 / 区域推荐分派。</div>
      </div>
    </div>`;
  }

  function ensureModal() {
    let mask = document.getElementById(MODAL_ID);
    if (mask) return mask;
    ensureStyle();
    mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.id = MODAL_ID;
    mask.innerHTML = `<div class="modal modal-lg"><div class="modal-header">
        <div><div class="modal-title">➕ 创建设计单</div><div class="text-sm text-secondary">填写后可直接入池或进入智能分单</div></div>
        <div class="modal-close" onclick="this.closest('.modal-mask').classList.remove('open')">✕</div>
      </div>
      <div class="modal-body" id="oc-modal-body" style="max-height:72vh;overflow-y:auto;"></div>
      <div class="modal-footer">
        <button class="btn btn-default" onclick="this.closest('.modal-mask').classList.remove('open')">取消</button>
        <button class="btn btn-ghost" id="oc-save-pool">保存入池</button>
        <button class="btn btn-primary" id="oc-save-assign">创建并去分单 →</button>
      </div></div>`;
    document.body.appendChild(mask);
    mask.addEventListener('click', e => { if (e.target === mask) mask.classList.remove('open'); });
    return mask;
  }

  function openModal(onDone) {
    const mask = ensureModal();
    const form = {
      name: '', source: '手动创建', type: '家装', scope: [], urgency: '正常', area: '', country: '中国', duration: '', remark: '',
      cust: '', phone: '', custLevel: '普通', budgetMin: '', budgetMax: '', deadline: '',
      pm: '许光（东南亚 · L5）', needCoord: 'yes', coord: '',
      attachments: [{ name: '客户CAD图纸.dwg', type: 'dwg' }, { name: '需求文档.pdf', type: 'pdf' }]
    };
    const body = mask.querySelector('#oc-modal-body');
    body.innerHTML = build(form);

    // 附件
    function renderAtt() {
      const box = body.querySelector('#oc-att-list');
      box.innerHTML = form.attachments.length
        ? form.attachments.map((f, i) => `<span class="tag tag-info" style="display:inline-flex;align-items:center;gap:6px;">${ATT_ICON[f.type] || '📎'} ${f.name}<span data-rm="${i}" style="cursor:pointer;font-weight:700;">×</span></span>`).join('')
        : '<span class="text-placeholder text-sm">尚未添加附件</span>';
      box.querySelectorAll('[data-rm]').forEach(x => x.addEventListener('click', () => { form.attachments.splice(+x.dataset.rm, 1); renderAtt(); }));
    }
    renderAtt();
    body.querySelector('#oc-drop').addEventListener('click', () => body.querySelector('#oc-file').click());
    body.querySelector('#oc-file').addEventListener('change', e => {
      const files = Array.from(e.target.files || []);
      files.forEach(f => form.attachments.push({ name: f.name, type: typeFromName(f.name) }));
      e.target.value = ''; renderAtt();
      if (files.length) global.toast && toast(`已添加 ${files.length} 个附件`, 'success');
    });
    body.querySelector('#oc-att-add').addEventListener('click', () => {
      const name = body.querySelector('#oc-att-name').value.trim();
      if (!name) { global.toast && toast('请填写文件名', 'warning'); return; }
      form.attachments.push({ name, type: body.querySelector('#oc-att-type').value });
      body.querySelector('#oc-att-name').value = ''; renderAtt();
    });

    // 设计范围 chip
    body.querySelectorAll('#oc-scope .oc-chip').forEach(c => c.addEventListener('click', () => {
      c.classList.toggle('active');
      const v = c.dataset.scope;
      if (c.classList.contains('active')) form.scope.push(v); else form.scope = form.scope.filter(x => x !== v);
    }));

    // 协调员显隐
    body.querySelectorAll('[name="oc-coord"]').forEach(r => r.addEventListener('change', e => {
      body.querySelector('#oc-coord-wrap').style.display = e.target.value === 'yes' ? '' : 'none';
    }));

    function collect() {
      form.name = body.querySelector('#oc-name').value.trim();
      form.source = body.querySelector('#oc-source').value;
      form.type = body.querySelector('#oc-type').value;
      form.urgency = body.querySelector('[name="oc-urgency"]:checked').value;
      form.area = body.querySelector('#oc-area').value;
      form.country = body.querySelector('#oc-country').value;
      form.duration = body.querySelector('#oc-duration').value;
      form.remark = body.querySelector('#oc-remark').value;
      form.cust = body.querySelector('#oc-cust').value.trim();
      form.phone = body.querySelector('#oc-phone').value;
      form.custLevel = body.querySelector('[name="oc-clevel"]:checked').value;
      form.deadline = body.querySelector('#oc-deadline').value;
      form.budgetMin = body.querySelector('#oc-bmin').value;
      form.budgetMax = body.querySelector('#oc-bmax').value;
      form.needCoord = body.querySelector('[name="oc-coord"]:checked').value;
      form.coord = body.querySelector('#oc-coord-sel').value;
    }
    function validate() {
      collect();
      if (!form.name || !form.area || form.scope.length === 0 || !form.duration) { global.toast && toast('请完成项目必填项（名称 / 面积 / 设计范围 / 工期）', 'warning'); return false; }
      if (form.attachments.length === 0) { global.toast && toast('请至少上传 1 个需求附件，否则设计师无法开工', 'warning'); return false; }
      if (!form.cust || !form.budgetMin || !form.deadline) { global.toast && toast('请完成客户必填项（客户 / 预算 / 期望完成时间）', 'warning'); return false; }
      return true;
    }

    mask.querySelector('#oc-save-pool').onclick = () => {
      if (!validate()) return;
      const o = MOCK.createOrder(form);
      mask.classList.remove('open');
      global.toast && toast(`已创建设计单 ${o.code}，进入设计单池`, 'success');
      if (onDone) onDone(o, 'pool');
    };
    mask.querySelector('#oc-save-assign').onclick = () => {
      if (!validate()) return;
      const o = MOCK.createOrder(form);
      mask.classList.remove('open');
      global.toast && toast(`已创建设计单 ${o.code}，前往智能分单`, 'success');
      if (onDone) onDone(o, 'assign');
      else location.href = (location.pathname.indexOf('/ops/') >= 0 ? './assign-board.html' : '../ops/assign-board.html');
    };

    mask.classList.add('open');
  }

  global.OrderCreate = { openModal };
})(window);
