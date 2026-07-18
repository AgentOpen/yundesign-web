/* 创建设计单 —— 共享弹窗组件（我的待办 / 设计单池 / 项目列表 复用，替代独立 create.html 页面）
 * 支持来源：手动创建 / CRM 导入 / OMS 导入
 *   - CRM 导入：多数字段由 CRM 推送（项目订单号 / 抵扣方案 / 建筑图纸 & 水单等），核对后创建
 *   - 紧急程度 & 面积：需要协调员时可留空（协调员接收后补充）；不需要协调员时创建即必填
 */
(function (global) {
  const MODAL_ID = 'order-create-modal';
  const ATT_ICON = { dwg: '📐', pdf: '📄', img: '🖼️', xls: '📊', zip: '🗜️' };
  const COUNTRIES = ['中国', '泰国', '越南', '印度', '日本', '新加坡', '马来西亚', '印度尼西亚', '菲律宾', '阿联酋', '沙特阿拉伯', '卡塔尔', '美国', '加拿大', '英国', '法国', '德国', '澳大利亚'];
  const SCOPES = ['全案', '定制柜', '门窗', '卫浴', '软装'];
  const CRM_SCOPES = ['全案设计', '单空间设计'];

  function ensureStyle() {
    if (document.getElementById('oc-style')) return;
    const s = document.createElement('style');
    s.id = 'oc-style';
    s.textContent = `
      .oc-form { font-size: 13px; }
      .oc-crm-banner { background: var(--info-bg); border: 1px solid #bcd0fa; color: var(--info); border-radius: 8px; padding: 10px 14px; font-size: 12.5px; margin-bottom: 14px; }
      .oc-sec { border-top: 1px solid var(--divider); padding-top: 16px; margin-top: 16px; }
      .oc-sec:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
      .oc-sec-title { font-weight: 600; margin-bottom: 12px; font-size: 14px; }
      .oc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .oc-grid .full { grid-column: 1 / -1; }
      @media (max-width: 640px){ .oc-grid { grid-template-columns: 1fr; } }
      .oc-item label { display:block; font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
      .oc-item .req { color: var(--danger); }
      .oc-item .hint { color: var(--warning); font-weight: 500; }
      .oc-input, .oc-textarea { width: 100%; height: 34px; border: 1px solid var(--border); border-radius: 6px; padding: 0 10px; font-size: 13px; }
      .oc-textarea { height: auto; padding: 8px 10px; resize: vertical; font-family: inherit; }
      .oc-chip { display:inline-flex; align-items:center; padding: 4px 12px; border:1px solid var(--border); border-radius: 999px; cursor:pointer; font-size:12px; user-select:none; }
      .oc-chip.active { background: var(--brand-primary-bg); border-color: var(--brand-primary); color: var(--brand-primary); font-weight:600; }
      .oc-radio { display:inline-flex; align-items:center; gap:4px; margin-right:12px; font-size:13px; cursor:pointer; }
      .oc-drop { border: 2px dashed var(--divider); border-radius: 8px; padding: 16px; text-align:center; color: var(--text-secondary); cursor:pointer; }
      .oc-drop:hover { border-color: var(--brand-primary); background: var(--brand-primary-bg); }
      .oc-att { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    `;
    document.head.appendChild(s);
  }

  function typeFromName(name) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (ext === 'dwg' || ext === 'dxf') return 'dwg';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].indexOf(ext) >= 0) return 'img';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'xls';
    if (['zip', 'rar', '7z'].indexOf(ext) >= 0) return 'zip';
    return 'pdf';
  }

  function plusDays(n) {
    const d = new Date(Date.now() + n * 86400000);
    const p = x => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function crmSample() {
    return {
      orderNo: 'CRM-' + (new Date().toISOString().slice(0, 10).replace(/-/g, '')) + '-' + String(Math.floor(100 + Math.random() * 900)),
      name: '龙湖·九里晴川 3-2-1101', type: '家装', crmScope: '全案设计', country: '中国',
      deadline: plusDays(60), remark: '现代轻奢，业主偏爱莫兰迪色系；参考案例见附件；主卧需独立衣帽间。',
      deductionPlan: '设计费 8.8 万，签约抵扣 2 万，尾款交付后结清', custLevel: 'VIP', cust: '龙湖客户 A21',
      budgetMin: 60, budgetMax: 90,
      attachments: [{ name: '建筑图纸.dwg', type: 'dwg' }, { name: '水单截图.jpg', type: 'img' }]
    };
  }

  function build(f) {
    const isCRM = f.source === 'CRM';
    const coordSupp = f.needCoord === 'yes'; // 需要协调员 → 紧急/面积可留空
    const req = '<span class="req">*</span>';
    const suppHint = '<span class="hint">（协调员接收后补充）</span>';
    return `<div class="oc-form" id="oc-form">
      ${isCRM ? `<div class="oc-crm-banner">🔗 本单来自 <b>CRM 推送</b>：项目订单号 / 项目资料 / 抵扣方案 / 建筑图纸 & 水单等已同步，请核对后创建。紧急程度与面积由 CRM 或协调员补充。</div>` : ''}
      <!-- 项目信息 -->
      <div class="oc-sec">
        <div class="oc-sec-title">① 项目信息</div>
        <div class="oc-grid">
          <div class="oc-item"><label>单据来源 ${req}</label>
            <select class="oc-input" id="oc-source">
              <option ${f.source === '手动创建' ? 'selected' : ''}>手动创建</option>
              <option value="CRM" ${f.source === 'CRM' ? 'selected' : ''}>CRM 导入</option>
              <option value="OMS" ${f.source === 'OMS' ? 'selected' : ''}>OMS 导入</option>
            </select></div>
          ${isCRM ? `<div class="oc-item"><label>项目订单号（CRM）${req}</label><input class="oc-input" id="oc-orderno" value="${f.orderNo || ''}" placeholder="CRM-YYYYMMDD-001"></div>` : '<div class="oc-item"></div>'}
          <div class="oc-item full"><label>项目名称 ${req}</label><input class="oc-input" id="oc-name" placeholder="例：张宅全案 · 别墅" value="${f.name}"></div>
          <div class="oc-item"><label>项目类型 ${req}</label>
            <select class="oc-input" id="oc-type">${['家装', '工装', '别墅'].map(t => `<option ${f.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="oc-item"><label>国家 / 地区 ${req}</label>
            <select class="oc-input" id="oc-country">${COUNTRIES.map(c => `<option ${f.country === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
          <div class="oc-item full"><label>设计范围 ${req}</label>
            ${isCRM
              ? `<div>${CRM_SCOPES.map(s => `<label class="oc-radio"><input type="radio" name="oc-crmscope" value="${s}" ${f.crmScope === s ? 'checked' : ''}>${s}</label>`).join('')}</div>`
              : `<div id="oc-scope" style="display:flex;flex-wrap:wrap;gap:6px;">${SCOPES.map(s => `<span class="oc-chip${f.scope.indexOf(s) >= 0 ? ' active' : ''}" data-scope="${s}">${s}</span>`).join('')}</div>`}
          </div>
          <div class="oc-item"><label>期望完成时间 ${req}</label><input class="oc-input" type="date" id="oc-deadline" value="${f.deadline}"></div>
          <div class="oc-item"><label>紧急程度 ${coordSupp ? suppHint : req}</label>
            <select class="oc-input" id="oc-urgency">
              <option value="" ${!f.urgency ? 'selected' : ''}>${coordSupp ? '（待协调员补充）' : '— 请选择 —'}</option>
              ${['正常', '加急', '特急'].map(u => `<option ${f.urgency === u ? 'selected' : ''}>${u}</option>`).join('')}
            </select></div>
          <div class="oc-item"><label>面积 (㎡) ${coordSupp ? suppHint : req}</label><input class="oc-input" type="number" id="oc-area" placeholder="${coordSupp ? '协调员接收后补充' : '120'}" value="${f.area}"></div>
          <div class="oc-item full"><label>风格备注 / 设计方向（风格偏好、参考案例、特殊要求）</label><textarea class="oc-textarea" id="oc-remark" rows="3" placeholder="风格偏好、参考案例、特殊要求…">${f.remark}</textarea></div>
          ${isCRM ? `<div class="oc-item full"><label>最终抵扣方案</label><input class="oc-input" id="oc-deduct" value="${f.deductionPlan || ''}" placeholder="如：设计费 8.8 万，签约抵扣 2 万，尾款结清"></div>` : ''}
          <div class="oc-item full"><label>项目附件 ${req}${isCRM ? '（CRM 已附：建筑图纸 / 水单截图）' : '（CAD / 需求文档 / 图片 / Excel / ZIP）'}</label>
            <div class="oc-drop" id="oc-drop"><div style="font-size:22px;">📎</div><div>点击上传附件（支持多类型多文件）</div></div>
            <input type="file" id="oc-file" multiple style="display:none;">
            <div style="display:flex;gap:8px;margin-top:8px;">
              <input class="oc-input" id="oc-att-name" placeholder="或手动录入文件名，例：户型平面图.pdf" style="flex:1;">
              <select class="oc-input" id="oc-att-type" style="width:130px;">
                <option value="dwg">建筑图纸/CAD</option><option value="img">水单/图片</option><option value="pdf">PDF/文档</option><option value="xls">Excel</option><option value="zip">压缩包</option>
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
          <div class="oc-item"><label>客户名称 ${req}</label><input class="oc-input" id="oc-cust" placeholder="张先生 / Mr. Kumar" value="${f.cust}"></div>
          <div class="oc-item"><label>客户联系方式</label><input class="oc-input" id="oc-phone" placeholder="手机号 或 邮箱" value="${f.phone}"></div>
          <div class="oc-item"><label>客户等级 ${req}</label>
            <div>${['普通', 'VIP'].map(l => `<label class="oc-radio"><input type="radio" name="oc-clevel" value="${l}" ${f.custLevel === l ? 'checked' : ''}>${l}</label>`).join('')}</div></div>
          <div class="oc-item"><label>预算区间（万元） ${req}</label>
            <div style="display:flex;gap:8px;align-items:center;"><input class="oc-input" type="number" id="oc-bmin" placeholder="80" value="${f.budgetMin}"><span>~</span><input class="oc-input" type="number" id="oc-bmax" placeholder="120" value="${f.budgetMax}"></div></div>
        </div>
      </div>

      <!-- 协作 -->
      <div class="oc-sec">
        <div class="oc-sec-title">③ 对接与协作</div>
        <div class="oc-grid">
          <div class="oc-item"><label>PM（销售负责人）</label>
            <select class="oc-input" id="oc-pm"><option>许光（东南亚 · L5）</option><option>刘 PM（华东）</option></select></div>
          <div class="oc-item"><label>是否需要协调员 ${req}</label>
            <div>${[['yes', '是（协调员补充紧急/面积并跟进）'], ['no', '否（创建时须填紧急/面积）']].map(x => `<label class="oc-radio"><input type="radio" name="oc-coord" value="${x[0]}" ${f.needCoord === x[0] ? 'checked' : ''}>${x[1]}</label>`).join('')}</div></div>
          <div class="oc-item full" id="oc-coord-wrap" style="${f.needCoord === 'yes' ? '' : 'display:none;'}">
            <label>协调员</label>
            <select class="oc-input" id="oc-coord-sel">
              <option value="">-- 系统推荐（按档期 / 客户区域）--</option>
              ${MOCK.designersByRole('协调员').map(d => `<option value="${d.id}" ${f.coord === d.id ? 'selected' : ''}>${d.name}（${MOCK.deptShort(d.dept)} · ${d.level}）</option>`).join('')}
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
    const body = mask.querySelector('#oc-modal-body');
    const form = {
      source: '手动创建', orderNo: '', name: '', type: '家装', scope: [], crmScope: '全案设计',
      urgency: '', area: '', country: '中国', deadline: '', remark: '', deductionPlan: '',
      cust: '', phone: '', custLevel: '普通', budgetMin: '', budgetMax: '',
      pm: '许光（东南亚 · L5）', needCoord: 'yes', coord: '',
      attachments: [{ name: '客户CAD图纸.dwg', type: 'dwg' }, { name: '需求文档.pdf', type: 'pdf' }]
    };
    let crmFilled = false;

    function renderAtt() {
      const box = body.querySelector('#oc-att-list');
      if (!box) return;
      box.innerHTML = form.attachments.length
        ? form.attachments.map((f, i) => `<span class="tag tag-info" style="display:inline-flex;align-items:center;gap:6px;">${ATT_ICON[f.type] || '📎'} ${f.name}<span data-rm="${i}" style="cursor:pointer;font-weight:700;">×</span></span>`).join('')
        : '<span class="text-placeholder text-sm">尚未添加附件</span>';
      box.querySelectorAll('[data-rm]').forEach(x => x.addEventListener('click', () => { form.attachments.splice(+x.dataset.rm, 1); renderAtt(); }));
    }

    function collect() {
      const q = id => body.querySelector(id);
      if (q('#oc-source')) form.source = q('#oc-source').value;
      if (q('#oc-orderno')) form.orderNo = q('#oc-orderno').value.trim();
      if (q('#oc-name')) form.name = q('#oc-name').value.trim();
      if (q('#oc-type')) form.type = q('#oc-type').value;
      if (q('#oc-country')) form.country = q('#oc-country').value;
      if (q('#oc-deadline')) form.deadline = q('#oc-deadline').value;
      if (q('#oc-urgency')) form.urgency = q('#oc-urgency').value;
      if (q('#oc-area')) form.area = q('#oc-area').value;
      if (q('#oc-remark')) form.remark = q('#oc-remark').value;
      if (q('#oc-deduct')) form.deductionPlan = q('#oc-deduct').value;
      const cscope = body.querySelector('[name="oc-crmscope"]:checked'); if (cscope) form.crmScope = cscope.value;
      if (q('#oc-cust')) form.cust = q('#oc-cust').value.trim();
      if (q('#oc-phone')) form.phone = q('#oc-phone').value;
      const cl = body.querySelector('[name="oc-clevel"]:checked'); if (cl) form.custLevel = cl.value;
      if (q('#oc-bmin')) form.budgetMin = q('#oc-bmin').value;
      if (q('#oc-bmax')) form.budgetMax = q('#oc-bmax').value;
      if (q('#oc-pm')) form.pm = q('#oc-pm').value;
      const nc = body.querySelector('[name="oc-coord"]:checked'); if (nc) form.needCoord = nc.value;
      if (q('#oc-coord-sel')) form.coord = q('#oc-coord-sel').value;
    }

    function render() {
      body.innerHTML = build(form);
      bind();
      renderAtt();
    }

    function bind() {
      // 来源切换
      body.querySelector('#oc-source').addEventListener('change', e => {
        collect(); form.source = e.target.value;
        if (form.source === 'CRM' && !crmFilled) {
          const s = crmSample();
          Object.assign(form, s);
          form.needCoord = 'yes';
          crmFilled = true;
        }
        render();
      });
      // 附件
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
      // 设计范围 chip（手动模式）
      body.querySelectorAll('#oc-scope .oc-chip').forEach(c => c.addEventListener('click', () => {
        c.classList.toggle('active');
        const v = c.dataset.scope;
        if (c.classList.contains('active')) form.scope.push(v); else form.scope = form.scope.filter(x => x !== v);
      }));
      // 是否需要协调员 → 影响紧急/面积必填 + 协调员显隐（重渲染）
      body.querySelectorAll('[name="oc-coord"]').forEach(r => r.addEventListener('change', () => { collect(); render(); }));
    }

    render();

    function validate() {
      collect();
      const scopeOk = form.source === 'CRM' ? !!form.crmScope : form.scope.length > 0;
      if (!form.name || !scopeOk || !form.deadline) { global.toast && toast('请完成项目必填项（名称 / 设计范围 / 期望完成时间）', 'warning'); return false; }
      if (form.source === 'CRM' && !form.orderNo) { global.toast && toast('CRM 单据请填写项目订单号', 'warning'); return false; }
      if (form.needCoord === 'no') {
        if (!form.urgency || !form.area) { global.toast && toast('未选择协调员，须在创建时填写紧急程度与面积', 'warning'); return false; }
      }
      if (form.attachments.length === 0) { global.toast && toast('请至少上传 1 个需求附件，否则设计师无法开工', 'warning'); return false; }
      if (!form.cust || !form.budgetMin) { global.toast && toast('请完成客户必填项（客户 / 预算）', 'warning'); return false; }
      return true;
    }

    function doCreate() {
      const payload = Object.assign({}, form);
      if (form.source === 'CRM') payload.scope = [form.crmScope];
      return MOCK.createOrder(payload);
    }

    mask.querySelector('#oc-save-pool').onclick = () => {
      if (!validate()) return;
      const o = doCreate();
      mask.classList.remove('open');
      global.toast && toast(`已创建设计单 ${o.code}${o.needSupplement ? '（待协调员补充紧急/面积）' : ''}，进入设计单池`, 'success');
      if (onDone) onDone(o, 'pool');
    };
    mask.querySelector('#oc-save-assign').onclick = () => {
      if (!validate()) return;
      const o = doCreate();
      mask.classList.remove('open');
      global.toast && toast(`已创建设计单 ${o.code}，前往智能分单`, 'success');
      if (onDone) onDone(o, 'assign');
      else location.href = (location.pathname.indexOf('/ops/') >= 0 ? './assign-board.html' : '../ops/assign-board.html');
    };

    mask.classList.add('open');
  }

  global.OrderCreate = { openModal };
})(window);
